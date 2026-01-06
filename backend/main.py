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
    weight: float

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

memory_db = {"fruits": []}


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
            name TEXT NOT NULL,
            weight REAL NOT NULL DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()


def load_from_db_into_memory():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT name, weight FROM fruits")
    rows = cur.fetchall()

    conn.close()

    fruits_list = []
    for row in rows:
        fruits_list.append(Fruit(name=row[0], weight=row[1]))

    db_lock.acquire()
    try:
        memory_db["fruits"] = fruits_list
    finally:
        db_lock.release()





def save_memory_to_db_if_dirty():
    global dirty
    db_lock.acquire()
    try:
        if not dirty:
            return

        snapshot = []
        for f in memory_db["fruits"]:
            snapshot.append(f.name)

        dirty = False
    finally:
        db_lock.release()

    # write snapshot to DB without holding lock to make the program faster
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("DELETE FROM fruits")
    for item in snapshot:
        name = item[0]
        weight = item[1]
        cur.execute("INSERT INTO fruits (name, weight) VALUES (?, ?)", (name, weight))

    conn.commit()
    conn.close()







def autosave_loop():
    while not stop_event.is_set():
        time.sleep(60)               # wait 60 seconds
        save_memory_to_db_if_dirty()








# The FastAPI part

@app.on_event("startup")
def when_program_starts():
    init_db()
    load_from_db_into_memory()
    threading.Thread(target=autosave_loop, daemon=True).start()

@app.on_event("shutdown")
def when_program_shuts_down():
    stop_event.set()
    save_memory_to_db_if_dirty()



@app.get("/fruits", response_model=Fruits)
def get_fruits():
    db_lock.acquire()
    try:
        return Fruits(fruits=memory_db["fruits"])
    finally:
        db_lock.release()






@app.post("/fruits", response_model=Fruit)
def add_fruit(fruit: Fruit):
    global dirty
    db_lock.acquire()
    try:
        fruits = memory_db["fruits"]

        for f in fruits:
            if f.name.lower() == fruit.name.lower():
                f.weight = f.weight + fruit.weight
                dirty = True
                return f

        fruits.append(fruit)
        dirty = True
        return fruit

    finally:
        db_lock.release()





@app.delete("/fruits/{fruit_name}")
def remove_fruit(fruit_name: str):
    global dirty
    db_lock.acquire()

    try:
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
    finally:
        db_lock.release()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)




