import fs from "fs";

// data structures && init functions

type Packet = (Packet | number)[];

// solution methods

function checkPackets([packet1, packet2]: Packet[]): boolean | undefined {
  if (packet1.length === 0 && packet2.length === 0) {
    return undefined;
  }

  if (packet1.length === 0) {
    return true;
  }

  if (packet2.length === 0) {
    return false;
  }

  const packet1Value: number | Packet = packet1[0];
  const packet2Value: number | Packet = packet2[0];

  if (typeof packet1Value === "number") {
    if (typeof packet2Value === "number") {
      if (packet1Value === packet2Value) {
        return checkPackets([packet1.slice(1), packet2.slice(1)]);
      } else {
        return packet1Value < packet2Value;
      }
    }

    return checkPackets([[packet1Value], packet2Value]);
  }

  if (typeof packet2Value === "number") {
    return checkPackets([packet1Value, [packet2Value]]);
  }

  const answer: boolean | undefined = checkPackets([
    packet1Value,
    packet2Value,
  ]);
  if (answer === undefined) {
    if (packet1.length === 1 && packet2.length === 1) {
      return true;
    }
    return checkPackets([packet1.slice(1), packet2.slice(1)]);
  }
  return answer;
}

function answerPartOne(pairs: string[][]): number {
  return pairs
    .map(([list1, list2]) => [eval(list1), eval(list2)])
    .map((packets, index) => (checkPackets(packets) ? index + 1 : 0))
    .reduce((acc, val) => acc + val, 0);
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day13.txt", "utf8")
  .split("\n\n")
  .map((pair) => pair.split("\n"));

console.log(`Answer part 1: ${answerPartOne(data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
