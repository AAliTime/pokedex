from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.api.models import UserCreate, UserResponse
from backend.services.services import formatPokemon, fetchPokemon
import json

app = FastAPI(
    title="Inicio de sesión",
    description="Pantalla de inicio de sesión y registro"
)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

with open("backend/api/data.json", "r") as jsonData:
    data = json.load(jsonData)

@app.get("/users/{username}")
def getUser(username: str):
    if username not in data:
        raise HTTPException(status_code=401, detail="Credenciales erróneas o usuario no registrado")
    else:
        return data.get(username)

@app.post("/register")
def createUser(credentials: UserCreate) -> UserResponse:
    newUser = {"username": credentials.username, "password": credentials.password}
    data["users"].append(newUser)
    with open("backend/api/data.json", "w") as jsonData:
        json.dump(data, jsonData, indent=4)
    return newUser                  #type: ignore

subapp = FastAPI(
    title="Pokédex API",
    description="Información de todos los pokémon",
    version="3.0"
)        

subapp.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

@subapp.get("/{id}")
def getPokemon(id: str):
    return formatPokemon(fetchPokemon(id))     #wtffffff sí funciona qué bendición

app.mount("/pokemon", subapp)

