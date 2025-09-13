import { expect, test } from "vitest";
import { SumToN } from "./sum-to-n";

test("edge case handling", () => {
  expect(SumToN.versionA(0)).toBe(1);
  expect(SumToN.versionB(0)).toBe(1);
  expect(SumToN.versionC(0)).toBe(1);
});

test("correct result", () => {
  expect(SumToN.versionA(4)).toBe(10);
  expect(SumToN.versionB(4)).toBe(10);
  expect(SumToN.versionC(4)).toBe(10);

  expect(SumToN.versionA(5)).toBe(15);
  expect(SumToN.versionB(5)).toBe(15);
  expect(SumToN.versionC(5)).toBe(15);

  expect(SumToN.versionA(6)).toBe(21);
  expect(SumToN.versionB(6)).toBe(21);
  expect(SumToN.versionC(6)).toBe(21);
});
