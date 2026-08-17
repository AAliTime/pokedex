from pydantic import BaseModel
from typing import List, Optional
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    favorites: List[str] = []  # Default to empty list if not provided

class FavoritesUpdate(BaseModel):
    username: str
    favorites: List[str]