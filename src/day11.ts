import fs from "fs";

// data structures

class Monkey {
  items: number[];
  operation: (item: number) => number;
  testNumber: number;
  positiveTestMonkeyIndex: number;
  negativeTestMonkeyIndex: number;
  inspectCounter: number = 0;

  constructor(monkeyData: string[]) {
    this.items = monkeyData[1]
      .split(": ")[1]
      .split(", ")
      .map((item) => +item);
    this.operation = initMonkeyOperation(
      monkeyData[2].split(" = ")[1].split(" ")
    );
    this.testNumber = +monkeyData[3].trim().split(" ")[3];
    this.positiveTestMonkeyIndex = +monkeyData[4].trim().split(" ")[5];
    this.negativeTestMonkeyIndex = +monkeyData[5].trim().split(" ")[5];
  }

  doTurn(monkeys: Monkey[], worryFunction: (item: number) => number) {
    this.inspectCounter += this.items.length;
    this.items
      .map(this.operation)
      .map(worryFunction)
      .forEach((item) =>
        monkeys[
          item % this.testNumber === 0
            ? this.positiveTestMonkeyIndex
            : this.negativeTestMonkeyIndex
        ].items.push(item)
      );
    this.items = [];
  }
}

// methods

function initMonkeys(data: string[][]): Monkey[] {
  return data.map((monkeyData) => new Monkey(monkeyData));
}

function itemOrNumber(item: number, data: string): number {
  return data === "old" ? item : +data;
}

function initMonkeyOperation(
  operationData: string[]
): (item: number) => number {
  if (operationData[1] === "+") {
    return (item: number) =>
      itemOrNumber(item, operationData[0]) +
      itemOrNumber(item, operationData[2]);
  } else if (operationData[1] === "*") {
    return (item: number) =>
      itemOrNumber(item, operationData[0]) *
      itemOrNumber(item, operationData[2]);
  }

  throw `${operationData[1]} is not one of + and *`;
}

function answer(
  monkeys: Monkey[],
  rounds: number,
  worryFunction: (item: number) => number
): number {
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => monkey.doTurn(monkeys, worryFunction));
  }

  return monkeys
    .map((monkey) => monkey.inspectCounter)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((a, b) => a * b, 1);
}

function answerPartOne(monkeys: Monkey[]): number {
  return answer(monkeys, 20, (item) => Math.floor(item / 3));
}

function answerPartTwo(monkeys: Monkey[]): number {
  return answer(
    monkeys,
    10000,
    (item: number) =>
      item %
      monkeys
        .map((monkey) => monkey.testNumber)
        .reduce((acc, testNumber) => acc * testNumber, 1)
  );
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day11.txt", "utf8")
  .split("\n\n")
  .map((monkeyData) => monkeyData.split("\n"));

console.log(`Answer part 1: ${answerPartOne(initMonkeys(data))}`);
console.log(`Answer part 2: ${answerPartTwo(initMonkeys(data))}`);
