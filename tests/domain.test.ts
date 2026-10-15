import { test } from "node:test";
import assert from "node:assert/strict";
import { filterRecords, works, contracts } from "../lib/data";
import {
  reportSchema,
  laiSchema,
  photoType,
  canModerate,
} from "../lib/validation";
test("filters combine accent-insensitive search with neighborhood and subject", () => {
  assert.equal(filterRecords(works, "ampliacao", "Fragata", "Saúde").length, 1);
  assert.equal(filterRecords(works, "ampliacao", "Centro", "Saúde").length, 0);
});
test("demo financial totals and references are consistent", () => {
  assert.equal(
    works.reduce((s, w) => s + w.budget, 0),
    5220000,
  );
  for (const w of works) {
    assert.ok(
      contracts.some((c) => c.id === w.contractId && c.workId === w.id),
    );
    assert.ok(w.paid <= w.budget);
  }
});
test("rejects empty and unbounded participation input", () => {
  assert.equal(
    reportSchema.safeParse({
      title: "a",
      description: "bad",
      neighborhood: "",
      subject: "invalid",
    }).success,
    false,
  );
  assert.equal(
    laiSchema.safeParse({
      title: "Pedido fictício",
      body: "a".repeat(5001),
      agency: "Órgão",
    }).success,
    false,
  );
});
test("photo signatures reject disguised HTML, SVG and empty files", () => {
  for (const text of ["<script>alert(1)</script>", "<svg/>", ""])
    assert.equal(photoType(new TextEncoder().encode(text)), null);
  assert.equal(photoType(Uint8Array.from([255, 216, 255, 224])), "image/jpeg");
});
test("only reviewers and administrators can moderate", () => {
  for (const role of ["visitor", "citizen", "analyst", ""])
    assert.equal(canModerate(role), false);
  assert.ok(canModerate("reviewer"));
  assert.ok(canModerate("admin"));
});
