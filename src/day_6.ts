import fs from "fs";

// methods

function answer(data: string[], package_size: number): number {
  return [...Array(data.length).keys()]
    .map((idx) => data.slice(Math.max(0, idx - package_size), idx))
    .findIndex(
      (value) =>
        value.length === package_size && new Set(value).size === package_size
    );
}

// solve

const data: string[] = fs.readFileSync("inputs/day_6.txt", "utf8").split("");
console.log(`answer 1: ${answer(data, 4)}`);
console.log(`answer 2: ${answer(data, 14)}`);
