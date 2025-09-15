# Problem 5: a Crude/CRUD server

## Requirements

- Technical stack: ExpressJS + TypeScript
- Have endpoints for these actions:
  - Create a resource
  - List resources with basic filters
  - Get details of a resource
  - Update resource details
  - Delete a resource
- Connect with a database for data persistence
- Guide using README.md

Additional assumptions:

- The resource is todo list item
- The API should be something usable for a todo list app's frontend
- Other dependencies:
  - `vitest` for testing
  - Biome for code quality
  - `better-sqlite3` to interact with SQLite

## Development

- Install dependencies:

Make sure that you have `pnpm` ready:

```shell
pnpm install
```

- Start the development server:

```shell
pnpm run dev
```

- Run tests:

```shell
pnpm run test
```

## Deployment

TODO

