"""Reference: single-instance FIFO scheduling, not an online worker."""
import math


def _number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(name + " must be numeric")
    if not math.isfinite(value) or value < 0:
        raise ValueError(name + " must be finite and nonnegative")


def plan_batches(arrivals, max_batch=8, max_wait_ms=5, fixed_ms=2, per_item_ms=0.5):
    if isinstance(max_batch, bool) or not isinstance(max_batch, int) or max_batch < 1:
        raise ValueError("max_batch must be a positive integer")
    for value in (max_wait_ms, fixed_ms, per_item_ms):
        _number(value, "parameter")
    arrivals = list(arrivals)
    for index, value in enumerate(arrivals):
        _number(value, "arrival")
        if index and value < arrivals[index - 1]:
            raise ValueError("arrivals must be nondecreasing")
    batches, index, free_at = [], 0, 0
    while index < len(arrivals):
        ready = max(free_at, arrivals[index])
        deadline = max(ready, arrivals[index] + max_wait_ms)
        end = index
        while end < len(arrivals) and end - index < max_batch and arrivals[end] <= deadline:
            end += 1
        start = max(ready, arrivals[end - 1]) if end - index == max_batch else deadline
        free_at = start + fixed_ms + per_item_ms * (end - index)
        batches.append({"indices": list(range(index, end)), "start_ms": start, "finish_ms": free_at})
        index = end
    return batches
