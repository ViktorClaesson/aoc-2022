import fs from "fs";

// methods

function answer(data: string[]): number {
  return [...Array(data.length).keys()]
    .map((idx) => data.slice(Math.max(0, idx - 4), idx))
    .findIndex((value) => value.length === 4 && new Set(value).size === 4);
}

// solve

const data: string[] = fs.readFileSync("inputs/day_6.txt", "utf8").split("");
console.log(`answer 1: ${answer(data)}`);
console.log(`answer 2: ${0}`);
