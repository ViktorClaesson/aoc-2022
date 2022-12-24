import fs, { read } from "fs";

// data structures && init functions

class LavaBlob {
  cubes: string[];
  cubesSet: Set<string>;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;

  constructor(cubePositions: string[]) {
    this.cubes = cubePositions;
    this.cubesSet = new Set(cubePositions);

    this.minX = Math.min(
      ...this.cubes.map((position) => +position.split(",")[0])
    );
    this.maxX = Math.max(
      ...this.cubes.map((position) => +position.split(",")[0])
    );
    this.minY = Math.min(
      ...this.cubes.map((position) => +position.split(",")[1])
    );
    this.maxY = Math.max(
      ...this.cubes.map((position) => +position.split(",")[1])
    );
    this.minZ = Math.min(
      ...this.cubes.map((position) => +position.split(",")[2])
    );
    this.maxZ = Math.max(
      ...this.cubes.map((position) => +position.split(",")[2])
    );
  }

  outsideBoundary(cubePosition: string) {
    const [x, y, z] = cubePosition.split(",").map((i) => +i);
    return (
      x < this.minX ||
      x > this.maxX ||
      y < this.minY ||
      y > this.maxY ||
      z < this.minZ ||
      z > this.maxZ
    );
  }
}

// solution methods

function debug(lavaBlob: LavaBlob) {
  const reachableAir = getReachableAir(lavaBlob);
  for (let z = lavaBlob.minZ; z <= lavaBlob.maxZ; z++) {
    console.log(`z=${z}`);
    console.log(
      "   " +
        [...Array(lavaBlob.maxX - lavaBlob.minX + 3).keys()]
          .map((x) => `${x + lavaBlob.minX - 1}`.padEnd(2))
          .join(" ") +
        "\n" +
        [...Array(lavaBlob.maxY - lavaBlob.minY + 3).keys()]
          .map(
            (y) =>
              `${y + lavaBlob.minY - 1} `.padStart(3) +
              [...Array(lavaBlob.maxX - lavaBlob.minX + 3).keys()]
                .map((x) => `${x - 1},${y - 1},${z}`)
                .map((pos) =>
                  lavaBlob.cubesSet.has(pos)
                    ? "#"
                    : lavaBlob.outsideBoundary(pos) || reachableAir.has(pos)
                    ? "."
                    : " "
                )
                .join("  ") +
              ` ${y + lavaBlob.minY - 1}`.padStart(3)
          )
          .join("\n") +
        "\n" +
        "   " +
        [...Array(lavaBlob.maxX - lavaBlob.minX + 3).keys()]
          .map((x) => `${x + lavaBlob.minX - 1}`.padEnd(2))
          .join(" ")
    );
    console.log("");
  }
}

function neighbours(cubePosition: string): string[] {
  const [x, y, z] = cubePosition.split(",").map((s) => +s);
  return [
    `${x - 1},${y},${z}`,
    `${x + 1},${y},${z}`,
    `${x},${y - 1},${z}`,
    `${x},${y + 1},${z}`,
    `${x},${y},${z - 1}`,
    `${x},${y},${z + 1}`,
  ];
}

function getReachableAir(lavaBlob: LavaBlob): Set<string> {
  const reachableAir: Set<string> = new Set();
  const stack: string[] = [
    ...[...Array(lavaBlob.maxX - lavaBlob.minX + 1).keys()].flatMap((xOffs) =>
      [...Array(lavaBlob.maxY - lavaBlob.minY + 1).keys()].map(
        (yOffs) =>
          `${lavaBlob.minX + xOffs},${lavaBlob.minY + yOffs},${lavaBlob.minZ}`
      )
    ),
    ...[...Array(lavaBlob.maxX - lavaBlob.minX + 1).keys()].flatMap((xOffs) =>
      [...Array(lavaBlob.maxY - lavaBlob.minY + 1).keys()].map(
        (yOffs) =>
          `${lavaBlob.minX + xOffs},${lavaBlob.minY + yOffs},${lavaBlob.maxZ}`
      )
    ),
    ...[...Array(lavaBlob.maxX - lavaBlob.minX + 1).keys()].flatMap((xOffs) =>
      [...Array(lavaBlob.maxZ - lavaBlob.minZ + 1).keys()].map(
        (zOffs) =>
          `${lavaBlob.minX + xOffs},${lavaBlob.minY},${lavaBlob.minZ + zOffs}`
      )
    ),
    ...[...Array(lavaBlob.maxX - lavaBlob.minX + 1).keys()].flatMap((xOffs) =>
      [...Array(lavaBlob.maxZ - lavaBlob.minZ + 1).keys()].map(
        (zOffs) =>
          `${lavaBlob.minX + xOffs},${lavaBlob.maxY},${lavaBlob.minZ + zOffs}`
      )
    ),
    ...[...Array(lavaBlob.maxY - lavaBlob.minY + 1).keys()].flatMap((yOffs) =>
      [...Array(lavaBlob.maxZ - lavaBlob.minZ + 1).keys()].map(
        (zOffs) =>
          `${lavaBlob.minX},${lavaBlob.minY + yOffs},${lavaBlob.minZ + zOffs}`
      )
    ),
    ...[...Array(lavaBlob.maxY - lavaBlob.minY + 1).keys()].flatMap((yOffs) =>
      [...Array(lavaBlob.maxZ - lavaBlob.minZ + 1).keys()].map(
        (zOffs) =>
          `${lavaBlob.maxX},${lavaBlob.minY + yOffs},${lavaBlob.minZ + zOffs}`
      )
    ),
  ];

  let pos;
  while ((pos = stack.pop())) {
    if (
      !lavaBlob.outsideBoundary(pos) &&
      !lavaBlob.cubesSet.has(pos) &&
      !reachableAir.has(pos)
    ) {
      reachableAir.add(pos);
      stack.push(...neighbours(pos));
    }
  }

  return reachableAir;
}

function answerPartOne(lavaBlob: LavaBlob): number {
  return lavaBlob.cubes
    .flatMap((cube) => neighbours(cube))
    .filter((cubeNeighbour) => !lavaBlob.cubesSet.has(cubeNeighbour)).length;
}

function answerPartTwo(lavaBlob: LavaBlob): number {
  const reachableAir = getReachableAir(lavaBlob);

  const answer = lavaBlob.cubes
    .flatMap((cube) => neighbours(cube))
    .filter((cubeNeighbour) => !lavaBlob.cubesSet.has(cubeNeighbour))
    .filter(
      (cubeNeighbour) =>
        lavaBlob.outsideBoundary(cubeNeighbour) ||
        reachableAir.has(cubeNeighbour)
    ).length;

  return answer;
}

// solve

const _ = (() => {
  const data: string[] = fs
    .readFileSync("inputs/day18.txt", "utf8")
    .split("\n");
  const lavaBlob = new LavaBlob(data);

  debug(lavaBlob);
  console.log(`Answer part 1: ${answerPartOne(lavaBlob)}`);
  console.log(`Answer part 2: ${answerPartTwo(lavaBlob)}`);
})();
