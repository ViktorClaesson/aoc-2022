import fs from "fs";
import readline from "readline";

import { chunksBySize } from "./utils/common";

// data structures

class Head {
  x: number;
  y: number;
  tail: Tail;

  constructor(tail: Tail) {
    this.x = 0;
    this.y = 0;
    this.tail = tail;
  }

  move(direction: string, amount: number) {
    switch (direction) {
      case "R":
        this.#moveX(amount);
        break;
      case "D":
        this.#moveY(amount);
        break;
      case "L":
        this.#moveX(-amount);
        break;
      case "U":
        this.#moveY(-amount);
        break;
    }
  }

  #moveX(delta: number) {
    for (let i = 0; i < Math.abs(delta); i++) {
      this.x += Math.sign(delta);
      this.tail.update(this.x, this.y);
    }
  }

  #moveY(delta: number) {
    for (let i = 0; i < Math.abs(delta); i++) {
      this.y += Math.sign(delta);
      this.tail.update(this.x, this.y);
    }
  }

  rest() {
    return [this.tail, ...this.tail.rest()];
  }

  size() {
    return 1 + this.rest().length;
  }
}

class Tail {
  x: number;
  y: number;
  tail?: Tail;
  memoriseTrip: boolean;
  positionMemory: Set<string>;

  constructor(memoriseTrip: boolean, tail?: Tail) {
    this.x = 0;
    this.y = 0;
    this.tail = tail;
    this.memoriseTrip = memoriseTrip;
    this.positionMemory = new Set();
    this.#memorizePosition();
  }

  update(targetX: number, targetY: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      this.x += Math.sign(dx);
      this.y += Math.sign(dy);

      this.#memorizePosition();
      this.tail?.update(this.x, this.y);
    }
  }

  #memorizePosition() {
    if (this.memoriseTrip) {
      this.positionMemory.add(`${this.x},${this.y}`);
    }
  }

  end(): Tail {
    return this.tail ? this.tail.end() : this;
  }

  rest(): Tail[] {
    return this.tail ? [this.tail, ...this.tail.rest()] : [];
  }
}

// methods

function initRope(knots: number): Head {
  if (knots < 2) {
    throw `knots (${knots}) has to be at least 2`;
  }

  let currentTail = new Tail(true);
  for (let i = 0; i < knots - 2; i++) {
    currentTail = new Tail(false, currentTail);
  }
  return new Head(currentTail);
}

function answer(instructions: string[][], knots: number): number {
  const head = initRope(knots);
  for (const [direction, amount] of instructions) {
    head.move(direction, +amount);
  }
  return head.tail.end().positionMemory.size;
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day9.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" "));

console.log(`Answer part 1: ${answer(data, 2)}`);
console.log(`Answer part 2: ${answer(data, 10)}`);

// extra

function printBoard(head: Head) {
  const size: number = head.size() * 2 + 1;

  const board: string[][] = chunksBySize(Array(size * size).fill("."), size);

  const m = Math.floor(size / 2);
  head
    .rest()
    .reverse()
    .forEach(
      (tail, index, tails) =>
        (board[m + tail.y - head.y][m + tail.x - head.x] = `${
          tails.length - index
        }`)
    );
  board[m][m] = "H";

  console.log(board.map((row) => row.join("")).join("\n"));
}

function askQuestion(head: Head, rl: readline.Interface) {
  rl.question("[u]p, [d]own, [r]ight, or [l]eft?\n", (direction) => {
    head.move(direction.toUpperCase(), 1);
    printBoard(head);
    askQuestion(head, rl);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "How big of a rope do you want? Enter a number of at least 2.\n",
  (size) => {
    const head = initRope(+size);
    printBoard(head);
    askQuestion(head, rl);
  }
);
