import sys
import os

# biar bisa akses folder scripts/
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# ===== REQUEST SCHEMA =====
class BaseRequest(BaseModel):
    user_id: str
    method: str
    payload: dict


# ===== ROOT =====
@app.get("/")
def home():
    return {"message": "AI API running"}


# ===== PREDICT =====
@app.post("/predict")
def predict_api(data: BaseRequest):

    if data.method not in ["interest", "skill", "riasec"]:
        raise HTTPException(status_code=400, detail="Method tidak valid")

    try:
        
        # DUMMY RESPONSE (SEMENTARA)

        if data.method == "skill":
            result = {
                "chart_data": {
                    "labels": ["Data Scientist", "ML Engineer", "Data Analyst"],
                    "scores": [92.5, 85.0, 78.3]
                },
                "recommendations": [
                    {
                        "role_id": "ROLE_001",
                        "role_name": "Data Scientist",
                        "match_pct": 88.7,
                        "description": "Ahli dalam mengolah data besar untuk insight bisnis.",
                        "salary_range": "8jt - 20jt",
                        "skill_gap": ["Machine Learning", "Statistics"]
                    }
                ]
            }

        elif data.method == "interest":
            result = {
                "chart_data": None,
                "recommendations": [
                    {
                        "role_id": "ROLE_002",
                        "role_name": "UI/UX Designer",
                        "match_pct": 80.5,
                        "description": "Fokus pada desain pengalaman pengguna.",
                        "salary_range": "6jt - 15jt",
                        "skill_gap": []
                    }
                ]
            }

        elif data.method == "riasec":
            result = {
                "chart_data": None,
                "recommendations": [
                    {
                        "role_id": "ROLE_003",
                        "role_name": "Software Engineer",
                        "match_pct": 85.2,
                        "description": "Mengembangkan aplikasi dan sistem software.",
                        "salary_range": "7jt - 18jt",
                        "skill_gap": ["Python", "TensorFlow"]
                    }
                ]
            }

        return {
            "status": "success",
            "method_used": data.method,
            "data": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))