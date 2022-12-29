import fs from "fs";

// data structures && init functions

class Action {
  type: string;
  value: number;

  constructor(type: string, value: number) {
    this.type = type;
    this.value = value;
  }

  perform(n: number): number {
    switch (this.type) {
      case "+":
        return n + this.value;
      case "-":
        return n - this.value;
      case "*":
        return n * this.value;
      case "/":
        return n / this.value;
      case "\\":
        return this.value / n;
      default:
        throw "something went wrong";
    }
  }

  reverse(n: number): number {
    switch (this.type) {
      case "+":
        return n - this.value;
      case "-":
        return n + this.value;
      case "*":
        return n / this.value;
      case "/":
        return n * this.value;
      case "\\":
        return this.value / n;
      default:
        throw "something went wrong";
    }
  }
}

// solution methods

function answerPartOneRec(
  monkey: string,
  monkeys: Map<string, string>
): number {
  const operation: string[] = monkeys.get(monkey)?.split(" ") as string[];

  if (operation.length === 1) {
    return +operation[0];
  } else {
    return new Action(
      operation[1],
      answerPartOneRec(operation[2], monkeys)
    ).perform(answerPartOneRec(operation[0], monkeys));
  }
}

function answerPartOne(monkeys: Map<string, string>): number {
  return answerPartOneRec("root", monkeys);
}

function answerPartTwoRec(
  monkey: string,
  monkeys: Map<string, string>
): number | Action[] {
  if (monkey === "humn") {
    return [];
  }

  const operation: string[] = monkeys.get(monkey)?.split(" ") as string[];

  if (operation.length === 1) {
    return +operation[0];
  } else {
    const left = answerPartTwoRec(operation[0], monkeys);
    const right = answerPartTwoRec(operation[2], monkeys);

    if (typeof left === "number" && typeof right === "object") {
      switch (operation[1]) {
        case "/":
          // A = B / X
          // 1 / A = X / B
          // (1 / A) * B = X
          return [
            new Action("\\", 1),
            new Action("/", answerPartOneRec(operation[0], monkeys)),
            ...right,
          ];
        case "-":
          // A = B - X
          // -A = X - B
          // -A + B = X
          return [
            new Action("*", -1),
            new Action("-", answerPartOneRec(operation[0], monkeys)),
            ...right,
          ];
        default:
          // Add & Mul are symmetrical, so no extra action is needed
          return [
            new Action(operation[1], answerPartOneRec(operation[0], monkeys)),
            ...right,
          ];
      }
    } else if (typeof left === "object" && typeof right === "number") {
      return [new Action(operation[1], right), ...left];
    } else if (typeof left === "number" && typeof right === "number") {
      return new Action(
        operation[1],
        answerPartOneRec(operation[2], monkeys)
      ).perform(answerPartOneRec(operation[0], monkeys));
    } else {
      throw "error: both left & right cannot be Action[]";
    }
  }
}

function answerPartTwo(monkeys: Map<string, string>): number {
  const operation: string[] = monkeys.get("root")?.split(" ") as string[];

  const left = answerPartTwoRec(operation[0], monkeys);
  const right = answerPartTwoRec(operation[2], monkeys);

  if (typeof left === "object" && typeof right === "number") {
    return left.reduce((value, action) => action.reverse(value), right);
  } else if (typeof left === "number" && typeof right === "object") {
    return right.reduce((value, action) => action.reverse(value), left);
  } else {
    throw "should be one number and one Action[]";
  }
}

// solve

const _ = (() => {
  const data: string[] = fs
    .readFileSync("inputs/day21.txt", "utf8")
    .split("\n");
  const monkeys: Map<string, string> = new Map(
    data.map((line) => line.split(": ", 2) as [string, string])
  );

  console.log(`Answer part 1: ${answerPartOne(monkeys)}`);
  console.log(`Answer part 2: ${answerPartTwo(monkeys)}`);
})();
