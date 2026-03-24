from fastapi import APIRouter

from app.schemas import SimulationResponse
from app.services.simulation_service import generate_simulated_email


router = APIRouter(tags=["simulation"])


@router.get("/simulate", response_model=SimulationResponse)
def simulate() -> SimulationResponse:
    sample = generate_simulated_email()
    return SimulationResponse(**sample)
