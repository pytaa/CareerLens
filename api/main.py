from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="CareerLens API",
    version="1.0.0"
)

# include semua routes
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "CareerLens AI API running"
    }