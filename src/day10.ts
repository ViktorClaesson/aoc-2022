import fs from "fs";

// methods

function answerPartOne(instructions: string[]): number {
  return instructions
    .flatMap((instruction) =>
      instruction.startsWith("addx") ? [0, +instruction.split(" ")[1]] : [0]
    )
    .reduce((acc, val) => acc.concat(acc[acc.length - 1] + val), [1, 1])
    .map((val, index) => val * index)
    .filter((_, index) => (index - 20) % 40 === 0)
    .reduce((acc, val) => acc + val, 0);
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[] = fs.readFileSync("inputs/day10.txt", "utf8").split("\n");

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
