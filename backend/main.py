from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
import os
import requests
from google_places import router as google_places_router

app = FastAPI()
app.include_router(google_places_router)

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.environ.get("FASTAPI_SECRET", "supersecret")
ALGORITHM = "HS256"

class TokenExchangeRequest(BaseModel):
    access_token: str
    provider: str  # e.g. "google"
    email: str
    name: str

class TokenExchangeResponse(BaseModel):
    jwt: str

@app.post("/api/auth/exchange", response_model=TokenExchangeResponse)
def exchange_token(data: TokenExchangeRequest):
    # Here you would verify the access_token with the provider
    # For Google, you can use https://oauth2.googleapis.com/tokeninfo?id_token=...
    if data.provider == "google":
        resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={data.access_token}")
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")
        token_info = resp.json()
        if token_info.get("email") != data.email:
            raise HTTPException(status_code=401, detail="Email mismatch")
    # You can add more providers here

    # Create or update user in your DB here (omitted for brevity)

    # Issue FastAPI JWT
    payload = {
        "sub": data.email,
        "name": data.name,
        "provider": data.provider,
    }
    jwt_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"jwt": jwt_token}
