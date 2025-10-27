# generate_data.py
from __future__ import annotations # postpone evaluation of type hints
import argparse                    # argument parsing
from pathlib import Path           # path handling
import numpy as np
import pandas as pd


# --- Feature schema (MVP) ---
# bedrooms: int [1..7]
# bathrooms: int [1..5]
# area_sqm: float [20..450]
# age_years: int [0..60]
# location_index: int [0..9]


# data generation function: n = rows, seed = randomness for reproducibility, Returns a DataFrame
def gen_synthetic(n: int, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)                                                                                   # init random generator

    # location tiers: 10 discrete buckets -> price per sqm bands
    base_ppsqm = np.linspace(8000, 45000, 10) #0..9 index                                                #creates 10 values between 8K and 45K

    # area: Gamma distribution (right-skewed) , clipped
    # mean = shape*scale; variance=shape*scale^2; mode=(shape-1)*scale.                                                 # With shape at 4 and scale at 25, mean=100, variance=50, mode=75
    area_sqm = rng.gamma(shape=4.0, scale=25.0, size=n) + 20.0                                                          # this means areas centre around +- 100m2 with a long tail upward
    area_sqm = np.clip(area_sqm, 20.0, 450.0)                                                              # parameters can be modified for tuning
                                                                                                                        # clip to reduce outliers
    # bedrooms influenced by area (bigger home = more bedrooms)
    bed_probs = np.clip((area_sqm - 20.0) / 430.0, 0, 1)                                                   # parameter to determine bedrooms amount, scales with house size
    bedrooms = 1 + (rng.binomial(3, bed_probs) + rng.binomial(3, bed_probs * 0.6))                                # Bernoulli trials with p = bed_probs, 1-3 is the baseline, 4+ is 60% of the probability
    bedrooms = np.clip(bedrooms, 1, 7)                                                                     # remove outliers

    # bathrooms correlated with bedrooms
    bathrooms = 1 + (bedrooms // 2) + rng.integers(0, 2, size=n)                                              # 1 + beds//2 + random 0-1
    bathrooms = np.clip(bathrooms, 1, 5)                                                                   # remove outliers

    # age: truncated normal around ~20 years
    age_years = np.clip(rng.normal(20, 12, size=n).round().astype(int), 0, 60)                   # draw from normal dist, mean=20, sd=12

    # location bucket
    location_index = rng.integers(0, 10, size=n)                                                              # random locations

    # base price mechanics (multiplicative with noise)
    base_price_sqm = base_ppsqm[location_index]                                                                         # each row's base price is pulled from the base_ppsqm linspace

    # quality uplift: rooms
    # Neutral Baseline: 3 beds, 2 baths. Uplift = 1.00 at the baseline.
    # More or less than baseline will result in +-6% for beds and +-4% for baths
    room_uplift = (1 + 0.06 * (bedrooms - 3) + 0.04 * (bathrooms - 2))

    # age depreciation (smooth exponential with floor)
    age_dep = np.exp(-0.012 * age_years) #25y -> 0.74x
    age_dep = np.clip(age_dep, 0.55, 1.0) # floored at 55% for very old homes

    # raw price (before noise)
    price = area_sqm * base_price_sqm * room_uplift * age_dep # Price = area size * base price based on location * room uplift * depreciation

    # market noise ( mean=1.0/no change, std dev= 6%. This means that depending on the market, the price may vary +-6%
    noise = rng.normal(1.0, 0.06, size=n)
    noise = np.clip(noise, 0.8, 1.25) # clip and 80% and 125%
    price = price * noise # FINAL Calculated price

    # Sanity bounds, no house can be less than 150K or more than 20M
    price = np.clip(price, 150_000.0, 20_000_000.0)

    df = pd.DataFrame({                                                                                                 # save table, use astype for a stable schema
        "bedrooms": bedrooms.astype(int),
        "bathrooms": bathrooms.astype(int),
        "area_sqm" : area_sqm.astype(float),
        "age_years": age_years.astype(int),
        "location_index": location_index.astype(int),
        "price": price.astype(float),
    })
    return df


def main():  # CLI Wrapper - Lets you run your code in CLI and specify the parameters
    ap = argparse.ArgumentParser()  # create a instance of argparse
    ap.add_argument("--rows", type=int, default=20000)  # optional(--), convert to int, default val = 20K, You can specify the rows
    ap.add_argument("--seed", type=int, default=42)     # specify the seed
    ap.add_argument("--out", type=Path, default=Path("data/synth_train.parquet")) # specify the storage path for data
    args = ap.parse_args() # parse the actual CLI input and return a Namespace with attributes .rows, .seed, .out

    args.out.parent.mkdir(parents=True, exist_ok=True)  # ensure/create an output folder at the specified path
    df = gen_synthetic(args.rows, args.seed)            # run gen function and pass args
    df.to_parquet(args.out, index=False)                # convert to Parquet and save to path
    print(f"Wrote {len(df):,} rows to {args.out}")      # summary of output

if __name__ == "__main__":
    main()

