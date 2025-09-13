import { randomUUID } from "node:crypto";
import type { Database } from "better-sqlite3";
import { type TodoItemDB, type TodoItemDisplay, transform } from "./types.js";

export namespace DataAccess {
  export function initialize(db: Database) {
    const userVersion = db.pragma("user_version", { simple: true }) as number;
    console.info("DataAccess.initialize: found user_version", userVersion);
    switch (userVersion) {
      case 0: {
        db.prepare(`
            CREATE TABLE todo_items
            (
                id           TEXT PRIMARY KEY,
                title        TEXT NOT NULL,
                description  TEXT NOT NULL,
                created_at   INTEGER DEFAULT (strftime('%s', 'now')),
                completed_at INTEGER DEFAULT NULL,
                updated_at   INTEGER DEFAULT NULL
            )
        `).run();
        db.pragma("user_version = 1");
        break;
      }
      case 1: {
        console.info(
          "DataAccess.initialize: at latest version; nothing else to do",
        );
        break;
      }
      default: {
        const message = "DataAccess.initialize: invalid version!";
        throw new Error(message);
      }
    }
  }

  export function listTableNames(db: Database) {
    const records = db
      .prepare("SELECT name FROM sqlite_schema WHERE type = 'table'")
      .all() as { name: string }[];
    return records.map((record) => record.name);
  }

  export namespace TodoItem {
    export function create(
      db: Database,
      item: {
        title: string;
        description: string;
      },
    ) {
      const statement = db.prepare(
        "INSERT INTO todo_items(id, title, description) VALUES (?, ?, ?)",
      );
      statement.bind(randomUUID(), item.title, item.description);
      statement.run();
    }

    export function findOne(db: Database, id: string): TodoItemDisplay {
      const statement = db
        .prepare(`
          SELECT id,
                 title,
                 description,
                 created_at,
                 completed_at,
                 updated_at
          FROM todo_items
          WHERE id = ?
        `)
        .bind(id);
      const record = statement.get() as TodoItemDB;
      return transform(record);
    }

    export function listAll(db: Database): TodoItemDisplay[] {
      const statement = db.prepare(`
          SELECT id,
                 title,
                 description,
                 created_at,
                 completed_at,
                 updated_at
          FROM todo_items
      `);
      const recordsDB = statement.all() as TodoItemDB[];
      const records: TodoItemDisplay[] = recordsDB.map(transform);

      return records;
    }

    export async function update(db: Database, item: TodoItemDisplay) {
      const statement = db
        .prepare(`
          UPDATE todo_items
          SET
              title = ?,
              description = ?,
              updated_at = ?
          WHERE id = ?
      `)
        .bind(
          item.title,
          item.description,
          Math.round(Date.now() / 1_000),
          item.id,
        );
      statement.run();
    }

    export async function deleteOne(db: Database, id: string) {
      throw new Error("not implemented!");
    }
  }
}
