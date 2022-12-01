import fs from "fs";

// read input

const data = fs
  .readFileSync("inputs/day1.txt", "utf8")
  .split("\n\n")
  .map((lines) =>
    lines
      .split("\n")
      .map((n) => +n)
      .reduce((acc, n) => acc + n, 0)
  );

// part 1

const answer_1 = data.reduce((a, b) => (a > b ? a : b));
console.log(answer_1);

// part 2

const answer_2 = data
  .reduce(
    (acc, b) =>
      acc
        .concat(b)
        .sort((a, b) => b - a)
        .slice(0, 3),
    []
  )
  .reduce((a, b) => a + b);
console.log(answer_2);
