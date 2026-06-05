from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class BaseRequest(BaseModel):
    user_id: Optional[str] = None
    method: str
    payload: Dict[str, Any]

class SkillPayload(BaseModel):
    skills: List[str]

class InterestPayload(BaseModel):
    interest_id: str

class RiasecPayload(BaseModel):
    riasec_scores: Dict[str, float]