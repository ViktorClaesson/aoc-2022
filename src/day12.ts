import fs from "fs";

// init data methods

function convertCharacterHeight(character: string): number {
  switch (character) {
    case "S":
      return "a".charCodeAt(0);
    case "E":
      return "z".charCodeAt(0);
    default:
      return character.charCodeAt(0);
  }
}

function findCharacter(data: string[][], character: string): [number, number] {
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      if (data[row][col] === character) {
        return [row, col];
      }
    }
  }
  throw `couldn't find character '${character}'`;
}

// solution methods

function neighbours([row, col]: [number, number]): [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
] {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
}

function checkHeight(
  map: number[][],
  [row, col]: [number, number],
  compareHeight: number
): boolean {
  if (row >= 0 && row < map.length) {
    if (col >= 0 && col < map[row].length) {
      return map[row][col] >= compareHeight - 1;
    }
  }
  return false;
}

function initStepsNeeded(map: number[][], end: [number, number]): number[][] {
  const stepsNeeded = map.map((line) => line.map((_) => Infinity));
  stepsNeeded[end[0]][end[1]] = 0;
  const cellsToCheck: [number, number][] = [end];
  while (cellsToCheck.length) {
    const cell = cellsToCheck.pop();
    if (cell) {
      neighbours(cell).forEach((neighbour) => {
        if (checkHeight(map, neighbour, map[cell[0]][cell[1]])) {
          if (
            stepsNeeded[cell[0]][cell[1]] + 1 <
            stepsNeeded[neighbour[0]][neighbour[1]]
          ) {
            cellsToCheck.push(neighbour);
            stepsNeeded[neighbour[0]][neighbour[1]] =
              stepsNeeded[cell[0]][cell[1]] + 1;
          }
        }
      });
    }
  }
  return stepsNeeded;
}

function answerPartOne(
  map: number[][],
  start: [number, number],
  end: [number, number]
): number {
  return initStepsNeeded(map, end)[start[0]][start[1]];
}

function answerPartTwo(map: number[][], end: [number, number]): number {
  const stepsNeeded: number[][] = initStepsNeeded(map, end);
  return Math.min(
    ...map.flatMap((line, row) =>
      line.map((height, col) =>
        height === "a".charCodeAt(0) ? stepsNeeded[row][col] : Infinity
      )
    )
  );
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day12.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

const map: number[][] = data.map((line) => line.map(convertCharacterHeight));
const start: [number, number] = findCharacter(data, "S");
const end: [number, number] = findCharacter(data, "E");

console.log(`Answer part 1: ${answerPartOne(map, start, end)}`);
console.log(`Answer part 2: ${answerPartTwo(map, end)}`);
