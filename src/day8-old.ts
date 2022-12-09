import fs from "fs";

// methods

function transpose(matrix: number[][]): number[][] {
  return [...Array(matrix[0].length).keys()].map((index) =>
    matrix.map((treeRow) => treeRow[index])
  );
}

function answerPartOne(matrix: number[][]): number {
  // decided to use a different solution. I do think this would be better for large inputs though, since it pre calculates a matrix for the height needed to be seen.
  // compared to iterating through the row and column for each cell in the matrix. Haven't done any analysis on it though, so not 100% sure.

  // from the trees perspective what's the highest tree looking towards west
  const maxWest: number[][] = matrix.map((treeRow) =>
    treeRow
      .slice(0, treeRow.length - 1)
      .reduce(
        (acc, val) => acc.concat(Math.max(acc[acc.length - 1], val)),
        [-1]
      )
  );

  // from the trees perspective what's the highest tree looking towards east
  const maxEast: number[][] = matrix.map((treeRow) =>
    treeRow
      .slice(1)
      .reverse()
      .reduce(
        (acc, val) => acc.concat(Math.max(acc[acc.length - 1], val)),
        [-1]
      )
      .reverse()
  );

  // from the trees perspective what's the highest tree looking towards north
  const maxNorth: number[][] = transpose(
    transpose(matrix).map((treeCol) =>
      treeCol
        .slice(0, treeCol.length - 1)
        .reduce(
          (acc, val) => acc.concat(Math.max(acc[acc.length - 1], val)),
          [-1]
        )
    )
  );

  // from the trees perspective what's the highest tree looking towards south
  const maxSouth: number[][] = transpose(
    transpose(matrix).map((treeCol) =>
      treeCol
        .slice(1)
        .reverse()
        .reduce(
          (acc, val) => acc.concat(Math.max(acc[acc.length - 1], val)),
          [-1]
        )
        .reverse()
    )
  );

  return matrix
    .flatMap((treeLine, row) =>
      treeLine.map(
        (tree, col) =>
          +(
            tree >
            Math.min(
              maxWest[row][col],
              maxEast[row][col],
              maxNorth[row][col],
              maxSouth[row][col]
            )
          )
      )
    )
    .reduce((acc, val) => acc + val, 0);
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: number[][] = fs
  .readFileSync("inputs/day8.txt", "utf8")
  .split("\n")
  .map((line) => line.split("").map((tree) => +tree));

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
