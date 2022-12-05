import fs from "fs";

// read input

class Range {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  #contains_point(point: number): boolean {
    return this.min <= point && point <= this.max;
  }

  contains(other: Range): boolean {
    return this.#contains_point(other.min) && this.#contains_point(other.max);
  }

  overlap(other: Range): boolean {
    return this.#contains_point(other.min) || this.#contains_point(other.max);
  }
}

const data: Range[][] = fs
  .readFileSync("inputs/day_4.txt", "utf8")
  .split("\n")
  .map((line) => line.split(/[-,]/))
  .map(([range_1_min, range_1_max, range_2_min, range_2_max]) => [
    new Range(+range_1_min, +range_1_max),
    new Range(+range_2_min, +range_2_max),
  ]);

// part 1

const answer_1: number = data
  .map(
    ([range_1, range_2]) =>
      range_1.contains(range_2) || range_2.contains(range_1)
  )
  .reduce((acc, val) => acc + +val, 0);
console.log(answer_1);

// part 2

const answer_2: number = data
  .map(
    ([range_1, range_2]) => range_1.overlap(range_2) || range_2.overlap(range_1)
  )
  .reduce((acc, val) => acc + +val, 0);
console.log(answer_2);
