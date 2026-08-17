from fastapi import FastAPI, HTTPException
from api.models import UserCreate, UserResponse
import json

app = FastAPI(
    title="Inicio de sesión",
    description="Pantalla de inicio de sesión y registro"
)

with open("api/data.json", "r") as jsonData:
    data = json.load(jsonData)

@app.get("/users/{username}")
def getUser(username: str):
    if username not in data:
        raise HTTPException(status_code=401, detail="Credenciales erróneas o usuario no registrado")
    else:
        return data.get(username)

@app.post("/register")
def createUser(post: UserCreate) -> UserResponse:
    newUser = {"username": post.username, "password": post.password}
    data["users"].append(newUser)
    with open("api/data.json", "w") as jsonData:
        json.dump(data, jsonData, indent=4)
    return newUser                  #type: ignore

""" testeando queries
@app.get("/users")
def readUsers(limit: int = None):   #type: ignore
    if limit: 
        return list(data.values())[:limit]
    return data
"""

subapp = FastAPI(
    title="Pokédex API",
    description="Información de todos los pokémon",
    version="3.0"
)

@subapp.get("/pokemon")
def pokemon():
    return {
        "username": "{username}",
        "id": "{id}",
        "types": "{types}",
        "stats": "{stats}",
        "sprite": "{default_front}",
    }


app.mount("/pokemon", subapp)

