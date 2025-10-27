import json
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["model_loaded"] is True

def test_predict_monotonic_area():
    f = dict(bedrooms=3, bathrooms=2, area_sqm=120, age_years=8, location_index=4)
    y1 = client.post("/predict/flat", json=f).json()["predicted_price"]
    f["area_sqm"] = 180
    y2 = client.post("/predict/flat", json=f).json()["predicted_price"]
    assert y2 > y1

def test_validation_fail():
    bad = dict(bedrooms=0, bathrooms=2, area_sqm=120, age_years=8, location_index=4)
    r = client.post("/predict/flat", json=bad)
    assert r.status_code == 422
