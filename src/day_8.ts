import fs from "fs";

// methods

function transpose(matrix: number[][]): number[][] {
  return [...Array(matrix[0].length).keys()].map((index) =>
    matrix.map((treeRow) => treeRow[index])
  );
}

function answer_1(matrix: number[][]): number {
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

function answer_2(): number {
  return 42;
}

// solve

const data: number[][] = fs
  .readFileSync("inputs/day_8.txt", "utf8")
  .split("\n")
  .map((line) => line.split("").map((tree) => +tree));

console.log(`answer 1: ${answer_1(data)}`);
console.log(`answer 2: ${answer_2()}`);
