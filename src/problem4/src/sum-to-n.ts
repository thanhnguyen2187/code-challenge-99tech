export function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

export function sum_to_n_b(n: number): number {
  const numbers = Array.from(Array(n + 1).keys());
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  return sum;
}

export function sum_to_n_c(n: number): number {
  return Math.round((n * (n + 1)) / 2);
}
