import type { Database } from "better-sqlite3";
import type { TodoItem } from "./types.js";

export namespace DataAccess {
  export function initialize(db: Database) {
    const userVersion = db.pragma("user_version", { simple: true }) as number;
    switch (userVersion) {
      case 0: {
        db.prepare(`
          CREATE TABLE todo_item (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at INTEGER DEFAULT (strftime('%s','now')),
            completed_at INTEGER DEFAULT NULL,
            updated_at INTEGER DEFAULT NULL
          )
        `).run();
        db.pragma("user_version = 1");
        break;
      }
      case 1: {
        console.info("DataAccess.initialize: nothing else to do");
        break;
      }
      default: {
        const message = "DataAccess.initialize: invalid version!";
        throw new Error(message);
      }
    }
  }

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
