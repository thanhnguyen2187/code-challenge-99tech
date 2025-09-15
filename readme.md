# 99Tech Code Challenge

This is my take on the hiring challenge by 99Tech. I applied for a backend role,
and the problems for the role are:

> - Problem 4: Three ways to sum to n
> - Problem 5: A Crude Server
> - Problem 6: Architecture

Note: I used LLM(s) for proof reading, not for coding nor problem understanding.
Everything is 100% typed by me at first.

## Problem 4

Basically, the problem is to calculate $\sum_{i=1}^{n} i$. For example:

```python
# input
n = 5
# calculation
f(n) = f(5) = 1 + 2 + 3 + 4 + 5 = ?
```

The full code with tests can be found [here](src/problem4/src). I implemented
3 versions as required (albeit I'm not sure if the first and the second version
differ that much).

### Version A: straight forward looping

The code looks like this:

```ts
export function versionA(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```

- Time complexity is `O(n)`, as we are iterating `n` times.
- Space complexity is `O(1)`, as we are wasting no space.

### Version B: using `reduce`

I implemented a more "functional programming" variation of the above version:

```ts
export function versionB(n: number): number {
  if (n <= 1) {
    return 1;
  }

  const numbers = Array.from(Array(n + 1).keys());
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  return sum;
}
```

- Time complexity is `O(n)`, as we are iterating `n` times.
- Space complexity is `O(n)`, as we are creating array `numbers` that has
  `n + 1` elements from `0` to `n`. It can be optimized by using iterator, but I
  don't feel that it's needed.

### Version C: using a well-known mathematics formula

The formula is:

$$
  \sum_{i=1}^{n} i = \frac{n(n + 1)}{2}
$$

It's implementation is the simplest, but I think the challenge is to be aware of
it (and maybe to prove it using induction):

```ts
export function versionC(n: number): number {
  return Math.round((n * (n + 1)) / 2);
}
```

- Time complexity is `O(1)`, as we are "just" doing a simple calculation.
- Space complexity is `O(1)`, as we use next to no memory at all.

## Problem 5

The word play in the description is nice, where "crude" and "CRUD" are
homophones (same sound, different spelling; I actually had to look up the word).
Dependency installation and running can be found at the
[README](src/problem5/README.md). The server is pretty basic, but I'll try to
list out some interesting choices I made:

- `pnpm` instead of `npm`: faster installation; can be used for
  workspace/monorepo later.
- Biome instead of Prettify + ESLint: faster; easier to set up and simpler
  configuration.
- SQLite instead of Postgres/MySQL/MongoDB: easier to setup (Postgres or MySQL
  or MongoDB would require more work on both local development and production
  deployment) and test (I can spin up in-memory SQLite for testing).
- No ORM + hand-rolled migration code: I think in a team environment, I would go
  with Drizzle/Kysely, but it's overkill for this project.

I'll try to justify my codebase's structure as well:

- Database interaction in `namespace DataAccess` with functions receiving a
  `db` parameter.

  ```ts
  // data-access.ts
  import BetterSQLite3 from "better-sqlite3";

  export namespace DataAccess {
    export function createDb(dbUrl: string): BetterSQLite3.Database {
      // ...
    }

    export function migrate(db: BetterSQLite3.Database) {
      // ...
    }

    export namespace TodoItem {
      export function create(
        db: BetterSQLite3.Database,
        item: {
          title: string;
          description: string;
        },
      ) {
        // ...
      }
    }
  ```

  I'd say this structure of just using function with parameters is simpler to
  read and to test. In case we really need a database-agnostic solution (like
  using PostgresQL instead of SQLite), then we can either refactor `db` to a
  more generic interface, or copy the database access code to a `v2` and
  gradually implement new endpoints.

- 2-layers-ish, where a new request would get parsed for parameters (POST
  body, or GET path param), then the parameters would be used by a function in
  `namespace DataAccess`.

  ```ts
  // index.ts
  import express from "express";
  import { DataAccess } from "./data-access.js";

  const app = express();

  const db = DataAccess.createDb(dbUrl);
  DataAccess.migrate(db);

  // ...
  app
    .get("/api/v1/todo-items", (req, res) => {
      const searchKeyword =
        typeof req.query.search === "string" && req.query.search !== ""
          ? req.query.search
          : undefined;
      const completed = req.query.completed === "true";
      try {
        const items = DataAccess.TodoItem.listAll(db, searchKeyword, completed);
        res.status(200).json({
          data: items,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          success: false,
        });
      }
    })
    .post("/api/v1/todo-items", (req, res) => {
      // ...
    });
  ```

  Again, I think this approach helps making the code simple and easy to test.
  However, I totally understand teams' rationales if they decide to go with
  something heavy-weight like NestJS and would follow the established
  convention.

Should I have more time, I would implement these things as well:

- Logging library: it'd be great if we wrap the current `console.log` calls
  around a `logger`
- Data validation using `zod`: it's better than throwing error 500 at every
  error like the current implementation.
- Build to single `.js` using `esbuild` + Dockerfile: for a production-grade
  deployment, people would expect the service to be Dockerized, and we should
  give them that. However, I noticed that the image size would be large if we
  copy also `node_module/`, so I often try to
  - Use `esbuild` to turn the code into a single `index.js` file (similar to how
    we build binary file), then
  - Copy the final file to a "clean" image that only has NodeJS available

