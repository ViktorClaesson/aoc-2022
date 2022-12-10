import fs from "fs";

// methods

function answerPartOne(instructions: string[]): number {
  // padd the "addx" instructions with a "noop" before since they take 2 cycles.
  instructions = instructions.flatMap((instruction) =>
    instruction.startsWith("addx") ? ["noop", instruction] : [instruction]
  );

  let sum: number = 0;
  let register: number = 1;
  instructions.forEach((instruction, cycle) => {
    if ((cycle + 1 - 20) % 40 === 0) {
      sum += (cycle + 1) * register;
    }

    if (instruction.startsWith("addx")) {
      const [_, amount] = instruction.split(" ");
      register += +amount;
    }
  });
  return sum;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[] = fs.readFileSync("inputs/day10.txt", "utf8").split("\n");

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
