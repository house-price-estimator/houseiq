# houseiq-ml/tests/test_api.py
import math
from fastapi.testclient import TestClient  # kept for type awareness in IDEs

def test_health_ok(client: TestClient):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    # allow either simple text or json; only assert it's "healthy"-ish
    assert data or res.text

def test_predict_happy_path(client: TestClient):
    payload = {
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area_sqm": 120.5,
            "age_years": 8,
            "location_index": 4
        }
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))
    # price should be finite number
    assert not math.isinf(float(data["predicted_price"])) and not math.isnan(float(data["predicted_price"]))
    # optional fields (don’t fail if absent)
    if "model_version" in data:
        assert isinstance(data["model_version"], str)
    if "explanations" in data or "top_contributors" in data:
        pass  # explanations are optional; UI handles both cases

def test_predict_happy_path_flat(client: TestClient):
    payload = {
        "bedrooms": 3,
        "bathrooms": 2,
        "area_sqm": 120.5,
        "age_years": 8,
        "location_index": 4
    }
    res = client.post("/predict/flat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))
    # price should be finite number
    assert not math.isinf(float(data["predicted_price"])) and not math.isnan(float(data["predicted_price"]))
    # optional fields (don’t fail if absent)
    if "model_version" in data:
        assert isinstance(data["model_version"], str)
    if "explanations" in data or "top_contributors" in data:
        pass  # explanations are optional; UI handles both cases

def test_predict_monotonic_area_flat(client: TestClient):
    f = {
        "bedrooms": 3,
        "bathrooms": 2,
        "area_sqm": 120.5,
        "age_years": 8,
        "location_index": 4,
    }
    res1 = client.post("/predict/flat", json=f)
    assert res1.status_code == 200
    y1 = res1.json()["predicted_price"]
    f["area_sqm"] = 180.0
    res2 = client.post("/predict/flat", json=f)
    assert res2.status_code == 200
    y2 = res2.json()["predicted_price"]
    assert y2 > y1

def test_predict_validation_out_of_range_bedrooms(client: TestClient):
    payload = {
        "features": {
            "bedrooms": 0,  # invalid (server enforces 1–7)
            "bathrooms": 2,
            "area_sqm": 120.5,
            "age_years": 8,
            "location_index": 4
        }
    }
    res = client.post("/predict", json=payload)
    # FastAPI/Pydantic often returns 422; some services map to 400. Accept either.
    assert res.status_code in (400, 422)

def test_predict_missing_feature(client: TestClient):
    payload = {
        "features": {
            # "bathrooms" missing
            "bedrooms": 3,
            "area_sqm": 120.5,
            "age_years": 8,
            "location_index": 4
        }
    }
    res = client.post("/predict", json=payload)
    assert res.status_code in (400, 422)
