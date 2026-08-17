import requests
from fastapi import HTTPException
from config import Settings

settings = Settings()       #perdí 3 años de vida investigando cómo hacer esto
API_URL = settings.API_URL.rstrip('/')


def fetchPokemon(id: str):
    pokemonURL = f"{API_URL}/{id}"
    response = requests.get(pokemonURL)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Pokémon no encontrado")
    return response

def formatPokemon(response) -> dict:
    pokemonAllData = response.json()
    Stats = [
        {"name": stat["stat"]["name"], "base_stat": stat["base_stat"]}
        for stat in pokemonAllData.get("stats", [])
        ]
    
    pokemonData = {"name": pokemonAllData.get("name"), 
                   "id": pokemonAllData.get("id"), 
                   "types": [t["type"]["name"] for t in pokemonAllData.get("types", [])], 
                   "stats": Stats, 
                   "sprite": pokemonAllData.get("sprites", {}).get("front_default")}

    return pokemonData



#No me puedo creer que funcione dios mio