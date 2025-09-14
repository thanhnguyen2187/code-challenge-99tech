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
homophones (same sound different spelling; I actually had to look up the word).
Dependency installation and running can be found at the
[README](src/problem5/README.md). The server is pretty basic, but I'll try to
list out some interesting choices I made:

- `pnpm` instead of `npm`: faster installation; can be used for
  workspace/monorepo later
- Biome instead of Prettify + ESLint: faster; easier to set up and simpler
  configuration
- SQLite instead of Postgres/MySQL/MongoDB: easier to setup (Postgres or MySQL
  or MongoDB would require more work on both local development and production
  deployment) and test (I can spin up in-memory SQLite for testing)
- No ORM + hand-rolled migration code: I think in a team environment, I would go
  with Drizzle and depend on it, but it's overkill for this project
- Code structure:
  - Database interaction in `namespace DataAccess` with functions receiving a
    `db` parameter.
  - 2-layers-ish, where a new request would get parsed for parameters (POST
    body, or GET path param), then the parameters would be used by a function in
    `namespace DataAccess`
