import fs from "fs";
import { id1 } from "./utils/debug";

// data structures && init functions

class Blueprint {
  index: number;
  oreRobot: number;
  clayRobot: number;
  obsidianRobot: [number, number];
  geodeRobot: [number, number];

  maxOre: number;
  maxClay: number;
  maxObsidian: number;

  constructor(data: string[]) {
    this.index = +data[0];
    this.oreRobot = +data[1];
    this.clayRobot = +data[2];
    this.obsidianRobot = [+data[3], +data[4]];
    this.geodeRobot = [+data[5], +data[6]];

    this.maxOre = Math.max(
      this.oreRobot,
      this.clayRobot,
      this.obsidianRobot[0],
      this.geodeRobot[0]
    );
    this.maxClay = this.obsidianRobot[1];
    this.maxObsidian = this.geodeRobot[1];
  }

  toString() {
    return `Blueprint{i=${this.index},ore=${this.oreRobot},clay=${this.clayRobot},obsidian=${this.obsidianRobot},geode=${this.geodeRobot}}`;
  }
}

// solution methods

const upperLimitGeodesMemory: Map<string, number> = new Map();
function upperLimitGeodes(
  time: number,
  geodes: number,
  geodeRobots: number,
  creatingGeodeRobot: boolean
): number {
  if (time <= 0) {
    return geodes;
  }

  const memoryKey = `${time},${geodes},${geodeRobots},${creatingGeodeRobot}`;
  const memoryValue = upperLimitGeodesMemory.get(memoryKey);
  if (memoryValue) {
    return memoryValue;
  }

  const value = upperLimitGeodes(
    time - 1,
    geodes + geodeRobots,
    geodeRobots + (creatingGeodeRobot ? 1 : 0),
    true
  );
  upperLimitGeodesMemory.set(memoryKey, value);
  return value;
}

function maxGeodesSlow(
  blueprint: Blueprint,
  time: number,
  resources: number[] = [0, 0, 0, 0],
  robots: number[] = [1, 0, 0, 0],
  currentMax: number = 0
): number {
  // first attempt, very slow. Is just standard recursion, go 1 time tick per level
  // uses two optimisation:
  // * first is that there's no reason to produce more robots than what is necessary for the most expensive option (Since we can only make one per turn).
  // * second is that if the theoretical max is lower than the best found solution we return early. (theoretical max is just based on producing one geode robot per turn for the remaining time. Is way larger than reasonable but works as upper limit)

  globalCounter1 += 1;
  globalCounter2 += 1;

  if (time === 0) {
    return resources[3];
  }

  let answer: number = currentMax;

  if (
    resources[0] >= blueprint.geodeRobot[0] &&
    resources[2] >= blueprint.geodeRobot[1] &&
    upperLimitGeodes(time, resources[3], robots[3], true) > answer
  ) {
    const newResources = [
      resources[0] + robots[0] - blueprint.geodeRobot[0],
      resources[1] + robots[1],
      resources[2] + robots[2] - blueprint.geodeRobot[1],
      resources[3] + robots[3],
    ];
    const newRobots = [robots[0], robots[1], robots[2], robots[3] + 1];
    const newAnswer = maxGeodesSlow(
      blueprint,
      time - 1,
      newResources,
      newRobots,
      answer
    );
    if (newAnswer > answer) {
      answer = newAnswer;
    }
  }

  if (
    resources[0] >= blueprint.obsidianRobot[0] &&
    resources[1] >= blueprint.obsidianRobot[1] &&
    robots[2] < blueprint.maxObsidian &&
    upperLimitGeodes(time, resources[3], robots[3], false) > answer
  ) {
    const newResources = [
      resources[0] + robots[0] - blueprint.obsidianRobot[0],
      resources[1] + robots[1] - blueprint.obsidianRobot[1],
      resources[2] + robots[2],
      resources[3] + robots[3],
    ];
    const newRobots = [robots[0], robots[1], robots[2] + 1, robots[3]];
    const newAnswer = maxGeodesSlow(
      blueprint,
      time - 1,
      newResources,
      newRobots,
      answer
    );
    if (newAnswer > answer) {
      answer = newAnswer;
    }
  }

  if (
    resources[0] >= blueprint.clayRobot &&
    robots[1] < blueprint.maxClay &&
    upperLimitGeodes(time, resources[3], robots[3], false) > answer
  ) {
    const newResources = [
      resources[0] + robots[0] - blueprint.clayRobot,
      resources[1] + robots[1],
      resources[2] + robots[2],
      resources[3] + robots[3],
    ];
    const newRobots = [robots[0], robots[1] + 1, robots[2], robots[3]];
    const newAnswer = maxGeodesSlow(
      blueprint,
      time - 1,
      newResources,
      newRobots,
      answer
    );
    if (newAnswer > answer) {
      answer = newAnswer;
    }
  }

  if (
    resources[0] >= blueprint.oreRobot &&
    robots[0] < blueprint.maxOre &&
    upperLimitGeodes(time, resources[3], robots[3], false) > answer
  ) {
    const newResources = [
      resources[0] + robots[0] - blueprint.oreRobot,
      resources[1] + robots[1],
      resources[2] + robots[2],
      resources[3] + robots[3],
    ];
    const newRobots = [robots[0] + 1, robots[1], robots[2], robots[3]];
    const newAnswer = maxGeodesSlow(
      blueprint,
      time - 1,
      newResources,
      newRobots,
      answer
    );
    if (newAnswer > answer) {
      answer = newAnswer;
    }
  }

  if (upperLimitGeodes(time, resources[3], robots[3], false) > answer) {
    const newResources = [
      resources[0] + robots[0],
      resources[1] + robots[1],
      resources[2] + robots[2],
      resources[3] + robots[3],
    ];
    const newRobots = robots;
    const newAnswer = maxGeodesSlow(
      blueprint,
      time - 1,
      newResources,
      newRobots,
      answer
    );
    if (newAnswer > answer) {
      answer = newAnswer;
    }
  }

  return answer;
}

function maxGeodesFast(
  blueprint: Blueprint,
  time: number,
  resources: number[] = [0, 0, 0, 0],
  robots: number[] = [1, 0, 0, 0]
): number {
  // second attempt, order of 10-100x faster. uses event driven approach instead of just 1 tick per level.
  // so we need to wait 4 ticks until we can make a robot we just skip to time = 20.
  // also uses optimization 1 from slow solution, since it also applies here.

  globalCounter1 += 1;
  globalCounter2 += 1;

  if (time <= 0) {
    return resources[3];
  }

  let answer: number = resources[3] + robots[3] * time;

  if (robots[0] > 0 && robots[2] > 0) {
    const timeUntilAffordRobot = Math.max(
      0,
      Math.ceil((blueprint.geodeRobot[0] - resources[0]) / robots[0]),
      Math.ceil((blueprint.geodeRobot[1] - resources[2]) / robots[2])
    );
    if (timeUntilAffordRobot < time) {
      const awaitedResources = resources.map(
        (v, i) => v + robots[i] * timeUntilAffordRobot
      );
      const newResources = [
        awaitedResources[0] + robots[0] - blueprint.geodeRobot[0],
        awaitedResources[1] + robots[1],
        awaitedResources[2] + robots[2] - blueprint.geodeRobot[1],
        awaitedResources[3] + robots[3],
      ];
      const newRobots = [robots[0], robots[1], robots[2], robots[3] + 1];
      answer = Math.max(
        answer,
        maxGeodesFast(
          blueprint,
          time - timeUntilAffordRobot - 1,
          newResources,
          newRobots
        )
      );
    }
  }

  if (robots[0] > 0 && robots[1] > 0 && robots[2] < blueprint.maxObsidian) {
    const timeUntilAffordRobot = Math.max(
      0,
      Math.ceil((blueprint.obsidianRobot[0] - resources[0]) / robots[0]),
      Math.ceil((blueprint.obsidianRobot[1] - resources[1]) / robots[1])
    );
    if (timeUntilAffordRobot < time) {
      const awaitedResources = resources.map(
        (v, i) => v + robots[i] * timeUntilAffordRobot
      );
      const newResources = [
        awaitedResources[0] + robots[0] - blueprint.obsidianRobot[0],
        awaitedResources[1] + robots[1] - blueprint.obsidianRobot[1],
        awaitedResources[2] + robots[2],
        awaitedResources[3] + robots[3],
      ];
      const newRobots = [robots[0], robots[1], robots[2] + 1, robots[3]];
      answer = Math.max(
        answer,
        maxGeodesFast(
          blueprint,
          time - timeUntilAffordRobot - 1,
          newResources,
          newRobots
        )
      );
    }
  }

  if (robots[0] > 0 && robots[1] < blueprint.maxClay) {
    const timeUntilAffordRobot = Math.max(
      0,
      Math.ceil((blueprint.clayRobot - resources[0]) / robots[0])
    );
    if (timeUntilAffordRobot < time) {
      const awaitedResources = resources.map(
        (v, i) => v + robots[i] * timeUntilAffordRobot
      );
      const newResources = [
        awaitedResources[0] + robots[0] - blueprint.clayRobot,
        awaitedResources[1] + robots[1],
        awaitedResources[2] + robots[2],
        awaitedResources[3] + robots[3],
      ];
      const newRobots = [robots[0], robots[1] + 1, robots[2], robots[3]];
      answer = Math.max(
        answer,
        maxGeodesFast(
          blueprint,
          time - timeUntilAffordRobot - 1,
          newResources,
          newRobots
        )
      );
    }
  }

  if (robots[0] > 0 && robots[0] < blueprint.maxOre) {
    const timeUntilAffordRobot = Math.max(
      0,
      Math.ceil((blueprint.oreRobot - resources[0]) / robots[0])
    );
    if (timeUntilAffordRobot < time) {
      const awaitedResources = resources.map(
        (v, i) => v + robots[i] * timeUntilAffordRobot
      );
      const newResources = [
        awaitedResources[0] + robots[0] - blueprint.oreRobot,
        awaitedResources[1] + robots[1],
        awaitedResources[2] + robots[2],
        awaitedResources[3] + robots[3],
      ];
      const newRobots = [robots[0] + 1, robots[1], robots[2], robots[3]];
      answer = Math.max(
        answer,
        maxGeodesFast(
          blueprint,
          time - timeUntilAffordRobot - 1,
          newResources,
          newRobots
        )
      );
    }
  }

  return answer;
}

function answerPartOne(blueprints: Blueprint[]): number {
  return blueprints
    .map((blueprint) => {
      const bpMaxGeodes = maxGeodesFast(blueprint, 24);
      console.log(
        blueprint.index.toString().padStart(2),
        bpMaxGeodes.toString().padStart(3),
        (blueprint.index * bpMaxGeodes).toString().padStart(4),
        globalCounter2.toString().padStart(12),
        globalCounter1.toString().padStart(15)
      );
      globalCounter2 = 0;
      return blueprint.index * bpMaxGeodes;
    })
    .reduce((acc, val) => acc + val, 0);
}

function answerPartTwo(blueprints: Blueprint[]): number {
  return blueprints
    .slice(0, 3)
    .map((blueprint) => {
      const bpMaxGeodes = maxGeodesFast(blueprint, 32);
      console.log(
        blueprint.index.toString().padStart(2),
        bpMaxGeodes.toString().padStart(3),
        globalCounter2.toString().padStart(12),
        globalCounter1.toString().padStart(15)
      );
      globalCounter2 = 0;
      return bpMaxGeodes;
    })
    .reduce((acc, val) => acc * val, 1);
}

// solve

let globalCounter1 = 0;
let globalCounter2 = 0;

const _ = (() => {
  const data: Blueprint[] = fs
    .readFileSync("inputs/day19.txt", "utf8")
    .split("\n")
    .map((line) => [...line.matchAll(/\d+/g)].map((match) => match[0]))
    .map((line) => new Blueprint(line));

  globalCounter1 = 0;
  globalCounter2 = 0;
  console.log(`Answer part 1: ${answerPartOne(data)}`);

  globalCounter1 = 0;
  globalCounter2 = 0;
  console.log(`Answer part 2: ${answerPartTwo(data)}`);
})();
console.log(`calls: ${globalCounter1.toString().padStart(10)}`);
