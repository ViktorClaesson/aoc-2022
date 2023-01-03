import fs from "fs";

// solution methods

function decimalDigitToSnafu(c: number): string {
  switch (c) {
    case -2:
      return "=";
    case -1:
      return "-";
    case 0:
      return "0";
    case 1:
      return "1";
    case 2:
      return "2";
  }
  throw `error: ${c} isn't a snafu digit`;
}

function snafu(decimal: number): string {
  let rollOver: number = 0;
  let answer = "";
  for (let i = 0; Math.abs(decimal) >= 5 ** i; i++) {
    const newDigit = rollOver + Math.floor((decimal % 5 ** (i + 1)) / 5 ** i);
    if (newDigit > 2) {
      answer = `${decimalDigitToSnafu(newDigit - 5)}${answer}`;
      rollOver = 1;
    } else if (newDigit < -2) {
      answer = `${decimalDigitToSnafu(newDigit + 5)}${answer}`;
      rollOver = -1;
    } else {
      answer = `${decimalDigitToSnafu(newDigit)}${answer}`;
      rollOver = 0;
    }
  }
  if (rollOver !== 0) {
    answer = `${decimalDigitToSnafu(rollOver)}${answer}`;
  }
  return answer ? answer : "0";
}

function snafuDigitToDecimal(c: string): number {
  switch (c) {
    case "=":
      return -2;
    case "-":
      return -1;
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
  }
  throw `error: ${c} isn't a snafu digit`;
}

function decimal(snafu: string): number {
  return snafu
    .split("")
    .map((c, i, arr) => 5 ** (arr.length - 1 - i) * snafuDigitToDecimal(c))
    .reduce((acc, val) => acc + val, 0);
}

function answerPartOne(data: string[]): string {
  return snafu(data.map(decimal).reduce((acc, val) => acc + val, 0));
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: string[] = fs
    .readFileSync("inputs/day25.txt", "utf8")
    .split("\n");

  console.log(`Answer part 1: ${answerPartOne(data)}`);
  console.log(`Answer part 2: ${answerPartTwo()}`);
})();
