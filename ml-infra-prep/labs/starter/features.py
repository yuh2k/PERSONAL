"""Select a copy of the latest visible row, or None.
Row keys: entity, event_time, available_at, value, optional version (default 0).
Both event_time and available_at must be <= prediction_time.
Select by (event_time, version, available_at); exact ties preserve the first row.
Validate finite numeric times and nonnegative integer versions.
"""


def latest_available(entity, prediction_time, rows):
    raise NotImplementedError("Implement the visibility contract")
