import fs from "fs";

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

  length(): number {
    return this.end - this.start + 1;
  }
}

// solution methods

function manhattan([x1, y1]: number[], [x2, y2]: number[]): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function parseLine(line: number[], yLine: number): Range[] {
  // Parses a line which contains four numbers, x1, y1, x2, y2. Where there's a scanner at (x1, y1) and the nearest beacon at (x2, y2).
  // Returns a list of one Range where beacons cannot be according to this line. Since then it would be closer than (x2, y2).
  // Or returns an empty list if there's no such range.
  // Aka there cannot be a beacon at (range.start, yLine) -> (range.end, yLine).

  const distToBeacon = manhattan(line.slice(0, 2), line.slice(2, 4));
  const distToLine = Math.abs(yLine - line[1]);

  if (distToLine > distToBeacon) {
    return [];
  }

  const spareDist = Math.max(distToBeacon - distToLine);
  return [new Range(line[0] - spareDist, line[0] + spareDist)];
}

function blockedSpaces(data: number[][], yLine: number): Range[] {
  return data
    .flatMap((line) => parseLine(line, yLine))
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
  const beacons = data
    .filter(([_1, _2, _3, y]) => y === yLine)
    .map(([_1, _2, x, _3]) => x);
  const ranges = blockedSpaces(data, yLine);

  return (
    ranges.reduce((acc, range) => acc + range.length(), 0) -
    new Set(
      beacons.filter((beacon) => ranges.some((range) => range.contains(beacon)))
    ).size
  );
}

function answerPartTwo(data: number[][], maxY: number): number {
  for (let y = 0; y < maxY; y++) {
    const ranges = blockedSpaces(data, y).map(
      (range) => new Range(Math.max(range.start, 0), Math.min(range.end, maxY))
    );

    if (ranges.reduce((acc, range) => acc + range.length(), 0) !== maxY + 1) {
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
