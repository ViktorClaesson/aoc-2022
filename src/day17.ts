import fs from "fs";
import { id1 } from "./utils/debug";

// solution methods

function debug(
  message: string,
  map: string[],
  rock: string[][] | undefined = undefined,
  x: number | undefined = undefined,
  y: number | undefined = undefined
) {
  map = map.slice();
  if (rock && x !== undefined && y !== undefined) {
    rock.forEach((line, ry) => {
      const paddedLine = [
        ...Array(x).fill("."),
        ...line,
        ...Array(Math.max(0, 7 - x - line.length)).fill("."),
      ];
      map[y + ry] = paddedLine
        .map((lv, lx) => (lv === "#" ? "@" : map[y + ry][lx]))
        .join("");
    });
  }

  console.log(message);
  map.map((line) => line.split("").join(" ")).forEach(id1);
  console.log("");
}

function answerPartOne(rocks: string[][][], jetStream: string[]): number {
  let jetStreamIndex = 0;
  let map: string[] = [];
  for (let i = 0; i < 2022; i++) {
    let x = 2;
    let y = 0;
    const rock: string[][] = rocks[i % rocks.length];

    const firstNonEmpty = Math.max(
      map.findIndex((line) => line !== "......."),
      0
    );
    const linesToPadd = 3 + rock.length - firstNonEmpty;
    if (linesToPadd > 0) {
      map = [...Array(Math.max(0, linesToPadd)).fill("......."), ...map];
    } else if (linesToPadd < 0) {
      map = map.slice(-linesToPadd);
    }

    // debug("NEW ROCK;", map, rock, x, y);

    while (true) {
      // jet stream
      if (jetStream[jetStreamIndex] === "<") {
        if (x > 0) {
          if (
            rock.every((rl, ry) =>
              rl.every(
                (rv, rx) => rv === "." || map[y + ry][x + rx - 1] === "."
              )
            )
          ) {
            x -= 1;
          }
        }
        // debug("PUSH ROCK LEFT;", map, rock, x, y);
      } else if (jetStream[jetStreamIndex] === ">") {
        if (x + rock[0].length < map[y].length) {
          if (
            rock.every((rl, ry) =>
              rl.every(
                (rv, rx) => rv === "." || map[y + ry][x + rx + 1] === "."
              )
            )
          ) {
            x += 1;
          }
        }
        // debug("PUSH ROCK RIGHT;", map, rock, x, y);
      }
      jetStreamIndex = (jetStreamIndex + 1) % jetStream.length;

      // fall down
      if (
        y + rock.length < map.length &&
        rock.every((rl, ry) =>
          rl.every((rv, rx) => rv === "." || map[y + ry + 1][x + rx] === ".")
        )
      ) {
        y += 1;
        // debug("ROCK FALLS;", map, rock, x, y);
      } else {
        rock.forEach((line, ry) => {
          const paddedLine = [
            ...Array(x).fill("."),
            ...line,
            ...Array(Math.max(0, 7 - x - line.length)).fill("."),
          ];
          map[y + ry] = paddedLine
            .map((lv, lx) => (lv === "#" ? lv : map[y + ry][lx]))
            .join("");
        });
        // debug("ROCK RESTS;", map, undefined, x, y);
        break;
      }
    }
  }

  return map.filter((line) => line !== ".......").length;
}

function answerPartTwo(): number {
  return 42;
}

// solve

const data: string[] = fs.readFileSync("inputs/day17.txt", "utf8").split("");

const rocks: string[][][] = [
  [["#", "#", "#", "#"]],
  [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ],
  [
    [".", ".", "#"],
    [".", ".", "#"],
    ["#", "#", "#"],
  ],
  [["#"], ["#"], ["#"], ["#"]],
  [
    ["#", "#"],
    ["#", "#"],
  ],
];

console.log(`Answer part 1: ${answerPartOne(rocks, data)}`);
console.log(`Answer part 2: ${answerPartTwo()}`);
