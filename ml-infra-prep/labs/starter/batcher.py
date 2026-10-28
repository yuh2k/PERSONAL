"""Implement deterministic FIFO microbatch scheduling (all times in milliseconds).
Return [{"indices": [...], "start_ms": ..., "finish_ms": ...}, ...].
Validate parameters, preserve order, never execute before arrival.
max_wait_ms bounds waiting to fill a batch, not queueing under overload.
"""


def plan_batches(arrivals, max_batch=8, max_wait_ms=5, fixed_ms=2, per_item_ms=0.5):
    raise NotImplementedError("Implement the scheduling contract")
