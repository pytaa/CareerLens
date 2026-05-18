from pydantic import BaseModel
from typing import Dict, Any, List


class BaseRequest(BaseModel):
    user_id: str
    method: str
    payload: Dict[str, Any]


# ===== OPTIONAL SCHEMAS =====

class SkillPayload(BaseModel):
    skills: List[str]


class InterestPayload(BaseModel):
    interest_id: str


class RiasecPayload(BaseModel):
    riasec_scores: Dict[str, float]