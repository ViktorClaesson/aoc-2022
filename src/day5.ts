import fs from "fs";

// data structures

class Instruction {
  amount: number;
  from: number;
  to: number;

  constructor(amount: number, from: number, to: number) {
    this.amount = amount;
    this.from = from;
    this.to = to;
  }
}

class Stack {
  name: number;
  boxes: string[];

  constructor(name: number, boxes: string[]) {
    this.name = name;
    this.boxes = boxes;
  }

  move(n: number, other: Stack, reverse: boolean) {
    other.#give(this.#take(n, reverse));
  }

  #take(n: number, reverse: boolean): string[] {
    const break_point: number = Math.max(this.boxes.length - n, 0);

    const to_take: string[] = this.boxes.slice(break_point, this.boxes.length);
    this.boxes = this.boxes.slice(0, break_point);

    return reverse ? to_take.reverse() : to_take;
  }

  #give(boxes: string[]) {
    this.boxes = this.boxes.concat(boxes);
  }
}

// methods

function init_stacks(init_stacks_data: string[]): Stack[] {
  const init_stacks_indexes = init_stacks_data[0]
    .split("")
    .map((val, idx) => (val !== " " ? idx : 0))
    .filter((val) => val !== 0);

  return init_stacks_indexes.map(
    (idx) =>
      new Stack(
        idx,
        init_stacks_data
          .slice(1)
          .map((line) => line.charAt(idx))
          .filter((val) => val !== " ")
      )
  );
}

function answer(
  stacks_data: string[],
  instructions: Instruction[],
  reverse: boolean
): string {
  const stacks: Stack[] = init_stacks(stacks_data);

  instructions.forEach((instruction) =>
    stacks[instruction.from - 1].move(
      instruction.amount,
      stacks[instruction.to - 1],
      reverse
    )
  );

  const answer: string = stacks
    .map((stack) => stack.boxes[stack.boxes.length - 1])
    .join("");

  return answer;
}

// solve

const data: string[] = fs.readFileSync("inputs/day5.txt", "utf8").split("\n\n");

const stacks_data: string[] = data[0].split("\n").reverse();
const instructions: Instruction[] = data[1]
  .split("\n")
  .map((line) => line.split(" "))
  .map((line) => new Instruction(+line[1], +line[3], +line[5]));

console.log(`answer 1: ${answer(stacks_data, instructions, true)}`);
console.log(`answer 2: ${answer(stacks_data, instructions, false)}`);
