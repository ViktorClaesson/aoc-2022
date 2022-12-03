import * as fs from "fs";

// read input

const data: number[][] = fs
  .readFileSync("inputs/day_2.txt", "utf8")
  .replace(/A/g, "1")
  .replace(/B/g, "2")
  .replace(/C/g, "3")
  .replace(/X/g, "1")
  .replace(/Y/g, "2")
  .replace(/Z/g, "3")
  .split("\n")
  .map((line) => line.split(" "))
  .map(([a, b]) => [+a, +b])

// part 1

let answer_1 = data
  .map(([a, b]) => [b, (b - a + 3) % 3])
  .map(([b, d]) => +(d === 0) * 3 + +(d === 1) * 6 + b)
  .reduce((acc, val) => acc + val);
console.log(answer_1);

// part 2

const answer_2 = data
  .map(([a, b]) => +(b === 1) * ((a + 1) % 3 + 1) + +(b === 2) * (3 + a) + +(b === 3) * (6 + a % 3 + 1))
  .reduce((acc, val) => acc + val)
console.log(answer_2);
