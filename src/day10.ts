import fs from "fs";

// methods

function answerPartOne(instructions: string[]): number {
  return instructions
    .flatMap((instruction) =>
      instruction.startsWith("addx") ? ["noop", instruction] : [instruction]
    ) // padd addx instructions with noop instruction before it
    .map((instruction) =>
      instruction.startsWith("addx") ? +instruction.split(" ")[1] : 0
    ) // convert instructions to the amount to be added (0 for noop)
    .reduce((acc, val) => acc.concat(acc[acc.length - 1] + val), [1, 1]) // convert array into new array where each index is the cycle, and the value the register value at the beginning of the cycle
    .map((val, index) => val * index) // multiple each register value by the cycle
    .filter((_, index) => (index - 20) % 40 === 0) // only keep cycle 20 and then every 40th after that
    .reduce((acc, val) => acc + val, 0); // sum the cycles
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[] = fs.readFileSync("inputs/day10.txt", "utf8").split("\n");

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
