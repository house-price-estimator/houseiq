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

    # 3. Create Model - OPTIMIZED FOR SIZE
    model = RandomForestRegressor(
        n_estimators=50,      # Reduced from 400 to 50 (8x smaller)
        max_depth=15,         # Limited depth (was None/unlimited)
        min_samples_leaf=5,   # Increased from 1 (reduces overfitting & size)
        min_samples_split=10, # Additional constraint to reduce tree size
        max_features='sqrt',  # Use sqrt of features (standard practice)
        n_jobs=-1,            # use all CPU Cores
        random_state=seed,    # reproducible model
    )

    # 4. Fit data to model
    t0 = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - t0

    # 5. Predict
    pred = model.predict(X_val)

    # 6. Metrics
    mae = float(mean_absolute_error(y_val, pred))
    mse  = mean_squared_error(y_val, pred)
    rmse = float(np.sqrt(mse))
    mape_val = mape(y_val, pred)

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
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=Path, default=Path("data/synth_train.parquet"))
    ap.add_argument("--out", type=Path, default=Path("model.joblib"))
    ap.add_argument("--meta", type=Path, default=Path("model_meta.json"))
    ap.add_argument("--version", type=str, default="rf-2.0.0")  # Updated version
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--compress", type=int, default=3, help="Compression level 0-9 (higher = smaller file)")
    args = ap.parse_args()

    # train model
    model, metrics = train(args.data, args.seed)

    # persist trained model with compression
    # Compression levels: 0 (no compression) to 9 (max compression)
    # Level 3 is a good balance between size and speed
    joblib.dump(model, args.out, compress=args.compress)

    # prepare metadata
    meta = {
        "model_version": args.version,
        "framework": "sklearn",
        "algo": "RandomForestRegressor",
        "features": FEATURES,
        "seed": args.seed,
        "metrics": metrics,
        "compression": args.compress,
    }
    # write metadata to path
    args.meta.write_text(json.dumps(meta, indent=2))

    # output summary
    print("Saved model to:", args.out)
    print("Saved meta to:", args.meta)
    print("Metrics:", json.dumps(metrics, indent=2))
    
    # Print file size
    import os
    size_mb = os.path.getsize(args.out) / (1024 * 1024)
    print(f"Model size: {size_mb:.2f} MB")


if __name__ == "__main__":
    main()