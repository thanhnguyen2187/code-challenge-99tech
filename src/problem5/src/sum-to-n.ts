export namespace SumToN {
  export function versionA(n: number): number {
    if (n <= 1) {
      return 1;
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  }

  export function versionB(n: number): number {
    if (n <= 1) {
      return 1;
    }

    const numbers = Array.from(Array(n + 1).keys());
    const sum = numbers.reduce((acc, cur) => acc + cur, 0);
    return sum;
  }

  export function versionC(n: number): number {
    if (n <= 1) {
      return 1;
    }

    return Math.round((n * (n + 1)) / 2);
  }
}
