import { notDeepEqual } from "assert";
import fs from "fs";
import { rollingChunks, range } from "./utils/common";

// data structures && init functions

class CaveMatrix {
  #minCol: number;
  #matrix: string[][];
  #infiniteFloor: boolean;

  constructor(data: [number, number][][], infiniteFloor: boolean) {
    this.#infiniteFloor = infiniteFloor;
    this.#minCol = Math.min(
      ...data.flatMap((line) => line).map(([col, _]) => col),
      500
    );

    const cols: number =
      Math.max(...data.flatMap((line) => line).map(([col, _]) => col), 500) -
      this.#minCol +
      1;
    const rows: number =
      Math.max(...data.flatMap((line) => line).map(([_, row]) => row), 0) + 1;

    this.#matrix = Array(rows)
      .fill(0)
      .map((_) => Array(cols).fill("."));
    if (this.#infiniteFloor) {
      this.#matrix = this.#matrix.concat([
        Array(cols).fill("."),
        Array(cols).fill("#"),
      ]);
    }

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
    return (
      row >= this.#matrix.length ||
      col < 0 ||
      col >= this.#matrix[row].length ||
      this.#matrix[row][col] === "."
    );
  }

  #expandWest() {
    this.#minCol--;
    this.#matrix = this.#matrix.map((row, index, rows) => [
      index === rows.length - 1 ? "#" : ".",
      ...row,
    ]);
  }

  #expandEast() {
    this.#matrix = this.#matrix.map((row, index, rows) => [
      ...row,
      index === rows.length - 1 ? "#" : ".",
    ]);
  }

  giveSand(): boolean {
    let row = 0;
    let col = 500 - this.#minCol;

    if (!this.#checkFree(row, col)) {
      return false;
    }

    while (true) {
      if (this.#infiniteFloor) {
        // if we are using the infiniteFloor option we should expand west/east respectively if we're ever at the border.
        // so that we expand the floor and can check if it's free.
        if (col === 0) {
          this.#expandWest();
          col++;
        } else if (col === this.#matrix[row].length - 1) {
          this.#expandEast();
        }
      }

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

      // only really happens if the infiniteFloor option is false.
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
}

// solution methods

function answerPartOne(data: [number, number][][]): number {
  const cave = new CaveMatrix(data, false);
  while (cave.giveSand()) {}
  return cave.countSand();
}

function answerPartTwo(data: [number, number][][]): number {
  const cave = new CaveMatrix(data, true);
  while (cave.giveSand()) {}
  return cave.countSand();
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
console.log(`Answer part 2: ${answerPartTwo(data)}`);
