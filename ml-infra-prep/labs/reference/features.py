"""Reference: simplified bitemporal feature selection."""
import math


def _time(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("time must be finite and numeric")


def latest_available(entity, prediction_time, rows):
    _time(prediction_time)
    candidates = []
    for row in rows:
        if not all(key in row for key in ("entity", "event_time", "available_at", "value")):
            raise ValueError("incomplete row")
        _time(row["event_time"])
        _time(row["available_at"])
        version = row.get("version", 0)
        if isinstance(version, bool) or not isinstance(version, int) or version < 0:
            raise ValueError("invalid version")
        if row["entity"] == entity and row["event_time"] <= prediction_time and row["available_at"] <= prediction_time:
            candidates.append(row)
    if not candidates:
        return None
    return max(candidates, key=lambda row: (row["event_time"], row.get("version", 0), row["available_at"])).copy()
