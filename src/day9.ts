import fs from "fs";

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

  moveX(delta: number) {
    for (let i = 0; i < Math.abs(delta); i++) {
      this.x += Math.sign(delta);
      this.tail.update(this.x, this.y);
    }
  }

  moveY(delta: number) {
    for (let i = 0; i < Math.abs(delta); i++) {
      this.y += Math.sign(delta);
      this.tail.update(this.x, this.y);
    }
  }
}

class Tail {
  x: number;
  y: number;
  positionMemory: Set<string>;

  constructor() {
    this.x = 0;
    this.y = 0;
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
    }
  }

  #memorizePosition() {
    this.positionMemory.add(`${this.x},${this.y}`);
  }
}

// methods

function answerPartOne(instructions: string[][]): number {
  const head = new Head(new Tail());
  for (const [direction, value] of instructions) {
    switch (direction) {
      case "R":
        head.moveX(+value);
        break;
      case "D":
        head.moveY(+value);
        break;
      case "L":
        head.moveX(-+value);
        break;
      case "U":
        head.moveY(-+value);
        break;
    }
  }
  return head.tail.positionMemory.size;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day9.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" "));

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
