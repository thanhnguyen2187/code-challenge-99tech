import Database from "better-sqlite3";
import { expect, test } from "vitest";
import { DataAccess } from "./data-access.js";

test("initialize successfully", () => {
  const db = new Database(":memory:");
  DataAccess.initialize(db);
  expect(DataAccess.listTableNames(db)).includes("todo_items");
});

test("create and list successfully", () => {
  const db = new Database(":memory:");
  DataAccess.initialize(db);
  DataAccess.TodoItem.create(db, {
    title: "title 1",
    description: "description 1",
  });
  expect(DataAccess.TodoItem.listAll(db)).length(1);

  DataAccess.TodoItem.create(db, {
    title: "title 2",
    description: "description 2",
  });
  expect(DataAccess.TodoItem.listAll(db)).length(2);
});

test("find one successfully", () => {
  const db = new Database(":memory:");
  DataAccess.initialize(db);

  const itemData = {
    title: "title 1",
    description: "description 1",
  };
  DataAccess.TodoItem.create(db, itemData);
  const items = DataAccess.TodoItem.listAll(db);
  // biome-ignore lint/style/noNonNullAssertion: false negative TypeScript check
  const id = items[0]!.id;

  const itemFound = DataAccess.TodoItem.findOne(db, id);

  expect(itemData.title).toEqual(itemFound.title);
  expect(itemData.description).toEqual(itemFound.description);
});

test("update successfully", () => {
  const db = new Database(":memory:");
  DataAccess.initialize(db);

  const itemData = {
    title: "title 1",
    description: "description 1",
  };
  DataAccess.TodoItem.create(db, itemData);
  const items = DataAccess.TodoItem.listAll(db);
  // biome-ignore lint/style/noNonNullAssertion: false negative TypeScript check
  const item = items[0]!;
  const newTitle = "title 1 modified";
  item.title = newTitle;

  DataAccess.TodoItem.update(db, item);

  const itemFound = DataAccess.TodoItem.findOne(db, item.id);
  expect(itemFound.title).toEqual(newTitle);
  expect(itemFound.updatedAt).toBeGreaterThan(0);
});
