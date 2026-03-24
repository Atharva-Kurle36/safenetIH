from fastapi import APIRouter

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.phishing_service import analyze_payload


router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(data: AnalyzeRequest) -> AnalyzeResponse:
    result = analyze_payload(email_text=data.email_text, url=data.url)
    return AnalyzeResponse(**result)
