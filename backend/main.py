import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from fastapi import HTTPException
import time
import threading
import sqlite3
from fastapi import Query
from fastapi import Header
import os
from dotenv import load_dotenv
from google import genai
from ai_config import COOKING_ASSISTANT_CONTEXT
import json

chat_histories = {}

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

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
            snapshot.append((f.name, f.weight))

        dirty = False
    finally:
        db_lock.release()

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


@app.delete("/fruits", )
def clear_all_fruits():
    global dirty

    db_lock.acquire()
    try:
        memory_db["fruits"] = []
        dirty = True
    finally:
        db_lock.release()

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("DELETE FROM fruits")
    conn.commit()
    conn.close()

    return {"message": "All fruits cleared"}



@app.delete("/fruits/{fruit_name}", response_model= Fruit)
def remove_fruit(fruit_name: str, weight: float = Query(...)):
    global dirty

    db_lock.acquire()
    try:
        fruits = memory_db["fruits"]

        target = None
        for f in fruits:
            if f.name.lower() == fruit_name.lower():
                target = f
                break

        if target is None:
            raise HTTPException(status_code=404, detail="Fruit not found")

        target.weight = target.weight - weight
        dirty = True

        if target.weight <= 0:
            fruits.remove(target)
            return Fruit(name=target.name, weight=0)

        return target
    finally:
        db_lock.release()


def get_refrigerator_contents():
    db_lock.acquire()
    try:
        ingredients = []
        for f in memory_db["fruits"]:
            ingredients.append(f"{f.name}: {f.weight}kg")
        return ingredients
    finally:
        db_lock.release()

def deduct_ingredients(ingredient_list):
    global dirty
    db_lock.acquire()
    try:
        fruits = memory_db["fruits"]
        for ingredient in ingredient_list:
            name = ingredient["name"].lower()
            weight_to_remove = ingredient["weight"]

            for f in fruits:
                if f.name.lower() == name:
                    f.weight -= weight_to_remove
                    dirty = True
                    if f.weight <= 0:
                        fruits.remove(f)
                    break
    finally:
        db_lock.release()

load_dotenv()
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def gemini_reply(history):
    prompt = "\n".join([f"{m['role']}: {m['content']}" for m in history[-20:]]) + "\nassistant:"
    r = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return r.text or ""



@app.post("/ai/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest, x_session_id: str = Header(default="default")):
    history = chat_histories.setdefault(x_session_id, [])

    if req.message.strip() == "":
        if not history:
            reply = "Hi! What do you want to prepare?\n- breakfast\n- lunch\n- dinner\n- special"
            history.append({"role": "assistant", "content": reply})
            return ChatResponse(reply=reply)

        for m in reversed(history):
            if m["role"] == "assistant":
                return ChatResponse(reply=m["content"])

        reply = "Hi! What do you want to prepare?\n- breakfast\n- lunch\n- dinner\n- special"
        history.append({"role": "assistant", "content": reply})
        return ChatResponse(reply=reply)

    history.append({"role": "user", "content": req.message})

    reply = gemini_reply(history)

    history.append({"role": "assistant", "content": reply})
    return ChatResponse(reply=reply)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
