# train.py
from __future__ import annotations
import argparse, json, time
from pathlib import Path


import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error


# feature columns
FEATURES = [
    "bedrooms", "bathrooms", "area_sqm", "age_years", "location_index"
]
TARGET = "price"


# Mean Absolute Percentage Error -> Outputs MAPE
def mape(y_true, y_pred):
    y_true = np.asarray(y_true)
    y_pred = np.asarray(y_pred)
    # mean(abs((y_true - y_pred)/y_true))) * 100
    # noinspection PyTypeChecker
    return float(np.mean(np.abs((y_true - y_pred) / np.clip(y_true, 1e-9, None))) * 100.0)


# Training Function: takes data path and seed as input
def train(data_path: Path, seed: int = 42):

    # 1. Obtain Data
    df = pd.read_parquet(data_path)
    X = df[FEATURES]
    y = df[TARGET]

    # 2. Split data
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=seed)

    # 3. Create Model
    model = RandomForestRegressor(
        n_estimators=400,  # number of trees (Higher = more stable but slower)
        max_depth=None,    # trees grow until leaves are pure or too small
        min_samples_leaf=1,# smalled allowed leaf size
        n_jobs=-1,         # use all CPU Cores
        random_state=seed, # reproducible model
    )


    # 4. Fit data to model
    t0 = time.time() # record T0
    model.fit(X_train, y_train)
    train_time = time.time() - t0 # Time = current time - T0

    # 5. Predict
    pred = model.predict(X_val)

    # 6. Metrics
    mae = float(mean_absolute_error(y_val, pred))                # Mean Absolute Error
    mse  = mean_squared_error(y_val, pred)                       # Mean Squared Error
    rmse = float(np.sqrt(mse))                                   # Root Mean Square Error
    mape_val = mape(y_val, pred)                                 # Mean Absolute Percentage Error


    # 7. Collect Stats
    metrics = {
        "MAE": mae,
        "RMSE": rmse,
        "MAPE%": mape_val,
        "val_size": int(len(y_val)),
        "train_time_sec": round(train_time, 3),
    }

    # 8. Return model and stats
    return model, metrics



# CLI Interface
def main():
    ap = argparse.ArgumentParser() # init CLI
    ap.add_argument("--data", type=Path, default=Path("data/synth_train.parquet")) # location of training data
    ap.add_argument("--out", type=Path, default=Path("model.joblib"))              # path to store trained model
    ap.add_argument("--meta", type=Path, default=Path("model_meta.json"))          # path to store metadata
    ap.add_argument("--version", type=str, default="rf-1.0.0")                     # version string for traceability
    ap.add_argument("--seed", type=int, default=42)                                # specify seed for reproducibility
    args = ap.parse_args()

    # train model
    model, metrics = train(args.data, args.seed)

    # persist trained model to disk
    joblib.dump(model, args.out)

    # prepare metadata
    meta = {
        "model_version": args.version,
        "framework": "sklearn",
        "algo": "RandomForestRegressor",
        "features": FEATURES,
        "seed": args.seed,
        "metrics": metrics,
    }
    # write metadata to path
    args.meta.write_text(json.dumps(meta, indent=2))

    # output summary
    print("Saved model to:", args.out)
    print("Saved meta to:", args.meta)
    print("Metrics:", json.dumps(metrics, indent=2))




if __name__ == "__main__":
    main()
