import fs from "fs";

// solution methods

function answerPartOne(monkey: string, monkeys: Map<string, string>): number {
  const operation: string[] = monkeys.get(monkey)?.split(" ") as string[];

  if (operation.length === 1) {
    return +operation[0];
  } else {
    switch (operation[1]) {
      case "+":
        return (
          answerPartOne(operation[0], monkeys) +
          answerPartOne(operation[2], monkeys)
        );
      case "-":
        return (
          answerPartOne(operation[0], monkeys) -
          answerPartOne(operation[2], monkeys)
        );
      case "*":
        return (
          answerPartOne(operation[0], monkeys) *
          answerPartOne(operation[2], monkeys)
        );
      case "/":
        return (
          answerPartOne(operation[0], monkeys) /
          answerPartOne(operation[2], monkeys)
        );
      default:
        throw "something went wrong";
    }
  }
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: string[] = fs
    .readFileSync("inputs/day21.txt", "utf8")
    .split("\n");
  const monkeys: Map<string, string> = new Map(
    data.map((line) => line.split(": ", 2) as [string, string])
  );

  console.log(`Answer part 1: ${answerPartOne("root", monkeys)}`);
  console.log(`Answer part 2: ${answerPartTwo()}`);
})();
