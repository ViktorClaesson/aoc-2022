import fs from "fs";

// data structures && init functions

function gcd(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

class Cave {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
  cycleLength: number;
  blizzards: Blizzard[];
  reversed: boolean;

  constructor(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    height: number,
    cycleLength: number,
    blizzards: Blizzard[],
    reversed: boolean
  ) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.width = width;
    this.height = height;
    this.cycleLength = cycleLength;
    this.blizzards = blizzards;
    this.reversed = reversed;
  }

  static fromData(data: string) {
    const matrix: string[][] = data.split("\n").map((line) => line.split(""));

    const startX = matrix[0].findIndex((c) => c === ".") - 1;
    const startY = -1;
    const endX = matrix[matrix.length - 1].findIndex((c) => c === ".") - 1;
    const endY = matrix.length - 2;
    const width = matrix[0].length - 2;
    const height = matrix.length - 2;
    const cycleLength = (width * height) / gcd(width, height);
    const blizzards = matrix
      .slice(1, matrix.length - 1)
      .flatMap((row, y) =>
        row.slice(1, row.length - 1).map((c, x) => new Blizzard(x, y, c))
      )
      .filter((blizzard) => blizzard.dir !== ".");

    return new Cave(
      startX,
      startY,
      endX,
      endY,
      width,
      height,
      cycleLength,
      blizzards,
      false
    );
  }

  inCave(x: number, y: number) {
    return (
      (0 <= x && x < this.width && 0 <= y && y < this.height) ||
      (x === this.startX && y === this.startY) ||
      (x === this.endX && y === this.endY)
    );
  }

  reverse(elapsedTime: number): Cave {
    return new Cave(
      this.endX,
      this.endY,
      this.startX,
      this.startY,
      this.width,
      this.height,
      this.cycleLength,
      this.blizzards.map((blizzard) => blizzard.move(this, elapsedTime)),
      !this.reversed
    );
  }
}

class Blizzard {
  x: number;
  y: number;
  dir: string;

  constructor(x: number, y: number, dir: string) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  move(cave: Cave, n: number): Blizzard {
    switch (this.dir) {
      case "^":
        return new Blizzard(
          this.x,
          (this.y - (n % cave.height) + cave.height) % cave.height,
          this.dir
        );
      case ">":
        return new Blizzard((this.x + n) % cave.width, this.y, this.dir);
      case "v":
        return new Blizzard(this.x, (this.y + n) % cave.height, this.dir);
      case "<":
        return new Blizzard(
          (this.x - (n % cave.width) + cave.width) % cave.width,
          this.y,
          this.dir
        );
    }

    throw `error: bad direction: '${this.dir}'`;
  }
}

// solution methods

function answerPartOne(cave: Cave): number {
  const stack: [number, number, number][] = [[cave.startX, cave.startY, 0]];
  const memory: Map<string, number> = new Map();
  let best = Infinity;
  for (let curr = stack.pop(); curr; curr = stack.pop()) {
    const [x, y, steps] = curr;

    const memoryKey: string = `${x},${y},${steps % cave.cycleLength}`;
    const memoryValue = memory.get(memoryKey);

    // check that we haven't been in this position before but with less steps taken
    if (memoryValue && memoryValue <= steps) {
      continue;
    }

    memory.set(memoryKey, steps);

    if (x === cave.endX && y === cave.endY) {
      if (steps < best) {
        best = steps;
      }
      continue;
    }

    // check that it is possible to beat current best from current position
    if (steps + Math.abs(cave.endX - x) + Math.abs(cave.endY - y) < best) {
      const futureBlizzards = cave.blizzards.map((blizzard) =>
        blizzard.move(cave, steps + 1)
      );

      // north, west, wait, east, south
      // go from worst to best solution to push onto stack so we check best first
      // where a better solution is to walk towards the goal (SE normally or NW if revsered)
      const options = cave.reversed
        ? [
            [x, y + 1],
            [x + 1, y],
            [x, y],
            [x - 1, y],
            [x, y - 1],
          ]
        : [
            [x, y - 1],
            [x - 1, y],
            [x, y],
            [x + 1, y],
            [x, y + 1],
          ];
      const validOptions = options.filter(
        ([newX, newY]) =>
          cave.inCave(newX, newY) &&
          !futureBlizzards.some(
            (futureBlizzard) =>
              futureBlizzard.x === newX && futureBlizzard.y === newY
          )
      );
      validOptions.forEach(([newX, newY]) =>
        stack.push([newX, newY, steps + 1])
      );
    }
  }

  return best;
}

function answerPartTwo(cave: Cave): number {
  let answer = 0;
  for (let i = 0; i < 3; i++) {
    const elapsedTime = answerPartOne(cave);
    console.log(`Trip ${i + 1}: ${elapsedTime}`);
    answer += elapsedTime;
    cave = cave.reverse(elapsedTime);
  }

  return answer;
}

// solve

const _ = (() => {
  const data: string = fs.readFileSync("inputs/day24.txt", "utf8");
  const cave: Cave = Cave.fromData(data);

  console.log(`Answer part 1: ${answerPartOne(cave)}`);
  console.log(`Answer part 2: ${answerPartTwo(cave)}`);
})();
