# scratch_check.py
import json
import joblib
import pandas as pd

model = joblib.load("model.joblib")

# keep feature order consistent with training
with open("model_meta.json") as f:
    FEATURES = json.load(f)["features"]

def predict_one(**features):
    df = pd.DataFrame([features])[FEATURES]  # ensure correct columns & order
    return float(model.predict(df)[0])

p1 = predict_one(bedrooms=3, bathrooms=2, area_sqm=120, age_years=8, location_index=4)
p2 = predict_one(bedrooms=3, bathrooms=2, area_sqm=180, age_years=8, location_index=4)

print(p1)
print(p2)
print("ratio p2/p1 =", p2 / p1)
