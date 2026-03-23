# Monitoring, drift, retraining (Phase 5)

## Prediction logging

When `LOCINTEL_PREDICTION_LOG=1`, Flask appends one JSON line per `/predict/tabular` call to:

`artifacts/prediction_log.jsonl`

Fields include `logged_at_utc`, request feature keys, and model output. **Do not log PII.**

## Drift (recommended checks)

| Check | Method |
|-------|--------|
| Feature distribution | Compare recent `prediction_log` feature summaries vs training CSV (PSI / KS on key columns). |
| Label delay | Track time from `opened_at_utc` to outcome availability. |
| Geography | Alert if prediction mix shifts countries vs training. |

Implement as batch script or notebook; no auto-drift job ships in-repo yet.

## Retraining schedule

- **Default:** quarterly full refresh of Tier-1 extracts + merge + impute + retrain when new labels ≥ +1,000 rows or quarterly calendar.
- **Minimum:** retrain after any change to Overpass query semantics or ACS vintage (update `config.CENSUS_BASE_URL` year).

Document the actual cron/CI job in your deployment platform (GitHub Actions, etc.).
