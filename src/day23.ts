import fs from "fs";

// solution methods

function neighbours4(pos: string): string[] {
  const [x, y] = pos.split(",").map((v) => +v);

  // N, E, S, W
  return [`${x},${y - 1}`, `${x + 1},${y}`, `${x},${y + 1}`, `${x - 1},${y}`];
}

function neighbours8(pos: string): string[] {
  const [x, y] = pos.split(",").map((v) => +v);

  // N => slice(0, 3)
  // E => slice(2, 5)
  // S => slice(4, 7)
  // W => slice(6, 8) + slice(0, 1)
  return [
    `${x - 1},${y - 1}`, // NW
    `${x},${y - 1}`, // N
    `${x + 1},${y - 1}`, // NE
    `${x + 1},${y}`, // E
    `${x + 1},${y + 1}`, // SE
    `${x},${y + 1}`, // S
    `${x - 1},${y + 1}`, // SW
    `${x - 1},${y}`, // W
  ];
}

function newPos(elves: Set<string>, pos: string, iteration: number): string {
  const n8 = neighbours8(pos);
  if (!n8.some((n) => elves.has(n))) {
    return pos;
  }

  const n4 = neighbours4(pos);
  const answers = [n4[0], n4[2], n4[3], n4[1]];
  const sliceIndex = [0, 4, 6, 2];
  for (let i = 0; i < 4; i++) {
    const idx = (i + iteration) % 4;
    if (
      [
        n8[sliceIndex[idx]],
        n8[sliceIndex[idx] + 1],
        n8[(sliceIndex[idx] + 2) % 8],
      ].every((n) => !elves.has(n))
    ) {
      return answers[idx];
    }
  }

  return pos;
}

function rectangle(elves: Set<string>): string[][] {
  const xs: number[] = [...elves].map((pos) => +pos.split(",")[0]);
  const minX: number = Math.min(...xs); // - 2;
  const maxX: number = Math.max(...xs); // + 3;
  const ys: number[] = [...elves].map((pos) => +pos.split(",")[1]);
  const minY: number = Math.min(...ys); // - 1;
  const maxY: number = Math.max(...ys); // + 2;
  return [...Array(maxY - minY + 1).keys()].map((y) =>
    [...Array(maxX - minX + 1).keys()].map((x) =>
      elves.has(`${x + minX},${y + minY}`) ? "#" : "."
    )
  );
}

function debug(title: string, elves: Set<string>) {
  console.log(title);
  console.log(
    rectangle(elves)
      .map((row) => row.join(" "))
      .join("\n")
  );
  console.log();
}

function answerPartOne(elves: Set<string>): number {
  // debug("Initial:", elves);

  for (let i = 0; i < 10; i++) {
    const newElves: Map<string, string> = new Map(
      [...elves.values()].map((elf) => [elf, newPos(elves, elf, i)])
    );

    const newElvesMinusCollisions: Map<string, string> = new Map(
      [...newElves].map(([elf, newElf]) => [
        elf,
        neighbours4(newElf).some(
          (suspect) => suspect !== elf && newElves.get(suspect) === newElf
        )
          ? elf
          : newElf,
      ])
    );

    elves = new Set(newElvesMinusCollisions.values());
    // debug(`Iteration ${i + 1}:`, elves);
  }

  return rectangle(elves)
    .map((row) => row.reduce((acc, val) => acc + (val === "." ? 1 : 0), 0))
    .reduce((acc, val) => acc + val, 0);
}

function answerPartTwo(elves: Set<string>): number {
  for (let i = 0; true; i++) {
    const newElves: Map<string, string> = new Map(
      [...elves.values()].map((elf) => [elf, newPos(elves, elf, i)])
    );

    const newElvesMinusCollisions: Map<string, string> = new Map(
      [...newElves].map(([elf, newElf]) => [
        elf,
        neighbours4(newElf).some(
          (suspect) => suspect !== elf && newElves.get(suspect) === newElf
        )
          ? elf
          : newElf,
      ])
    );

    if ([...newElvesMinusCollisions].every(([elf, newElf]) => elf === newElf)) {
      return i + 1;
    }

    elves = new Set(newElvesMinusCollisions.values());
  }
}

// solve

const _ = (() => {
  const data: Set<string> = new Set(
    fs
      .readFileSync("inputs/day23.txt", "utf8")
      .split("\n")
      .flatMap((line, row) =>
        line.split("").map((cell, col) => (cell === "#" ? `${col},${row}` : ""))
      )
      .filter((v) => v !== "")
  );

  console.log(`Answer part 1: ${answerPartOne(data)}`);
  console.log(`Answer part 2: ${answerPartTwo(data)}`);
})();
