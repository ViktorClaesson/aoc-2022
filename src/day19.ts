import fs from "fs";

// data structures && init functions

class Blueprint {
  index: number;
  oreRobot: number;
  clayRobot: number;
  obsidianRobot: [number, number];
  geodeRobot: [number, number];

  constructor(data: string[]) {
    this.index = +data[0];
    this.oreRobot = +data[1];
    this.clayRobot = +data[2];
    this.obsidianRobot = [+data[3], +data[4]];
    this.geodeRobot = [+data[5], +data[6]];
  }
}

// solution methods

function maxGeodes(
  blueprint: Blueprint,
  time: number,
  resources: number[] = [0, 0, 0, 0],
  robots: number[] = [1, 0, 0, 0]
): number {
  if (time === 0) {
    return resources[3];
  }

  const newResources = resources.map((value, index) => value + robots[index]);
  let answer: number = maxGeodes(blueprint, time - 1, newResources, robots);
  if (newResources[0] >= blueprint.oreRobot) {
    answer = Math.max(
      answer,
      maxGeodes(
        blueprint,
        time - 1,
        [
          newResources[0] - blueprint.oreRobot,
          newResources[1],
          newResources[2],
          newResources[3],
        ],
        [robots[0] + 1, robots[1], robots[2], robots[3]]
      )
    );
  }
  if (newResources[0] >= blueprint.clayRobot) {
    answer = Math.max(
      answer,
      maxGeodes(
        blueprint,
        time - 1,
        [
          newResources[0] - blueprint.clayRobot,
          newResources[1],
          newResources[2],
          newResources[3],
        ],
        [robots[0], robots[1] + 1, robots[2], robots[3]]
      )
    );
  }
  if (
    newResources[0] >= blueprint.obsidianRobot[0] &&
    newResources[1] >= blueprint.obsidianRobot[1]
  ) {
    answer = Math.max(
      answer,
      maxGeodes(
        blueprint,
        time - 1,
        [
          newResources[0] - blueprint.obsidianRobot[0],
          newResources[1] - blueprint.obsidianRobot[1],
          newResources[2],
          newResources[3],
        ],
        [robots[0], robots[1], robots[2] + 1, robots[3]]
      )
    );
  }
  if (
    newResources[0] >= blueprint.geodeRobot[0] &&
    newResources[2] >= blueprint.geodeRobot[1]
  ) {
    answer = Math.max(
      answer,
      maxGeodes(
        blueprint,
        time - 1,
        [
          newResources[0] - blueprint.geodeRobot[0],
          newResources[1],
          newResources[2] - blueprint.geodeRobot[1],
          newResources[3],
        ],
        [robots[0], robots[1], robots[2], robots[3] + 1]
      )
    );
  }

  return answer;
}

function answerPartOne(blueprints: Blueprint[]): number {
  const solutions = blueprints.map(
    (blueprint) => blueprint.index * maxGeodes(blueprint, 24)
  );
  return Math.max(...solutions);
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: Blueprint[] = fs
    .readFileSync("inputs/day19.txt", "utf8")
    .split("\n")
    .map((line) => [...line.matchAll(/\d+/g)].map((match) => match[0]))
    .map((line) => new Blueprint(line));

  console.log(maxGeodes(data[0], 24));
  // console.log(`Answer part 1: ${answerPartOne(data)}`);
  // console.log(`Answer part 2: ${answerPartTwo()}`);
})();
