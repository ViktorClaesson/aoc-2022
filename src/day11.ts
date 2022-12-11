// data structures

class Monkey {
  items: number[];
  operation: (item: number) => number;
  testNumber: number;
  positiveTestMonkeyIndex: number;
  negativeTestMonkeyIndex: number;
  inspectCounter: number = 0;

  constructor(
    startingItems: number[],
    operation: (item: number) => number,
    testNumber: number,
    positiveTestMonkeyIndex: number,
    negativeTestMonkeyIndex: number
  ) {
    this.items = startingItems;
    this.operation = operation;
    this.testNumber = testNumber;
    this.positiveTestMonkeyIndex = positiveTestMonkeyIndex;
    this.negativeTestMonkeyIndex = negativeTestMonkeyIndex;
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

function initMonkeys(): Monkey[] {
  return [
    new Monkey([56, 52, 58, 96, 70, 75, 72], (item) => item * 17, 11, 2, 3),
    new Monkey([75, 58, 86, 80, 55, 81], (item) => item + 7, 3, 6, 5),
    new Monkey([73, 68, 73, 90], (item) => item ** 2, 5, 1, 7),
    new Monkey([72, 89, 55, 51, 59], (item) => item + 1, 7, 2, 7),
    new Monkey([76, 76, 91], (item) => item * 3, 19, 0, 3),
    new Monkey([88], (item) => item + 4, 2, 6, 4),
    new Monkey([64, 63, 56, 50, 77, 55, 55, 86], (item) => item + 8, 13, 4, 0),
    new Monkey([79, 58], (item) => item + 6, 17, 1, 5),
  ];
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

console.log(`Answer part 1: ${answerPartOne(initMonkeys())}`);
console.log(`Answer part 2: ${answerPartTwo(initMonkeys())}`);
