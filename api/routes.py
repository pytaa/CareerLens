import tensorflow as tf

from fastapi import APIRouter, HTTPException

from api.schemas import BaseRequest

from src.data_loader import DatasetLoader
from src.inference import predict

# IMPORT CUSTOM LAYER & LOSS
from src.layers import (
    SkillEmbeddingLayer,
    CosineSimilarityLayer
)

from src.losses import WeightedMatchingLoss

router = APIRouter()


# =========================
# LOAD DATASET
# =========================
loader = DatasetLoader(
    data_dir="dataset"
).load()


# =========================
# LOAD TRAINED SKILL MODEL
# =========================
skill_model = tf.keras.models.load_model(

    "saved_model/skill_model_final.keras",

    custom_objects={

        "SkillEmbeddingLayer": SkillEmbeddingLayer,

        "CosineSimilarityLayer": CosineSimilarityLayer,

        "WeightedMatchingLoss": WeightedMatchingLoss
    },

    compile=False
)


# =========================
# LOAD TRAINED RIASEC MODEL
# =========================
riasec_model = tf.keras.models.load_model(

    "saved_model/riasec_model_final.keras",

    custom_objects={

        "CosineSimilarityLayer": CosineSimilarityLayer,

        "WeightedMatchingLoss": WeightedMatchingLoss
    },

    compile=False
)


# =========================
# HOME ENDPOINT
# =========================
@router.get("/")
def home():

    return {
        "status": "success",
        "message": "CareerLens API running"
    }


# =========================
# PREDICT ENDPOINT
# =========================
@router.post("/predict")
def predict_api(data: BaseRequest):

    try:

        result = predict(

            method=data.method,

            payload=data.payload,

            loader=loader,

            skill_model=skill_model,

            riasec_model=riasec_model
        )

        return result

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

        roadmap = loader.get_roadmap_by_role(
            role_id
        )

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