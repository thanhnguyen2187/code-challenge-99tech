import Database from "better-sqlite3";
import { expect, test } from "vitest";
import { DataAccess } from "./data-access.js";

test("initialize successfully", () => {
  const db = new Database(":memory:");
  DataAccess.initialize(db);
  expect(DataAccess.listTableNames(db)).includes("todo_item");
});

test("create and list successfully", () => {})
