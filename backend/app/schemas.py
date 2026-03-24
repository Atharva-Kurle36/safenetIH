from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    email_text: str = Field(default="", description="Raw email body/content to inspect.")
    url: str = Field(default="", description="URL found in the email or reported by user.")


class AnalyzeResponse(BaseModel):
    result: str
    risk_score: int
    reasons: list[str]
    highlight_words: list[str]


class SimulationResponse(BaseModel):
    email_text: str
    type: str
    explanation: list[str]


class DashboardKPI(BaseModel):
    title: str
    value: str
    trend: str
    color: str
    kind: str


class DashboardActivityPoint(BaseModel):
    name: str
    safe: int
    phishing: int


class DashboardTrainingPoint(BaseModel):
    name: str
    score: int


class DashboardThreatRow(BaseModel):
    id: int
    type: str
    source: str
    score: int
    date: str


class DashboardMetricsResponse(BaseModel):
    kpis: list[DashboardKPI]
    activity_data: list[DashboardActivityPoint]
    training_scores: list[DashboardTrainingPoint]
    recent_threats: list[DashboardThreatRow]
    last_updated: str
