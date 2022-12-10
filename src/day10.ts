import fs from "fs";
import { chunkify } from "./lib";

// methods

function getRegisterByCycle(instructions: string[]): number[] {
  return instructions
    .flatMap((instruction) =>
      instruction.startsWith("addx") ? ["noop", instruction] : [instruction]
    ) // padd addx instructions with noop instruction before it
    .map((instruction) =>
      instruction.startsWith("addx") ? +instruction.split(" ")[1] : 0
    ) // convert instructions to the amount to be added (0 for noop)
    .reduce((acc, val) => acc.concat(acc[acc.length - 1] + val), [1]); // convery to new array where: index is the cycle index, value is the register value during cycle (We pad with a 1 for the first cycle)
}

function answerPartOne(instructions: string[]): number {
  return getRegisterByCycle(instructions)
    .map((register, cycleIndex) => register * (cycleIndex + 1)) // multiple each register value by the cycle index + 1
    .filter((_, cycleIndex) => (cycleIndex + 1 - 20) % 40 === 0) // filter out 20th cycle and then every 40th after that
    .reduce((acc, signalStrength) => acc + signalStrength, 0); // sum the signal strengths
}

function answerPartTwo(instructions: string[]): string {
  const output: string[] = getRegisterByCycle(instructions).map(
    (register, cycleIndex) =>
      Math.abs((cycleIndex % 40) - register) <= 1 ? "#" : "."
  ); // give "#" if cycle is within 1 of register otherwise "."

  // convert to screen
  return chunkify(output, 40)
    .map((arr) => arr.join(" "))
    .join("\n");
}

// solve

const data: string[] = fs.readFileSync("inputs/day10.txt", "utf8").split("\n");

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2:\n${answerPartTwo(data)}`);
