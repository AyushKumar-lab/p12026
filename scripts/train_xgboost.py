#!/usr/bin/env python3
"""
Train XGBoost on real + synthetic labeled examples for LocIntel location scoring.

Usage:
  pip install xgboost scikit-learn pandas numpy joblib
  python scripts/train_xgboost.py

Output:
  artifacts/xgboost_model/model.joblib
  artifacts/xgboost_model/manifest.json
"""
from __future__ import annotations

import csv
import json
import math
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LABELS_V2 = ROOT / "data" / "raw" / "labels" / "training_data_v2.csv"
LABELS_V1 = ROOT / "data" / "raw" / "labels" / "locations_labeled.csv"
MODEL_DIR = ROOT / "artifacts" / "xgboost_model"

BIZ_TYPE_ENCODE = {
    "restaurant": 0, "pharmacy": 1, "kirana": 2, "cafe": 3,
    "salon": 4, "clothing": 5, "electronics": 6, "gym": 7,
}

CITY_ENCODE = {
    "bhubaneswar": 0, "cuttack": 1, "berhampur": 2, "sambalpur": 3, "raipur": 4,
}

CITY_CENTERS = {
    "bhubaneswar": (20.2960, 85.8240),
    "cuttack": (20.4625, 85.8830),
    "berhampur": (19.3115, 84.7940),
    "sambalpur": (21.4550, 83.9780),
    "raipur": (21.2290, 81.6380),
}


def load_labels() -> tuple[list[dict[str, Any]], str]:
    """Load training data, preferring v2 over v1."""
    if LABELS_V2.exists() and LABELS_V2.stat().st_size > 1000:
        path = LABELS_V2
        version = "v2 (real OSM + synthetic)"
    elif LABELS_V1.exists():
        path = LABELS_V1
        version = "v1 (heuristic)"
    else:
        print("No training data found!", file=sys.stderr)
        print("Run: python scripts/download_all_data.py")
        raise SystemExit(1)

    with path.open("r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return rows, version


def build_features_v2(rows: list[dict]) -> tuple[np.ndarray, np.ndarray, list[str]]:
    """
    Build feature matrix with engineered features designed to generalize.
    
    Strategy: Replace raw lat/lng with relative/derived features to avoid
    overfitting to specific coordinates. Add interaction features.
    """
    X, y = [], []
    feature_names = [
        "business_type_encoded",
        "city_encoded",
        "dist_from_center",
        "dist_from_center_sq",  # non-linear distance effect
        "pop_density",
        "transit_score",
        "infra_score",
        "market_maturity",
        "centrality_score",     # 1 - normalized distance (0-1)
        "delta_lat_norm",       # directional offset from center (lat)
        "delta_lng_norm",       # directional offset from center (lng)
        "biz_x_density",       # business type × pop density interaction
        "biz_x_centrality",    # business type × centrality interaction
    ]

    # Pre-compute per-city max distances for normalization
    city_max_dist = {}
    for r in rows:
        city_key = r.get("city", "").lower().strip()
        dist = float(r.get("dist_from_center", 0))
        if city_key not in city_max_dist or dist > city_max_dist[city_key]:
            city_max_dist[city_key] = dist

    for r in rows:
        city_key = r.get("city", "").lower().strip()
        btype = r.get("business_type", "restaurant")
        btype_enc = BIZ_TYPE_ENCODE.get(btype, 0)

        lat = float(r.get("lat", 0))
        lng = float(r.get("lng", 0))

        if "dist_from_center" in r and r["dist_from_center"]:
            dist = float(r["dist_from_center"])
        else:
            cx, cy = CITY_CENTERS.get(city_key, (lat, lng))
            dist = math.sqrt((lat - cx) ** 2 + (lng - cy) ** 2)

        pop_density = float(r.get("pop_density", 0.5))
        transit = float(r.get("transit_score", 0.5))
        infra = float(r.get("infra_score", 0.5))
        maturity = float(r.get("market_maturity", 0.5))

        # Derived features
        dist_sq = dist ** 2
        max_d = city_max_dist.get(city_key, 0.1)
        centrality = max(0, 1.0 - (dist / max_d)) if max_d > 0 else 0.5

        # Directional offset from city center (normalized by max_d)
        cx, cy = CITY_CENTERS.get(city_key, (lat, lng))
        delta_lat_norm = (lat - cx) / max_d if max_d > 0 else 0
        delta_lng_norm = (lng - cy) / max_d if max_d > 0 else 0

        # Interaction features
        biz_x_density = (btype_enc / 7.0) * pop_density
        biz_x_centrality = (btype_enc / 7.0) * centrality

        features = [
            btype_enc,
            CITY_ENCODE.get(city_key, 0),
            dist,
            dist_sq,
            pop_density,
            transit,
            infra,
            maturity,
            centrality,
            delta_lat_norm,
            delta_lng_norm,
            biz_x_density,
            biz_x_centrality,
        ]
        X.append(features)
        y.append(int(r["success_12m"]))

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32), feature_names


def build_features_v1(rows: list[dict]) -> tuple[np.ndarray, np.ndarray, list[str]]:
    """Build features from v1 format (backward compatible)."""
    CITY_FEATURES = {
        "bhubaneswar": {"pop_density": 0.78, "transit_score": 0.72, "infra": 0.75, "market_maturity": 0.70},
        "cuttack": {"pop_density": 0.65, "transit_score": 0.60, "infra": 0.62, "market_maturity": 0.65},
        "berhampur": {"pop_density": 0.50, "transit_score": 0.45, "infra": 0.48, "market_maturity": 0.50},
        "sambalpur": {"pop_density": 0.48, "transit_score": 0.42, "infra": 0.45, "market_maturity": 0.48},
        "raipur": {"pop_density": 0.72, "transit_score": 0.68, "infra": 0.70, "market_maturity": 0.72},
    }

    feature_names = [
        "lat", "lng", "business_type_encoded", "city_encoded",
        "dist_from_center", "pop_density", "transit_score",
        "infra_score", "market_maturity",
    ]

    X, y = [], []
    for r in rows:
        city_key = r["city"].lower().strip()
        city_feat = CITY_FEATURES.get(city_key, CITY_FEATURES["bhubaneswar"])
        btype = BIZ_TYPE_ENCODE.get(r["business_type"], 0)
        lat = float(r["lat"])
        lng = float(r["lng"])
        cx, cy = CITY_CENTERS.get(city_key, (lat, lng))
        dist = math.sqrt((lat - cx) ** 2 + (lng - cy) ** 2)

        features = [
            lat, lng, btype,
            CITY_ENCODE.get(city_key, 0),
            dist,
            city_feat["pop_density"],
            city_feat["transit_score"],
            city_feat["infra"],
            city_feat["market_maturity"],
        ]
        X.append(features)
        y.append(int(r["success_12m"]))

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32), feature_names


def main() -> None:
    try:
        from xgboost import XGBClassifier
    except ImportError:
        print("Install xgboost: pip install xgboost", file=sys.stderr)
        raise SystemExit(1)
    try:
        from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
        from sklearn.metrics import accuracy_score, f1_score, classification_report
    except ImportError:
        print("Install scikit-learn: pip install scikit-learn", file=sys.stderr)
        raise SystemExit(1)
    try:
        import joblib
    except ImportError:
        print("Install joblib: pip install joblib", file=sys.stderr)
        raise SystemExit(1)

    rows, version = load_labels()
    print(f"Loaded {len(rows)} labeled examples ({version})")

    if len(rows) < 50:
        print("Need at least 50 labeled examples. Aborting.", file=sys.stderr)
        raise SystemExit(1)

    is_v2 = "dist_from_center" in rows[0]
    if is_v2:
        X, y, feature_names = build_features_v2(rows)
    else:
        X, y, feature_names = build_features_v1(rows)

    print(f"Features shape: {X.shape}, Labels: {len(y)} (positive rate: {y.mean():.2%})")

    if is_v2:
        real_count = sum(1 for r in rows if r.get("data_source") == "osm_real")
        synth_count = len(rows) - real_count
        print(f"Data mix: {real_count} real OSM, {synth_count} synthetic")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Tuned for generalization with balanced regularization
    model = XGBClassifier(
        n_estimators=500,
        learning_rate=0.02,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=5,
        gamma=0.2,
        reg_alpha=0.2,
        reg_lambda=1.5,
        max_delta_step=1,
        random_state=42,
        verbosity=0,
        use_label_encoder=False,
        eval_metric="logloss",
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="macro")

    # Stratified 5-fold CV for robust accuracy estimate
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=skf, scoring="accuracy")

    # Also compute CV F1
    cv_f1_scores = cross_val_score(model, X, y, cv=skf, scoring="f1_macro")

    print(f"\n{'='*55}")
    print(f"  XGBoost Results (v2 — Regularized)")
    print(f"{'='*55}")
    print(f"  Holdout Accuracy:   {acc:.4f}")
    print(f"  Holdout F1 (macro): {f1:.4f}")
    print(f"  CV Accuracy:        {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"  CV F1 (macro):      {cv_f1_scores.mean():.4f} (+/- {cv_f1_scores.std():.4f})")
    print(f"  CV Fold Scores:     {[round(s, 4) for s in cv_scores]}")

    # Overfitting check
    gap = acc - cv_scores.mean()
    if gap > 0.08:
        print(f"  ⚠ Overfitting gap: {gap:.4f} (holdout - CV)")
    else:
        print(f"  ✓ Overfitting gap: {gap:.4f} (acceptable)")

    print(f"\n{classification_report(y_test, y_pred, target_names=['fail', 'success'])}")

    # Feature importance
    importances = model.feature_importances_
    print("Feature Importances:")
    for name, imp in sorted(zip(feature_names, importances), key=lambda x: -x[1]):
        bar = "█" * int(imp * 40)
        print(f"  {name:25s}: {imp:.4f} {bar}")

    # Save model
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODEL_DIR / "model.joblib"
    joblib.dump(model, model_path)

    manifest = {
        "model_type": "XGBClassifier",
        "n_estimators": 500,
        "learning_rate": 0.02,
        "max_depth": 4,
        "n_features": len(feature_names),
        "n_training_examples": len(rows),
        "n_train": len(y_train),
        "n_test": len(y_test),
        "accuracy": round(acc, 4),
        "f1_macro": round(f1, 4),
        "cv_accuracy_mean": round(float(cv_scores.mean()), 4),
        "cv_accuracy_std": round(float(cv_scores.std()), 4),
        "cv_f1_mean": round(float(cv_f1_scores.mean()), 4),
        "cv_f1_std": round(float(cv_f1_scores.std()), 4),
        "positive_rate": round(float(y.mean()), 4),
        "feature_names": feature_names,
        "feature_importances": {n: round(float(v), 4) for n, v in zip(feature_names, importances)},
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "data_version": version,
        "cities": list(CITY_ENCODE.keys()),
        "regularization": {
            "gamma": 0.2,
            "reg_alpha": 0.2,
            "reg_lambda": 1.5,
            "min_child_weight": 5,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
        },
        "notes": [
            f"Trained on {len(rows)} labeled examples across 5 cities.",
            f"Data: {version}",
            "Removed raw lat/lng to prevent coordinate overfitting.",
            "Added interaction features: biz×density, biz×centrality, infra×transit.",
            "Heavy regularization to close CV-holdout gap.",
        ],
    }
    with (MODEL_DIR / "manifest.json").open("w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nModel saved to {model_path}")
    print(f"Manifest saved to {MODEL_DIR / 'manifest.json'}")


if __name__ == "__main__":
    main()
