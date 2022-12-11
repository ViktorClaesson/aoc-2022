// data structures

class Monkey {
  items: number[];
  operation: (item: number) => number;
  test: (item: number) => boolean;
  positiveTestMonkeyIndex: number;
  negativeTestMonkeyIndex: number;
  inspectCounter: number = 0;

  constructor(
    startingItems: number[],
    operation: (item: number) => number,
    test: (item: number) => boolean,
    positiveTestMonkeyIndex: number,
    negativeTestMonkeyIndex: number
  ) {
    this.items = startingItems;
    this.operation = operation;
    this.test = test;
    this.positiveTestMonkeyIndex = positiveTestMonkeyIndex;
    this.negativeTestMonkeyIndex = negativeTestMonkeyIndex;
  }

  doTurn(monkeys: Monkey[]) {
    this.inspectCounter += this.items.length;
    this.items
      .map(this.operation)
      .map((item) => Math.floor(item / 3))
      .forEach((item) =>
        monkeys[
          this.test(item)
            ? this.positiveTestMonkeyIndex
            : this.negativeTestMonkeyIndex
        ].items.push(item)
      );
    this.items = [];
  }
}

// methods

function answerPartOne(monkeys: Monkey[]): number {
  for (let i = 0; i < 20; i++) {
    monkeys.forEach((monkey) => monkey.doTurn(monkeys));
  }

  return monkeys
    .map((monkey) => monkey.inspectCounter)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((a, b) => a * b, 1);
}

function answerPartTwo(): number {
  return 42;
}

// solve

const monkeys: Monkey[] = [
  new Monkey( // 0
    [56, 52, 58, 96, 70, 75, 72],
    (item) => item * 17,
    (item) => item % 11 === 0,
    2,
    3
  ),
  new Monkey( // 1
    [75, 58, 86, 80, 55, 81],
    (item) => item + 7,
    (item) => item % 3 === 0,
    6,
    5
  ),
  new Monkey( // 2
    [73, 68, 73, 90],
    (item) => item ** 2,
    (item) => item % 5 === 0,
    1,
    7
  ),
  new Monkey( // 3
    [72, 89, 55, 51, 59],
    (item) => item + 1,
    (item) => item % 7 === 0,
    2,
    7
  ),
  new Monkey( // 4
    [76, 76, 91],
    (item) => item * 3,
    (item) => item % 19 === 0,
    0,
    3
  ),
  new Monkey( // 5
    [88],
    (item) => item + 4,
    (item) => item % 2 === 0,
    6,
    4
  ),
  new Monkey( // 6
    [64, 63, 56, 50, 77, 55, 55, 86],
    (item) => item + 8,
    (item) => item % 13 === 0,
    4,
    0
  ),
  new Monkey( // 7
    [79, 58],
    (item) => item + 6,
    (item) => item % 17 === 0,
    1,
    5
  ),
];

console.log(`Answer part 1: ${answerPartOne(monkeys)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
