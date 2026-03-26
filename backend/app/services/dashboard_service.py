from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from datetime import datetime, timedelta

from app.services.mongo_client import mongo_connection


def _to_percent_change(current: int, previous: int) -> str:
    if previous <= 0:
        if current <= 0:
            return "+0%"
        return "+100%"

    delta = ((current - previous) / previous) * 100
    prefix = "+" if delta >= 0 else ""
    return f"{prefix}{round(delta)}%"


def _human_time_ago(ts: datetime) -> str:
    delta = datetime.utcnow() - ts
    seconds = int(delta.total_seconds())
    if seconds < 60:
        return "just now"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} min ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours} hours ago"
    days = hours // 24
    return f"{days} days ago"


@dataclass
class AnalysisEvent:
    timestamp: datetime
    result: str
    risk_score: int
    source_type: str
    source: str


class DashboardTelemetryStore:
    def __init__(self) -> None:
        self.analysis_events: deque[AnalysisEvent] = deque(maxlen=5000)
        self.simulation_events: deque[datetime] = deque(maxlen=5000)
        self._threat_counter = 0

    def record_analysis(self, email_text: str, url: str, result: str, risk_score: int) -> None:
        source_type = "URL" if url.strip() else "Email"
        if url.strip():
            source = url.strip()
        else:
            first_line = email_text.strip().splitlines()[0] if email_text.strip() else "(empty payload)"
            source = first_line[:96]

        event = AnalysisEvent(
            timestamp=datetime.utcnow(),
            result=result,
            risk_score=max(0, min(100, int(risk_score))),
            source_type=source_type,
            source=source,
        )
        self.analysis_events.append(event)

    def record_simulation_generated(self) -> None:
        self.simulation_events.append(datetime.utcnow())

    def _activity_data_last_7_days(self) -> list[dict[str, int | str]]:
        now = datetime.utcnow()
        days: list[datetime] = [now - timedelta(days=i) for i in range(6, -1, -1)]
        rows: list[dict[str, int | str]] = []

        for day in days:
            day_start = datetime(day.year, day.month, day.day)
            day_end = day_start + timedelta(days=1)

            safe_count = 0
            phishing_count = 0
            for event in self.analysis_events:
                if day_start <= event.timestamp < day_end:
                    if event.result.lower() == "phishing":
                        phishing_count += 1
                    else:
                        safe_count += 1

            rows.append(
                {
                    "name": day_start.strftime("%a"),
                    "safe": safe_count,
                    "phishing": phishing_count,
                }
            )

        return rows

    def _training_scores_last_5_weeks(self) -> list[dict[str, int | str]]:
        now = datetime.utcnow()
        rows: list[dict[str, int | str]] = []

        for i in range(4, -1, -1):
            week_end = now - timedelta(weeks=i)
            week_start = week_end - timedelta(days=7)

            scans = [e for e in self.analysis_events if week_start <= e.timestamp < week_end]
            simulations = [s for s in self.simulation_events if week_start <= s < week_end]

            if scans:
                safe_ratio = sum(1 for e in scans if e.result.lower() != "phishing") / len(scans)
                base = 55 + int(safe_ratio * 35)
            else:
                base = 60

            engagement_bonus = min(8, len(simulations) // 2)
            score = max(0, min(100, base + engagement_bonus))

            rows.append({"name": f"Week {5 - i}", "score": score})

        return rows

    def _recent_high_risk_threats(self, limit: int = 8) -> list[dict[str, int | str]]:
        risky = [e for e in self.analysis_events if e.result.lower() == "phishing" and e.risk_score >= 50]
        risky.sort(key=lambda e: e.timestamp, reverse=True)

        rows: list[dict[str, int | str]] = []
        for idx, event in enumerate(risky[:limit], start=1):
            rows.append(
                {
                    "id": idx,
                    "type": event.source_type,
                    "source": event.source,
                    "score": event.risk_score,
                    "date": _human_time_ago(event.timestamp),
                }
            )
        return rows

    def metrics_payload(self) -> dict[str, object]:
        total_scans = len(self.analysis_events)
        blocked = sum(1 for e in self.analysis_events if e.result.lower() == "phishing")
        avg_risk = int(round(sum(e.risk_score for e in self.analysis_events) / total_scans)) if total_scans else 0
        training_completion = min(100, 40 + len(self.simulation_events) * 2)

        now = datetime.utcnow()
        recent_window_start = now - timedelta(days=7)
        previous_window_start = now - timedelta(days=14)

        recent_scans = [e for e in self.analysis_events if e.timestamp >= recent_window_start]
        previous_scans = [e for e in self.analysis_events if previous_window_start <= e.timestamp < recent_window_start]

        recent_blocked = sum(1 for e in recent_scans if e.result.lower() == "phishing")
        previous_blocked = sum(1 for e in previous_scans if e.result.lower() == "phishing")

        recent_avg = int(round(sum(e.risk_score for e in recent_scans) / len(recent_scans))) if recent_scans else 0
        previous_avg = int(round(sum(e.risk_score for e in previous_scans) / len(previous_scans))) if previous_scans else 0

        return {
            "kpis": [
                {
                    "title": "Total Emails Scanned",
                    "value": str(total_scans),
                    "trend": _to_percent_change(len(recent_scans), len(previous_scans)),
                    "color": "text-blue-500",
                    "kind": "scans",
                },
                {
                    "title": "Threats Blocked",
                    "value": str(blocked),
                    "trend": _to_percent_change(recent_blocked, previous_blocked),
                    "color": "text-danger",
                    "kind": "blocked",
                },
                {
                    "title": "Training Completion",
                    "value": f"{training_completion}%",
                    "trend": f"+{min(15, len(self.simulation_events))}%",
                    "color": "text-secondary",
                    "kind": "training",
                },
                {
                    "title": "Avg. Risk Score",
                    "value": str(avg_risk),
                    "trend": _to_percent_change(recent_avg, previous_avg),
                    "color": "text-yellow-500",
                    "kind": "risk",
                },
            ],
            "activity_data": self._activity_data_last_7_days(),
            "training_scores": self._training_scores_last_5_weeks(),
            "recent_threats": self._recent_high_risk_threats(),
            "last_updated": datetime.utcnow().isoformat(),
        }


class MongoDashboardTelemetryStore:
    def __init__(self) -> None:
        try:
            from pymongo import MongoClient
        except Exception as exc:
            raise RuntimeError(f"pymongo is unavailable: {exc}") from exc

        self.client = MongoClient(mongo_connection.uri, serverSelectionTimeoutMS=2000)
        self.client.admin.command("ping")
        self.db = self.client[mongo_connection.db_name]

        self.analysis_collection = self.db["analysis_events"]
        self.simulation_collection = self.db["simulation_events"]

        self.analysis_collection.create_index("timestamp")
        self.analysis_collection.create_index("result")
        self.analysis_collection.create_index("risk_score")
        self.simulation_collection.create_index("timestamp")

    def record_analysis(self, email_text: str, url: str, result: str, risk_score: int) -> None:
        source_type = "URL" if url.strip() else "Email"
        if url.strip():
            source = url.strip()
        else:
            first_line = email_text.strip().splitlines()[0] if email_text.strip() else "(empty payload)"
            source = first_line[:96]

        self.analysis_collection.insert_one(
            {
                "timestamp": datetime.utcnow(),
                "result": result,
                "risk_score": max(0, min(100, int(risk_score))),
                "source_type": source_type,
                "source": source,
            }
        )

    def record_simulation_generated(self) -> None:
        self.simulation_collection.insert_one({"timestamp": datetime.utcnow()})

    def _activity_data_last_7_days(self) -> list[dict[str, int | str]]:
        now = datetime.utcnow()
        rows: list[dict[str, int | str]] = []

        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_start = datetime(day.year, day.month, day.day)
            day_end = day_start + timedelta(days=1)

            safe_count = self.analysis_collection.count_documents(
                {
                    "timestamp": {"$gte": day_start, "$lt": day_end},
                    "result": {"$ne": "Phishing"},
                }
            )
            phishing_count = self.analysis_collection.count_documents(
                {
                    "timestamp": {"$gte": day_start, "$lt": day_end},
                    "result": "Phishing",
                }
            )

            rows.append(
                {
                    "name": day_start.strftime("%a"),
                    "safe": int(safe_count),
                    "phishing": int(phishing_count),
                }
            )

        return rows

    def _training_scores_last_5_weeks(self) -> list[dict[str, int | str]]:
        now = datetime.utcnow()
        rows: list[dict[str, int | str]] = []

        for i in range(4, -1, -1):
            week_end = now - timedelta(weeks=i)
            week_start = week_end - timedelta(days=7)

            scans = list(
                self.analysis_collection.find(
                    {"timestamp": {"$gte": week_start, "$lt": week_end}},
                    {"result": 1},
                )
            )
            simulations = self.simulation_collection.count_documents(
                {"timestamp": {"$gte": week_start, "$lt": week_end}}
            )

            if scans:
                safe_ratio = sum(1 for e in scans if e.get("result", "").lower() != "phishing") / len(scans)
                base = 55 + int(safe_ratio * 35)
            else:
                base = 60

            engagement_bonus = min(8, int(simulations) // 2)
            score = max(0, min(100, base + engagement_bonus))

            rows.append({"name": f"Week {5 - i}", "score": score})

        return rows

    def _recent_high_risk_threats(self, limit: int = 8) -> list[dict[str, int | str]]:
        cursor = self.analysis_collection.find(
            {"result": "Phishing", "risk_score": {"$gte": 50}}
        ).sort("timestamp", -1).limit(limit)

        rows: list[dict[str, int | str]] = []
        for idx, event in enumerate(cursor, start=1):
            timestamp = event.get("timestamp", datetime.utcnow())
            rows.append(
                {
                    "id": idx,
                    "type": event.get("source_type", "Email"),
                    "source": event.get("source", "(unknown source)"),
                    "score": int(event.get("risk_score", 0)),
                    "date": _human_time_ago(timestamp),
                }
            )
        return rows

    def metrics_payload(self) -> dict[str, object]:
        total_scans = int(self.analysis_collection.count_documents({}))
        blocked = int(self.analysis_collection.count_documents({"result": "Phishing"}))

        avg_result = list(
            self.analysis_collection.aggregate(
                [{"$group": {"_id": None, "avg": {"$avg": "$risk_score"}}}]
            )
        )
        avg_risk = int(round(avg_result[0]["avg"])) if avg_result and avg_result[0].get("avg") is not None else 0

        simulation_count = int(self.simulation_collection.count_documents({}))
        training_completion = min(100, 40 + simulation_count * 2)

        now = datetime.utcnow()
        recent_window_start = now - timedelta(days=7)
        previous_window_start = now - timedelta(days=14)

        recent_scans = int(
            self.analysis_collection.count_documents({"timestamp": {"$gte": recent_window_start}})
        )
        previous_scans = int(
            self.analysis_collection.count_documents(
                {"timestamp": {"$gte": previous_window_start, "$lt": recent_window_start}}
            )
        )

        recent_blocked = int(
            self.analysis_collection.count_documents(
                {"timestamp": {"$gte": recent_window_start}, "result": "Phishing"}
            )
        )
        previous_blocked = int(
            self.analysis_collection.count_documents(
                {
                    "timestamp": {"$gte": previous_window_start, "$lt": recent_window_start},
                    "result": "Phishing",
                }
            )
        )

        recent_avg_result = list(
            self.analysis_collection.aggregate(
                [
                    {"$match": {"timestamp": {"$gte": recent_window_start}}},
                    {"$group": {"_id": None, "avg": {"$avg": "$risk_score"}}},
                ]
            )
        )
        previous_avg_result = list(
            self.analysis_collection.aggregate(
                [
                    {
                        "$match": {
                            "timestamp": {"$gte": previous_window_start, "$lt": recent_window_start}
                        }
                    },
                    {"$group": {"_id": None, "avg": {"$avg": "$risk_score"}}},
                ]
            )
        )

        recent_avg = (
            int(round(recent_avg_result[0]["avg"]))
            if recent_avg_result and recent_avg_result[0].get("avg") is not None
            else 0
        )
        previous_avg = (
            int(round(previous_avg_result[0]["avg"]))
            if previous_avg_result and previous_avg_result[0].get("avg") is not None
            else 0
        )

        return {
            "kpis": [
                {
                    "title": "Total Emails Scanned",
                    "value": str(total_scans),
                    "trend": _to_percent_change(recent_scans, previous_scans),
                    "color": "text-blue-500",
                    "kind": "scans",
                },
                {
                    "title": "Threats Blocked",
                    "value": str(blocked),
                    "trend": _to_percent_change(recent_blocked, previous_blocked),
                    "color": "text-danger",
                    "kind": "blocked",
                },
                {
                    "title": "Training Completion",
                    "value": f"{training_completion}%",
                    "trend": f"+{min(15, simulation_count)}%",
                    "color": "text-secondary",
                    "kind": "training",
                },
                {
                    "title": "Avg. Risk Score",
                    "value": str(avg_risk),
                    "trend": _to_percent_change(recent_avg, previous_avg),
                    "color": "text-yellow-500",
                    "kind": "risk",
                },
            ],
            "activity_data": self._activity_data_last_7_days(),
            "training_scores": self._training_scores_last_5_weeks(),
            "recent_threats": self._recent_high_risk_threats(),
            "last_updated": datetime.utcnow().isoformat(),
        }


class DashboardTelemetryFacade:
    """Use Mongo telemetry whenever it is available after startup; otherwise fallback to memory."""

    def __init__(self) -> None:
        self._memory_store = DashboardTelemetryStore()
        self._mongo_store: MongoDashboardTelemetryStore | None = None

    def _current_store(self) -> DashboardTelemetryStore | MongoDashboardTelemetryStore:
        if mongo_connection.enabled:
            if self._mongo_store is None:
                try:
                    self._mongo_store = MongoDashboardTelemetryStore()
                except Exception as exc:
                    print(f"Mongo telemetry init failed, falling back to memory: {exc}")
                    return self._memory_store
            return self._mongo_store

        return self._memory_store

    def record_analysis(self, email_text: str, url: str, result: str, risk_score: int) -> None:
        store = self._current_store()
        store.record_analysis(email_text=email_text, url=url, result=result, risk_score=risk_score)

    def record_simulation_generated(self) -> None:
        store = self._current_store()
        store.record_simulation_generated()

    def metrics_payload(self) -> dict[str, object]:
        store = self._current_store()
        return store.metrics_payload()


dashboard_telemetry = DashboardTelemetryFacade()
