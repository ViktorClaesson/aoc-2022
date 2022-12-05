import * as fs from "fs";

// define structures

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

  move(n: number, other: Stack) {
    other.#give(this.#take(n));
  }

  #take(n: number): string[] {
    const break_point: number = Math.max(this.boxes.length - n, 0);

    const to_take: string[] = this.boxes.slice(break_point, this.boxes.length);
    this.boxes = this.boxes.slice(0, break_point);
    return to_take.reverse();
  }

  #give(boxes: string[]) {
    this.boxes = this.boxes.concat(boxes);
  }
}

// read input

const data: string[] = fs
  .readFileSync("inputs/day_5.txt", "utf8")
  .split("\n\n");

const initial_stacks_data: string[] = data[0].split("\n").reverse();
const initial_stacks_indexes = initial_stacks_data[0]
  .split("")
  .map((val, idx) => (val !== " " ? idx : 0))
  .filter((val) => val !== 0);

const instructions: Instruction[] = data[1]
  .split("\n")
  .map((line) => line.split(" "))
  .map((line) => new Instruction(+line[1], +line[3], +line[5]));

// part 1

const stacks_p1: Stack[] = initial_stacks_indexes.map(
  (idx) =>
    new Stack(
      idx,
      initial_stacks_data
        .slice(1)
        .map((line) => line.charAt(idx))
        .filter((val) => val !== " ")
    )
);

instructions.forEach((instruction) =>
  stacks_p1[instruction.from - 1].move(
    instruction.amount,
    stacks_p1[instruction.to - 1]
  )
);

const answer_1: string = stacks_p1
  .map((stack) => stack.boxes[stack.boxes.length - 1])
  .join("");
console.log(answer_1);

// part 2

const answer_2: number = 0;
console.log(answer_2);
