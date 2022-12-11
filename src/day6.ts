import fs from "fs";
import { rollingChunks } from "./lib";

// methods

function answer(data: string[], package_size: number): number {
  return (
    rollingChunks(data, package_size).findIndex(
      (value) =>
        value.length === package_size && new Set(value).size === package_size
    ) + package_size
  );
}

// solve

const data: string[] = fs.readFileSync("inputs/day6.txt", "utf8").split("");
console.log(`answer 1: ${answer(data, 4)}`);
console.log(`answer 2: ${answer(data, 14)}`);

// answer 1: 1848
// answer 2: 2308
