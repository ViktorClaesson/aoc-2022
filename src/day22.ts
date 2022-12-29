import fs from "fs";

// solution methods

function minMax(line: string[]): [number, number] {
  const min = line.findIndex((v) => v !== " ");
  const max =
    line.length -
    1 -
    line
      .slice()
      .reverse()
      .findIndex((v) => v && v !== " ");
  return [min, max];
}

function answerPartOne(matrix: string[][], instructions: string[]): number {
  let dir: number = 0;
  let col: number = matrix[0].lastIndexOf(" ") + 1;
  let row: number = 0;

  instructions.forEach((i) => {
    if (i === "L") {
      dir = (dir + 3) % 4;
    } else if (i === "R") {
      dir = (dir + 1) % 4;
    } else {
      let toMove = +i;
      while (toMove > 0) {
        let newRow: number;
        let newCol: number;

        if (dir === 0) {
          const [minCol, maxCol] = minMax(matrix[row]);
          newRow = row;
          newCol = col + 1 <= maxCol ? col + 1 : minCol;
        } else if (dir === 1) {
          const [minRow, maxRow] = minMax(matrix.map((row) => row[col]));
          newRow = row + 1 <= maxRow ? row + 1 : minRow;
          newCol = col;
        } else if (dir === 2) {
          const [minCol, maxCol] = minMax(matrix[row]);
          newRow = row;
          newCol = col - 1 >= minCol ? col - 1 : maxCol;
        } else if (dir === 3) {
          const [minRow, maxRow] = minMax(matrix.map((row) => row[col]));
          newRow = row - 1 >= minRow ? row - 1 : maxRow;
          newCol = col;
        } else {
          throw `error: dir ${dir}`;
        }

        if (matrix[newRow][newCol] === "#") {
          toMove = 0;
        } else {
          row = newRow;
          col = newCol;
          toMove -= 1;
        }
      }
    }
  });

  return 1000 * (row + 1) + 4 * (col + 1) + dir;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: string = fs.readFileSync("inputs/day22.txt", "utf8");

  const [matrixData, instructionData] = data.split("\n\n");

  const matrix: string[][] = matrixData
    .split("\n")
    .map((line) => line.split(""));
  const instructions: string[] = instructionData.split(/([LR])/);

  console.log(`Answer part 1: ${answerPartOne(matrix, instructions)}`);
  console.log(`Answer part 2: ${answerPartTwo()}`);
})();
