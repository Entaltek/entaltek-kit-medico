from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_response_shape():
    response = client.get("/api/v1/health")
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "Kit Medico API"
    assert body["version"] == "0.1.0"


def test_health_content_type():
    response = client.get("/api/v1/health")
    assert "application/json" in response.headers["content-type"]
