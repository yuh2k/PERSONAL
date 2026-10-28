import unittest
from batcher import plan_batches
from features import latest_available


class BatchContract(unittest.TestCase):
    def test_exact_small_schedule(self):
        self.assertEqual(
            plan_batches([0, 1, 2, 10], max_batch=2, max_wait_ms=5, fixed_ms=2, per_item_ms=1),
            [{"indices": [0, 1], "start_ms": 1, "finish_ms": 5},
             {"indices": [2], "start_ms": 7, "finish_ms": 10},
             {"indices": [3], "start_ms": 15, "finish_ms": 18}])

    def test_empty(self):
        self.assertEqual(plan_batches([]), [])

    def test_cap_fifo_and_no_early_execution(self):
        arrivals = [0, 0, 0, 0.1, 1, 2, 10, 11, 11, 11.5]
        result = plan_batches(arrivals, max_batch=3)
        self.assertEqual([i for batch in result for i in batch["indices"]], list(range(len(arrivals))))
        previous_finish = 0
        for batch in result:
            self.assertLessEqual(len(batch["indices"]), 3)
            self.assertGreaterEqual(batch["start_ms"], previous_finish)
            self.assertGreaterEqual(batch["start_ms"], max(arrivals[i] for i in batch["indices"]))
            previous_finish = batch["finish_ms"]

    def test_wait_is_not_total_queue_bound(self):
        batches = plan_batches([0, 1, 2], max_batch=1, max_wait_ms=0, fixed_ms=10, per_item_ms=0)
        self.assertEqual(batches[1]["start_ms"], 10)
        self.assertGreater(batches[1]["start_ms"] - 1, 0)

    def test_invalid_inputs(self):
        for args in [
            {"arrivals": [2, 1]}, {"arrivals": [float("nan")]},
            {"arrivals": [0], "max_batch": 0}, {"arrivals": [0], "max_batch": True},
            {"arrivals": [0], "max_wait_ms": -1}, {"arrivals": [0], "fixed_ms": float("inf")}]:
            with self.subTest(args=args), self.assertRaises(ValueError):
                plan_batches(**args)


class FeatureContract(unittest.TestCase):
    def test_excludes_future_and_late_arrivals(self):
        rows = [
            {"entity": "a", "event_time": 90, "available_at": 91, "value": 2},
            {"entity": "a", "event_time": 99, "available_at": 105, "value": 9},
            {"entity": "a", "event_time": 101, "available_at": 101, "value": 10}]
        self.assertEqual(latest_available("a", 100, rows)["value"], 2)

    def test_boundary_and_version(self):
        rows = [
            {"entity": "a", "event_time": 100, "available_at": 100, "value": 2, "version": 1},
            {"entity": "a", "event_time": 100, "available_at": 100, "value": 3, "version": 2}]
        self.assertEqual(latest_available("a", 100, rows)["value"], 3)

    def test_missing_and_entity_isolation(self):
        rows = [{"entity": "b", "event_time": 0, "available_at": 0, "value": 7}]
        self.assertIsNone(latest_available("a", 100, rows))
        self.assertIsNone(latest_available("a", 100, []))

    def test_returns_copy(self):
        rows = [{"entity": "a", "event_time": 0, "available_at": 0, "value": 7}]
        found = latest_available("a", 100, rows)
        found["value"] = 999
        self.assertEqual(rows[0]["value"], 7)

    def test_invalid_data(self):
        for rows in [[{}], [{"entity": "a", "event_time": 1, "available_at": float("nan"), "value": 0}],
                     [{"entity": "a", "event_time": 1, "available_at": 1, "value": 0, "version": -1}]]:
            with self.subTest(rows=rows), self.assertRaises(ValueError):
                latest_available("a", 10, rows)


if __name__ == "__main__":
    unittest.main()
