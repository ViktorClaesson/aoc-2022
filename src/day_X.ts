import fs from "fs";

// data structures

class Foo {}

// methods

function answer_1(): number {
  return 42;
}

function answer_2(): number {
  return 42;
}

// solve

const data: string = fs.readFileSync("inputs/day_X.txt", "utf8");
console.log(`answer 1: ${answer_1()}`);
console.log(`answer 2: ${answer_2()}`);
