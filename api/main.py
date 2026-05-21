from fastapi import FastAPI
from api.routes import router

import uvicorn

app = FastAPI(
    title="CareerLens API",
    description="""
    AI-powered career recommendation system
    using Deep Learning and RIASEC analysis.
    """,
    version="1.0.0"
)

# register routes
app.include_router(router)


@app.get("/")
def home():

    return {
        "status": "success",
        "message": "CareerLens API running"
    }


if __name__ == "__main__":

    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )