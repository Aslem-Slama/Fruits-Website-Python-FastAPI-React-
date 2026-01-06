import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi import HTTPException
import time
import threading
import sqlite3



class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]


app =FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


DB_PATH = "fruits.db"
db_lock = threading.Lock()
dirty = False # it is true if the memory has changed and it must be saved to the db
stop_event = threading.Event(); #is used to stop the thread when the program shuts down

#initialise the db
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS fruits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()









memory_db = {"fruits": []}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits = memory_db.get("fruits"))

@app.post("/fruits", response_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit

@app.delete("/fruits/{fruit_name}")
def remove_fruit(fruit_name: str):
    fruits = memory_db["fruits"]

    fruit_to_remove = None

    for fruit in fruits:
        if fruit.name.lower() == fruit_name.lower():
            fruit_to_remove = fruit
            break

    if fruit_to_remove is None:
        raise HTTPException(status_code=404, detail="Fruit not found")


    fruits.remove(fruit_to_remove)

    return fruit_to_remove


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)




