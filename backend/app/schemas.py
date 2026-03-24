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
