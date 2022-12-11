import fs from "fs";

// data structures && init functions

class Foo {}

function initFoo(): Foo {
  return new Foo();
}

// solution methods

function answerPartOne(): number {
  return 42;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string = fs.readFileSync("inputs/dayX.txt", "utf8");
console.log(`Answer part 1: ${answerPartOne()}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
