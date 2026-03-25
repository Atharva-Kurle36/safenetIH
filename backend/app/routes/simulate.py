from fastapi import APIRouter, HTTPException

from app.schemas import SimulationAssistantRequest, SimulationAssistantResponse, SimulationResponse
from app.services.ai_service import get_simulation_assistant_answer
from app.services.simulation_service import generate_simulated_email


router = APIRouter(tags=["simulation"])


@router.get("/simulate", response_model=SimulationResponse)
def simulate() -> SimulationResponse:
    sample = generate_simulated_email()
    return SimulationResponse(**sample)


@router.post("/simulate/assistant", response_model=SimulationAssistantResponse)
def simulation_assistant(data: SimulationAssistantRequest) -> SimulationAssistantResponse:
    answer = get_simulation_assistant_answer(
        question=data.question,
        email_text=data.email_text,
        indicators=data.indicators,
    )
    if not answer:
        raise HTTPException(
            status_code=503,
            detail="AI assistant is unavailable. Check GROQ_API_KEY and backend AI service status.",
        )
    return SimulationAssistantResponse(answer=answer)
