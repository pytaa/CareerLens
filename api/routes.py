import numpy as np

from fastapi import APIRouter, HTTPException

from api.schemas import BaseRequest

from src.data_loader import DatasetLoader
from src.model import (
    build_skill_model,
    build_riasec_model
)

router = APIRouter()


# =========================
# LOAD DATASET
# =========================
loader = DatasetLoader(data_dir="dataset").load()


# =========================
# LOAD MODEL
# =========================
skill_model = build_skill_model(
    n_skills=len(loader.skill_vocab)
)

riasec_model = build_riasec_model()


# =========================
# PREDICT ENDPOINT
# =========================
@router.post("/predict")
def predict_api(data: BaseRequest):

    try:

        # ==================================================
        # SKILL METHOD
        # ==================================================
        if data.method == "skill":

            user_skills = data.payload.get("skills", [])

            if not user_skills:
                raise HTTPException(
                    status_code=400,
                    detail="skills kosong"
                )

            user_vector = loader.encode_user_skills(
                user_skills
            )

            role_matrix = loader.get_role_skill_matrix()

            recommendations = []

            for idx in range(len(role_matrix)):

                role_vector = role_matrix[idx]

                pred = skill_model.predict(
                    [
                        user_vector,
                        np.array([role_vector])
                    ],
                    verbose=0
                )

                score = float(
                    pred["role_score"][0][0]
                )

                recommendations.append({
                    "role_id": str(idx),

                    "role_name": str(
                        loader.df_master.iloc[idx].iloc[0]
                    ),

                    "match_pct": round(score, 2)
                })

            recommendations = sorted(
                recommendations,
                key=lambda x: x["match_pct"],
                reverse=True
            )[:5]

            return {
                "status": "success",
                "method": "skill",
                "recommendations": recommendations
            }

        # ==================================================
        # INTEREST METHOD
        # ==================================================
        elif data.method == "interest":

            field_id = data.payload.get("interest_id")

            if not field_id:
                raise HTTPException(
                    status_code=400,
                    detail="interest_id kosong"
                )

            df = loader.df_master

            recommendations = []

            for idx, row in df.iterrows():

                field_value = str(row.iloc[1])

                if field_id.lower() in field_value.lower():

                    recommendations.append({
                        "role_id": str(idx),

                        "role_name": str(row.iloc[0]),

                        "field": field_value
                    })

            return {
                "status": "success",
                "method": "interest",
                "recommendations": recommendations[:5]
            }

        # ==================================================
        # RIASEC METHOD
        # ==================================================
        elif data.method == "riasec":

            scores = data.payload.get("riasec_scores")

            if not scores:
                raise HTTPException(
                    status_code=400,
                    detail="riasec_scores kosong"
                )

            user_vector = np.array([[
                scores["R"],
                scores["I"],
                scores["A"],
                scores["S"],
                scores["E"],
                scores["C"]
            ]], dtype=np.float32)

            role_matrix = loader.get_role_riasec_matrix()

            recommendations = []

            for idx in range(len(role_matrix)):

                role_vector = role_matrix[idx]

                pred = riasec_model.predict(
                    [
                        user_vector,
                        np.array([role_vector])
                    ],
                    verbose=0
                )

                score = float(pred[0][0])

                recommendations.append({
                    "role_id": str(idx),

                    "role_name": str(
                        loader.df_master.iloc[idx].iloc[0]
                    ),

                    "match_pct": round(score, 2)
                })

            recommendations = sorted(
                recommendations,
                key=lambda x: x["match_pct"],
                reverse=True
            )[:5]

            return {
                "status": "success",
                "method": "riasec",
                "recommendations": recommendations
            }

        else:
            raise HTTPException(
                status_code=400,
                detail="Method tidak valid"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# ROADMAP ENDPOINT
# =========================
@router.get("/roadmap/{role_id}")
def get_roadmap(role_id: str):

    try:

        roadmap = loader.get_roadmap_by_role(role_id)

        return {
            "status": "success",
            "role_id": role_id,
            "roadmap": roadmap
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )