import type { Database } from "better-sqlite3";
import type { TodoItem } from "./types.js";

export namespace DataAccess {
  export async function create(db: Database, item: TodoItem) {
    const statement = db.prepare(
      "INSERT INTO todo_items(title, description)" + " VALUES (?, ?)",
    );
    statement.run(item.title, item.description);
  }
  export async function listOne(db: Database, id: string): Promise<TodoItem> {
    throw new Error("not implemented!");
  }
  export async function listMany(db: Database): Promise<TodoItem[]> {
    throw new Error("not implemented!");
  }
  export async function update(db: Database, item: TodoItem) {
    throw new Error("not implemented!");
  }
  export async function deleteOne(db: Database, id: string) {
    throw new Error("not implemented!");
  }
}
