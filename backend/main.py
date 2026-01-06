import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]


app =FastAPI()

origins = [
    "http://localhost:3000"
]