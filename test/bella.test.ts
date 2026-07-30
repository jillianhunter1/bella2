import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { welcome } from "../src/bella.js";

describe("welcome", () => {
  it("returns hello", () => {
    assert.strictEqual(welcome(), "hello");
  });
});
