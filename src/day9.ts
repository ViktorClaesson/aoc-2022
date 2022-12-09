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
}

// methods

function answerPartOne(instructions: string[][]): number {
  const head = new Head(new Tail(true));
  for (const [direction, amount] of instructions) {
    head.move(direction, +amount);
  }
  return head.tail.positionMemory.size;
}

function answerPartTwo(instructions: string[][]): number {
  const lastTail = new Tail(true);
  let currentTail = lastTail;
  for (let i = 0; i < 8; i++) {
    currentTail = new Tail(false, currentTail);
  }
  const head = new Head(currentTail);
  for (const [direction, amount] of instructions) {
    head.move(direction, +amount);
  }
  return lastTail.positionMemory.size;
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day9.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" "));

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo(data)}`);
