from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="SyncCook Agent Service")

@app.get("/ping")
def ping():
    return {"pong": True}