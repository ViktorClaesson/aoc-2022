import { time } from "console";
import fs from "fs";
import { id1, idN } from "./utils/debug";

// data structures && init functions

class State {
  currentCave: Cave;
  timeLeft: number;
  openValves: Set<Cave> = new Set();

  constructor(
    currentCave: Cave,
    timeLeft: number,
    openValves: Set<Cave> = new Set()
  ) {
    this.currentCave = currentCave;
    this.timeLeft = timeLeft;
    this.openValves = openValves;
  }

  toString(): string {
    const openValves = [...this.openValves.values()]
      .map((cave) => cave.name)
      .sort()
      .join(",");
    return `${this.currentCave.name},${this.timeLeft},${openValves}`;
  }
}

class Cave {
  name: string;
  flow: number;
  network: Cave[];

  constructor(name: string, flow: number) {
    this.name = name;
    this.flow = flow;
    this.network = [];
  }

  initNetwork(network: Cave[]) {
    this.network = network;
  }

  toString(): string {
    return `${this.name}, ${this.flow}, [${this.network
      .map((cave) => cave.name)
      .join(", ")}]`;
  }
}

function initCaves(data: string[][]): Cave[] {
  const caves = data.map(([name, flow, _]) => new Cave(name, +flow));
  data.forEach(([name, _, network]) => {
    caves
      .find((cave) => cave.name === name)
      ?.initNetwork(
        caves.filter((other) =>
          network.split(", ").some((otherName) => otherName === other.name)
        )
      );
  });
  return caves;
}

// solution methods

function answerPartOne(
  caves: Cave[],
  currentCave: Cave,
  timeLeft: number,
  openValves: Set<Cave> = new Set(),
  memory: Map<string, number> = new Map()
): number {
  if (timeLeft === 0) {
    return 0;
  }

  const memoryKey = new State(currentCave, timeLeft, openValves).toString();
  const memoryValue = memory.get(memoryKey);
  if (memoryValue !== undefined) {
    return memoryValue;
  }

  let returnValue: number = 0;
  if (openValves.has(currentCave) || currentCave.flow === 0) {
    returnValue = Math.max(
      ...currentCave.network.map((cave) =>
        answerPartOne(caves, cave, timeLeft - 1, openValves, memory)
      )
    );
  } else {
    returnValue = Math.max(
      currentCave.flow * (timeLeft - 1) +
        answerPartOne(
          caves,
          currentCave,
          timeLeft - 1,
          new Set([currentCave, ...openValves]),
          memory
        ),
      ...currentCave.network.map((cave) =>
        answerPartOne(caves, cave, timeLeft - 1, openValves, memory)
      )
    );
  }
  memory.set(memoryKey, returnValue);
  return returnValue;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data = fs
  .readFileSync("inputs/day16.txt", "utf8")
  .split("\n")
  .map((line) =>
    (
      line.match(
        /Valve ([A-Z]{2}) has flow rate=(\d+); (?:tunnel leads to valve|tunnels lead to valves) ([A-Z]{2}(?:, [A-Z]{2})*)/
      ) || []
    ).slice(1)
  );

const caves = initCaves(data);
const startingCave = caves.find((cave) => cave.name === "AA") as Cave;

console.log(`Answer part 1: ${answerPartOne(caves, startingCave, 30)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
