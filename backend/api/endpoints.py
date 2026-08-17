from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.api.models import UserCreate, UserResponse, FavoritesUpdate
from backend.services.services import formatPokemon, fetchPokemon
import json, os

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
    allow_headers=["*"],
)

DATA_FILE = "backend/api/data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"users": []}
    with open(DATA_FILE, "r") as jsonData:
        return json.load(jsonData)

def save_data(data):
    with open(DATA_FILE, "w") as jsonData:
        json.dump(data, jsonData, indent=4)

@app.post("/login")
def login(credentials: UserCreate):
    data = load_data()
    users = data.get("users", [])

    user = next(
        (u for u in users if u["username"] == credentials.username and u["password"] == credentials.password),
        None
    )

    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Credenciales erróneas o usuario no registrado"
        )

    # Return stored favorites along with login info
    return {
        "username": user["username"], 
        "favorites": user.get("favorites", []),
        "message": "Inicio de sesión exitoso"
    }

@app.post("/register", response_model=UserResponse)
def createUser(credentials: UserCreate):
    data = load_data()
    users = data.get("users", [])

    if any(u["username"] == credentials.username for u in users):
        raise HTTPException(
            status_code=400, 
            detail="El nombre de usuario ya está registrado"
        )

    # Initialize user with an empty favorites list
    newUser = {
        "username": credentials.username, 
        "password": credentials.password,
        "favorites": []
    }
    data["users"].append(newUser)
    save_data(data)

    return UserResponse(username=credentials.username, favorites=[])

# ----------------------------------------------------
# FAVORITES ENDPOINTS
# ----------------------------------------------------
@app.get("/favorites/{username}")
def get_favorites(username: str):
    data = load_data()
    users = data.get("users", [])
    user = next((u for u in users if u["username"] == username), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    return {"favorites": user.get("favorites", [])}

@app.post("/favorites")
def update_favorites(payload: FavoritesUpdate):
    data = load_data()
    users = data.get("users", [])
    user = next((u for u in users if u["username"] == payload.username), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    user["favorites"] = payload.favorites
    save_data(data)
    
    return {"message": "Favoritos actualizados", "favorites": user["favorites"]}

# Subapp for Pokédex API
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
    allow_headers=["*"],
)

@subapp.get("/{id}")
def getPokemon(id: str):
    return formatPokemon(fetchPokemon(id))

app.mount("/pokemon", subapp)