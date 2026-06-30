from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Kit Medico API"
    version: str = "0.1.0"
    debug: bool = False

    # CORS — separar con comas en .env: ALLOWED_ORIGINS=http://localhost:5173,https://ejemplo.com
    allowed_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
