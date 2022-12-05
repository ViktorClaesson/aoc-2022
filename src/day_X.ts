import * as fs from "fs";

// data structures

class Foo {}

// methods

function answer(): number {
  return 42;
}

// solve

const data: string = fs.readFileSync("inputs/day_X.txt", "utf8");
console.log(`answer 1: ${answer()}`);
console.log(`answer 2: ${answer()}`);
