import fs from "fs";

// data structures && init functions

function stateString(
  currentCave: Cave,
  timeLeft: number,
  playersLeft: number,
  openValves: Set<Cave> = new Set()
): string {
  const valves = [...openValves.values()]
    .map((cave) => cave.name)
    .sort()
    .join(",");
  return `${currentCave.name},${timeLeft},${playersLeft},${valves}`;
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

function getPossibleRoutes(currentCave: Cave, openValves: Set<Cave>): Cave[] {
  return (
    currentCave.flow > 0 && !openValves.has(currentCave) ? [currentCave] : []
  ).concat(currentCave.network);
}

function calcPressureReleased(
  newCurrentCave: Cave,
  oldCurrentCave: Cave,
  timeLeft: number,
  openValves: Set<Cave>
): [number, Set<Cave>] {
  if (
    oldCurrentCave == newCurrentCave &&
    !openValves.has(oldCurrentCave) &&
    oldCurrentCave.flow > 0
  ) {
    return [
      oldCurrentCave.flow * (timeLeft - 1),
      new Set([oldCurrentCave, ...openValves]),
    ];
  } else {
    return [0, openValves];
  }
}

function answerRec(
  caves: Cave[],
  currentCave: Cave,
  timeLeft: number,
  playersLeft: number,
  resetCurrentCave: Cave,
  resetTime: number,
  openValves: Set<Cave>,
  memory: Map<string, number>
): number {
  if (timeLeft <= 1) {
    return playersLeft > 0
      ? answerRec(
          caves,
          resetCurrentCave,
          resetTime,
          playersLeft - 1,
          resetCurrentCave,
          resetTime,
          openValves,
          memory
        )
      : 0;
  }

  const memoryKey = stateString(currentCave, timeLeft, playersLeft, openValves);
  const memoryValue = memory.get(memoryKey);
  if (memoryValue !== undefined) {
    return memoryValue;
  }

  const possibleRoutes = getPossibleRoutes(currentCave, openValves);
  const returnValue: number = Math.max(
    ...possibleRoutes.map((newCurrentCave) => {
      const [pressureReleased, newOpenValves] = calcPressureReleased(
        currentCave,
        newCurrentCave,
        timeLeft,
        openValves
      );
      return (
        pressureReleased +
        answerRec(
          caves,
          newCurrentCave,
          timeLeft - 1,
          playersLeft,
          resetCurrentCave,
          resetTime,
          newOpenValves,
          memory
        )
      );
    })
  );

  memory.set(memoryKey, returnValue);
  return returnValue;
}

function answer(caves: Cave[], players: number, time: number) {
  const startCave = caves.find((cave) => cave.name === "AA") as Cave;
  return answerRec(
    caves,
    startCave,
    time,
    players - 1,
    startCave,
    time,
    new Set(),
    new Map()
  );
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

console.log(`Answer part 1: ${answer(caves, 1, 30)}`);
console.log(`Answer part 2: ${answer(caves, 2, 26)}`);
