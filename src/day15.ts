import fs from "fs";
import { range } from "./utils/common";
import { id1, idN } from "./utils/debug";

// data structures && init functions

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = Math.min(start, end);
    this.end = Math.max(start, end);
  }

  overlap(other: Range): boolean {
    return (
      !(this.end < other.start || other.end < this.start) ||
      this.end + 1 === other.start ||
      other.end + 1 === this.start
    );
  }

  combine(other: Range): Range {
    return new Range(
      Math.min(this.start, other.start),
      Math.max(this.end, other.end)
    );
  }

  contains(x: number): boolean {
    return this.start <= x && x <= this.end;
  }
}

// solution methods

function manhattan([x1, y1]: number[], [x2, y2]: number[]): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function parseLine(line: number[], yLine: number): Range | undefined {
  const distToBeacon = manhattan(line.slice(0, 2), line.slice(2, 4));
  const distToLine = Math.abs(yLine - line[1]);

  if (distToLine > distToBeacon) {
    return undefined;
  }

  const spareDist = Math.max(distToBeacon - distToLine);
  return new Range(line[0] - spareDist, line[0] + spareDist);
}

function blockedSpaces(data: number[][], yLine: number): Range[] {
  return data
    .map((line) => parseLine(line, yLine))
    .filter((range): range is Range => range !== undefined)
    .sort((range1, range2) => range1.start - range2.start)
    .reduce(
      (ranges: Range[], range: Range) =>
        ranges.length > 0 && ranges[ranges.length - 1].overlap(range)
          ? [...ranges.slice(0, -1), ranges[ranges.length - 1].combine(range)]
          : [...ranges, range],
      []
    );
}

function answerPartOne(data: number[][], yLine: number): number {
  const beaconsAtLine = data
    .filter(([_1, _2, _3, y]) => y === yLine)
    .map(([_1, _2, x, _3]) => x);
  const rangesAtLine = blockedSpaces(data, yLine);

  return (
    rangesAtLine.reduce(
      (acc, range) => acc + (range.end - range.start + 1),
      0
    ) -
    new Set(
      beaconsAtLine.filter((beacon) =>
        rangesAtLine.some((range) => range.contains(beacon))
      )
    ).size
  );
}

function answerPartTwo(data: number[][], maxY: number): number {
  for (let y = 0; y < maxY; y++) {
    const ranges = blockedSpaces(data, y).map(
      (range) => new Range(Math.max(range.start, 0), Math.min(range.end, maxY))
    );

    if (
      ranges.reduce((acc, range) => acc + range.end - range.start + 1, 0) !==
      maxY + 1
    ) {
      return (ranges[0].end + 1) * 4000000 + y;
    }
  }
  return -1;
}

// solve

const data: number[][] = fs
  .readFileSync("inputs/day15.txt", "utf8")
  .split("\n")
  .map((line) => [...line.matchAll(/-?\d+/g)].map((match) => +match[0]));

console.log(`Answer part 1: ${answerPartOne(data, 2000000)}`);
console.log(`Answer part 2: ${answerPartTwo(data, 4000000)}`);
