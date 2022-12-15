import fs from "fs";
import { rollingChunks, range } from "./utils/common";

// data structures && init functions

class CaveMatrix {
  #minCol: number;
  #matrix: string[][];

  constructor(data: [number, number][][]) {
    this.#minCol = Math.min(
      ...data.flatMap((line) => line).map(([col, _]) => col),
      500
    );
    const maxCol: number = Math.max(
      ...data.flatMap((line) => line).map(([col, _]) => col),
      500
    );
    const maxRow: number = Math.max(
      ...data.flatMap((line) => line).map(([_, row]) => row)
    );

    this.#matrix = Array(maxRow + 1)
      .fill(0)
      .map((_) => Array(maxCol - this.#minCol + 1).fill("."));

    data.forEach((line) =>
      rollingChunks(line, 2).map(([[col1, row1], [col2, row2]]) =>
        range(row1, row2).forEach((row) =>
          range(col1, col2).forEach(
            (col) => (this.#matrix[row][col - this.#minCol] = "#")
          )
        )
      )
    );
  }

  #checkFree(row: number, col: number): boolean {
    if (
      row < 0 ||
      row >= this.#matrix.length ||
      col < 0 ||
      col >= this.#matrix[row].length
    ) {
      return true;
    }
    return this.#matrix[row][col] === ".";
  }

  giveSand(): boolean {
    let row = 0;
    let col = 500 - this.#minCol;

    while (true) {
      if (this.#checkFree(row + 1, col)) {
        // go down
        row += 1;
      } else if (this.#checkFree(row + 1, col - 1)) {
        // go down left
        row += 1;
        col -= 1;
      } else if (this.#checkFree(row + 1, col + 1)) {
        // go down right
        row += 1;
        col += 1;
      } else {
        // at rest
        this.#matrix[row][col] = "o";
        return true;
      }

      if (
        row >= this.#matrix.length ||
        col < 0 ||
        col >= this.#matrix[row].length
      ) {
        // outside matrix
        return false;
      }
    }
  }

  countSand(): number {
    return this.#matrix
      .flatMap((row) => row.map((cell) => +(cell === "o")))
      .reduce((acc, val) => acc + val, 0);
  }

  print() {
    console.log(this.#matrix.map((row) => row.join("")).join("\n"));
  }
}

// solution methods

function answerPartOne(data: [number, number][][]): number {
  const cave = new CaveMatrix(data);
  while (cave.giveSand()) {}
  return cave.countSand();
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: [number, number][][] = fs
  .readFileSync("inputs/day14.txt", "utf8")
  .split("\n")
  .map((line) =>
    line
      .split(" -> ")
      .map((pair) => pair.split(","))
      .map(([col, row]) => [+col, +row])
  );

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
