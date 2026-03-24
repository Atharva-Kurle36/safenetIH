from fastapi import APIRouter

from app.schemas import DashboardMetricsResponse
from app.services.dashboard_service import dashboard_telemetry


router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/metrics", response_model=DashboardMetricsResponse)
def dashboard_metrics() -> DashboardMetricsResponse:
    payload = dashboard_telemetry.metrics_payload()
    return DashboardMetricsResponse(**payload)
