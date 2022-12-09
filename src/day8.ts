import fs from "fs";

// methods

function linesfromTree(
  matrix: number[][],
  row: number,
  col: number
): number[][] {
  const treeRow = matrix[row];
  const treeCol = matrix.map((row) => row[col]);
  return [
    treeCol.slice(0, row).reverse(), // up
    treeCol.slice(row + 1, treeCol.length), // down
    treeRow.slice(0, col).reverse(), // left
    treeRow.slice(col + 1, treeRow.length), // right
  ];
}

function answerPartOne(matrix: number[][]): number {
  const visibleMatrix: boolean[][] = matrix.map((treeRow, row) =>
    treeRow.map((tree, col) =>
      linesfromTree(matrix, row, col).some((treeLine) =>
        treeLine.every((otherTree) => tree > otherTree)
      )
    )
  );
  return visibleMatrix.flatMap((_) => _).reduce((acc, val) => acc + +val, 0);
}

function visibleTrees(trees: number[], treeHeight: number): number {
  const visibleTrees = trees.findIndex((val) => val >= treeHeight);
  if (visibleTrees === -1) {
    return trees.length;
  } else {
    return visibleTrees + 1;
  }
}

function answerPartTwo(matrix: number[][]): number {
  const scenicValueMatrix: number[][] = matrix.map((treeRow, row) =>
    treeRow.map((tree, col) =>
      linesfromTree(matrix, row, col)
        .map((treeLine) => visibleTrees(treeLine, tree))
        .reduce((acc, val) => acc * val, 1)
    )
  );
  return Math.max(...scenicValueMatrix.flatMap((_) => _));
}

// solve

const data: number[][] = fs
  .readFileSync("inputs/day8.txt", "utf8")
  .split("\n")
  .map((line) => line.split("").map((tree) => +tree));

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo(data)}`);
