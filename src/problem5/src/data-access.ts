import { randomUUID } from "node:crypto";
// import type { Database } from "better-sqlite3";
import BetterSQLite3 from "better-sqlite3";
import { type TodoItemDB, type TodoItemDisplay, transform } from "./types.js";

export namespace DataAccess {
  export function createDb(dbUrl: string): BetterSQLite3.Database {
    return new BetterSQLite3(dbUrl);
  }

  export function migrate(db: BetterSQLite3.Database) {
    const userVersion = db.pragma("user_version", { simple: true }) as number;
    console.info("DataAccess.migrate: found user_version", userVersion);
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
          "DataAccess.migrate: at latest version; nothing else to do",
        );
        break;
      }
      default: {
        const message = "DataAccess.migrate: invalid version!";
        throw new Error(message);
      }
    }
  }

  export function listTableNames(db: BetterSQLite3.Database) {
    const records = db
      .prepare("SELECT name FROM sqlite_schema WHERE type = 'table'")
      .all() as { name: string }[];
    return records.map((record) => record.name);
  }

  export namespace TodoItem {
    export function create(
      db: BetterSQLite3.Database,
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

    export function findOne(
      db: BetterSQLite3.Database,
      id: string,
    ): TodoItemDisplay {
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

    export function listAll(
      db: BetterSQLite3.Database,
      searchKeyword: string | undefined = undefined,
      completed: boolean | undefined = undefined,
    ): TodoItemDisplay[] {
      const whereClauses = ["TRUE"];
      const bindings = [];
      if (searchKeyword) {
        whereClauses.push("(title LIKE ? OR description LIKE ?)");
        bindings.push(`%${searchKeyword}%`);
        bindings.push(`%${searchKeyword}%`);
      }
      if (completed === true) {
        whereClauses.push("completed_at IS NOT NULL");
      } else if (completed === false) {
        whereClauses.push("completed_at IS NULL");
      }
      const whereText = whereClauses.join(" AND ");
      const statement = db
        .prepare(`
            SELECT id,
                   title,
                   description,
                   created_at,
                   completed_at,
                   updated_at
            FROM todo_items
            WHERE ${whereText}
        `)
        .bind(...bindings);
      const recordsDB = statement.all() as TodoItemDB[];
      const records: TodoItemDisplay[] = recordsDB.map(transform);

      return records;
    }

    export async function update(
      db: BetterSQLite3.Database,
      item: TodoItemDisplay,
    ) {
      const statement = db
        .prepare(`
          UPDATE todo_items
          SET
              title = ?,
              description = ?,
              updated_at = ?,
              completed_at = ?
          WHERE id = ?
      `)
        .bind(
          item.title,
          item.description,
          Math.round(Date.now() / 1_000),
          item.completedAt,
          item.id,
        );
      statement.run();
    }

    export async function deleteOne(db: BetterSQLite3.Database, id: string) {
      const statement = db
        .prepare(`DELETE FROM todo_items WHERE id = ?`)
        .bind(id);
      statement.run();
    }
  }
}
