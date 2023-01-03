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

  constructor(data: string) {
    const matrix: string[][] = data.split("\n").map((line) => line.split(""));

    this.startX = matrix[0].findIndex((c) => c === ".") - 1;
    this.startY = -1;

    this.endX = matrix[matrix.length - 1].findIndex((c) => c === ".") - 1;
    this.endY = matrix.length - 2;

    this.width = matrix[0].length - 2;
    this.height = matrix.length - 2;
    this.cycleLength =
      (this.width * this.height) / gcd(this.width, this.height);

    this.blizzards = matrix
      .slice(1, matrix.length - 1)
      .flatMap((row, y) =>
        row.slice(1, row.length - 1).map((c, x) => new Blizzard(x, y, c))
      )
      .filter((blizzard) => blizzard.dir !== ".");
  }

  inCave(x: number, y: number) {
    return (
      (0 <= x && x < this.width && 0 <= y && y < this.height) ||
      (x === this.startX && y === this.startY) ||
      (x === this.endX && y === this.endY)
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

  move(map: Cave, n: number): Blizzard {
    switch (this.dir) {
      case "^":
        return new Blizzard(
          this.x,
          (this.y - n + Math.ceil(n / map.height) * map.height) % map.height,
          this.dir
        );
      case ">":
        return new Blizzard((this.x + n) % map.width, this.y, this.dir);
      case "v":
        return new Blizzard(this.x, (this.y + n) % map.height, this.dir);
      case "<":
        return new Blizzard(
          (this.x - n + Math.ceil(n / map.width) * map.width) % map.width,
          this.y,
          this.dir
        );
    }

    throw `error: bad direction: '${this.dir}'`;
  }
}

// solution methods

function answerPartOne(map: Cave): number {
  const stack: [number, number, number][] = [[map.startX, map.startY, 0]];
  const memory: Map<string, number> = new Map();
  let best = Infinity;
  for (let curr = stack.pop(); curr; curr = stack.pop()) {
    const [x, y, steps] = curr;

    const memoryKey: string = `${x},${y},${steps % map.cycleLength}`;
    const memoryValue = memory.get(memoryKey);

    // check that we haven't been in this position before but with less steps taken
    if (memoryValue && memoryValue <= steps) {
      continue;
    }

    memory.set(memoryKey, steps);

    if (x === map.endX && y === map.endY) {
      if (steps < best) {
        best = steps;
      }
      continue;
    }

    // check that it is possible to beat current best from current position
    if (steps + Math.abs(map.endX - x) + Math.abs(map.endY - y) < best) {
      const futureBlizzards = map.blizzards.map((blizzard) =>
        blizzard.move(map, steps + 1)
      );

      // north, west, wait, east, south
      // go from worst to best solution to push onto stack so we check best first
      // (where a better solution is to walk towards the goal, aka down or right)
      [
        [x, y - 1],
        [x - 1, y],
        [x, y],
        [x + 1, y],
        [x, y + 1],
      ]
        .filter(
          ([newX, newY]) =>
            map.inCave(newX, newY) &&
            !futureBlizzards.some(
              (futureBlizzard) =>
                futureBlizzard.x === newX && futureBlizzard.y === newY
            )
        )
        .forEach(([newX, newY]) => stack.push([newX, newY, steps + 1]));
    }
  }

  return best;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: string = fs.readFileSync("inputs/day24.txt", "utf8");
  const map: Cave = new Cave(data);

  console.log(`Answer part 1: ${answerPartOne(map)}`);
  console.log(`Answer part 2: ${answerPartTwo()}`);
})();
