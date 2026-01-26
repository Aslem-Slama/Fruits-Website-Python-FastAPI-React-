## Smart Fridge Inventory Assistant 🧊🤖

This is a full-stack project that treats a database as a virtual refrigerator / pantry.
You can add or remove items (with quantities), and a simple chat interface helps you decide what you can prepare based on what’s currently available.

## FEATURES

1. Inventory (CRUD)

   * Add items and quantities
   * List current inventory
   * Remove a specific amount from an item
   * Clear the whole inventory

2. Persistent Storage

   * Uses SQLite
   * Keeps an in-memory cache and auto-saves changes

3. Chat Assistant

   * Minimal chat UI (React) that sends messages to the backend
   * Backend keeps a per-session chat history
   * Future goal: meal suggestions based on inventory + user preferences


##############################################################

How to start the App:

Clone from the Repository:
https://github.com/Aslem-Slama/Fruits-Website-Python-FastAPI-React-.git

Open the file: ".env" in the "Backend" folder and add your Gemini Key.

Open the Terminal and browse to:
.\Backend
Type:
"python -m venv venv
venv\Scripts\activate"
to activate the virtual environment.

Type:
"pip install -r .\requirements.txt"
to install required resources.

Type:
"uvicorn main:app --reload"
to start the server app.

##############################
Open a new terminal and browse to the .\frontend folder.
Type:
"npm install
npm run dev"
to run the frontend part.
Then open on your browser:
http://localhost:5173/
