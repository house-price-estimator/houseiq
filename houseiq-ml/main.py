# main.py
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Dict


import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, conint, confloat


# init fastapi web app
app = FastAPI(title="HouseIQ ML Service", version="2.0.0")

#---------------------------------------------------------------------------------------
# CORS
#---------------------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#---------------------------------------------------------------------------------------
# Config
#---------------------------------------------------------------------------------------

MODEL = None
FEATURES_ORDER = ["bedrooms", "bathrooms", "area_sqm", "age_years", "location_index"]
MODEL_VERSION = "unknown"
FEATURE_IMPORTANCES: Dict[str, float] | None = None


#---------------------------------------------------------------------------------------
# ioMODELS
#---------------------------------------------------------------------------------------

class Features(BaseModel):
    bedrooms: conint(ge=1, le=7)
    bathrooms: conint(ge=1, le=5)
    area_sqm: confloat(gt=0, le=1000)
    age_years: conint(ge=0, le=120)
    location_index: conint(ge=0, le=10)

class PredictRequest(BaseModel):
    features: Features

class PredictResponse(BaseModel):
    predicted_price: float
    model_version: str
    explanations: Dict[str, float] | None = None


#---------------------------------------------------------------------------------------
# Startup event - load model, get meta data
#---------------------------------------------------------------------------------------

@app.on_event("startup")
def load_model()-> None:
    global MODEL, FEATURES_ORDER, MODEL_VERSION, FEATURE_IMPORTANCES
    model_path = Path(os.getenv("MODEL_PATH", "model.joblib"))
    meta_path = Path(os.getenv("META_PATH", "model_meta.json"))

    if not model_path.exists():
        raise RuntimeError(f"Model_PATH not found: {model_path}")
    MODEL = joblib.load(model_path)

    if meta_path.exists():
        meta = json.loads(meta_path.read_text())
        MODEL_VERSION = str(meta.get("model_version", MODEL_VERSION))
        feat = meta.get("features")
        if isinstance(feat, list) and feat:
            FEATURES_ORDER = feat
        fi = meta.get("feature_importances")
        if isinstance(fi, dict):
            FEATURE_IMPORTANCES = {k: float(v) for k, v in fi.items() if k in FEATURES_ORDER}


#---------------------------------------------------------------------------------------
# Health checks
#---------------------------------------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "model_version": MODEL_VERSION,
        "features": FEATURES_ORDER,
    }


#---------------------------------------------------------------------------------------
# Prediction
#---------------------------------------------------------------------------------------
# helper to run a prediction given a plain dict
# takes a dict as input and returns a prediction
def _predict_dict(d: Dict[str, float]) -> float:
    if MODEL is None:
        raise RuntimeError("Model not loaded")
    # Build 1 row DF, reordered to exact FEATURES_ORDER
    df = pd.DataFrame([d])[FEATURES_ORDER]
    y = float(MODEL.predict(df)[0])
    return y # return prediction

def _compute_explanations(d: Dict[str, float]) -> Dict[str, float]:
    # Prefer provided feature importances; normalize to sum 1.0
    if FEATURE_IMPORTANCES and len(FEATURE_IMPORTANCES) > 0:
        total = sum(abs(v) for v in FEATURE_IMPORTANCES.values()) or 1.0
        return {k: (abs(FEATURE_IMPORTANCES.get(k, 0.0)) / total) for k in FEATURES_ORDER}
    # Fallback: equal weights
    n = len(FEATURES_ORDER) or 1
    return {k: 1.0 / n for k in FEATURES_ORDER}


# End point: Predict
# this endpoint expects a JSON with {features: {x:1,y:2,...}}
@app.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest):
    try:
        f = body.features.model_dump() # features dict
        y = _predict_dict(f) # get prediction
        explanations = _compute_explanations(f)
        return PredictResponse(predicted_price=y, model_version=MODEL_VERSION, explanations=explanations)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Also a prediction endpoint, just safely handles flat payloads
# this endpoint expects a JSON with {x:1,y:2,...}
@app.post("/predict/flat", response_model=PredictResponse)
def predict_flat(features: Features):
    try:
        f = features.model_dump()
        y = _predict_dict(f)
        explanations = _compute_explanations(f)
        return PredictResponse(predicted_price=y, model_version=MODEL_VERSION, explanations=explanations)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))





#---------------------------------------------------------------------------------------
# Service Start
#---------------------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
