/** biome-ignore-all lint/style/noNonNullAssertion: false negative */
import Database from "better-sqlite3";
import { expect, test } from "vitest";
import { DataAccess } from "./data-access.js";

test("initialize successfully", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);
  expect(DataAccess.listTableNames(db)).includes("todo_items");
});

test("create and list successfully", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);
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

test("list with filter", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);

  DataAccess.TodoItem.create(db, {
    title: "title 1",
    description: "description 1",
  });
  DataAccess.TodoItem.create(db, {
    title: "title 2",
    description: "description 2",
  });
  DataAccess.TodoItem.create(db, {
    title: "title 3",
    description: "description 3",
  });
  DataAccess.TodoItem.create(db, {
    title: "special 4",
    description: "special 4",
  });

  {
    const items = DataAccess.TodoItem.listAll(db, "1");
    expect(items).length(1);
    expect(items[0]!.title).toEqual("title 1");
  }
  {
    const items = DataAccess.TodoItem.listAll(db, "title");
    expect(items).length(3);
    expect(items[0]!.title).toEqual("title 1");
    expect(items[1]!.title).toEqual("title 2");
    expect(items[2]!.title).toEqual("title 3");
  }
  {
    const items = DataAccess.TodoItem.listAll(db);
    expect(items).length(4);
    const itemSpecial = items[3]!;
    itemSpecial.completedAt = Math.round(Date.now() / 1_000);

    DataAccess.TodoItem.update(db, itemSpecial);

    const itemsCompleted = DataAccess.TodoItem.listAll(db, undefined, true);
    expect(itemsCompleted).length(1);
    const itemsNotCompleted = DataAccess.TodoItem.listAll(db, undefined, false);
    expect(itemsNotCompleted).length(3);
  }
});

test("find one successfully", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);

  const itemData = {
    title: "title 1",
    description: "description 1",
  };
  DataAccess.TodoItem.create(db, itemData);
  const items = DataAccess.TodoItem.listAll(db);
  const id = items[0]!.id;

  const itemFound = DataAccess.TodoItem.findOne(db, id);

  expect(itemData.title).toEqual(itemFound.title);
  expect(itemData.description).toEqual(itemFound.description);
});

test("update successfully", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);

  const itemData = {
    title: "title 1",
    description: "description 1",
  };
  DataAccess.TodoItem.create(db, itemData);
  const items = DataAccess.TodoItem.listAll(db);
  const item = items[0]!;
  const newTitle = "title 1 modified";
  item.title = newTitle;

  DataAccess.TodoItem.update(db, item);

  const itemFound = DataAccess.TodoItem.findOne(db, item.id);
  expect(itemFound.title).toEqual(newTitle);
  expect(itemFound.updatedAt).toBeGreaterThan(0);
});

test("delete successfully", () => {
  const db = new Database(":memory:");
  DataAccess.migrate(db);

  const itemData = {
    title: "title 1",
    description: "description 1",
  };
  DataAccess.TodoItem.create(db, itemData);

  {
    const items = DataAccess.TodoItem.listAll(db);
    const item = items[0]!;
    DataAccess.TodoItem.deleteOne(db, item.id);
  }
  {
    const items = DataAccess.TodoItem.listAll(db);
    expect(items).length(0);
  }
});
