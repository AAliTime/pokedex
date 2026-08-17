from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', 
                                      env_file_encoding="utf-8")
    app_name: str = "Pokédex"
    api_url: str = ""                 #POR FINNNNNNNNNNNNNN y solo tuve que mover config fuera de la carpeta