import fs from "fs";
import { chunkify } from "./lib";

// read input

const data: string[] = fs.readFileSync("inputs/day3.txt", "utf8").split("\n");

// part 1

function findCommonLetter_1([compartment_1, compartment_2]: string[]) {
  for (let letter_1 of compartment_1) {
    for (let letter_2 of compartment_2) {
      if (letter_1 === letter_2) {
        return letter_1;
      }
    }
  }
  throw `couldn't find same letter: ${compartment_1} and ${compartment_2}`;
}

function scoreLetter(letter: string) {
  if (letter >= "a" && letter <= "z") {
    return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
  } else if (letter >= "A" && letter <= "Z") {
    return letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
  }

  throw `couldn't find letter score for: ${letter}`;
}

const answer_1: number = data
  .map((line) => [
    line.slice(0, line.length / 2),
    line.slice(line.length / 2, line.length),
  ])
  .map(findCommonLetter_1)
  .map(scoreLetter)
  .reduce((acc, val) => acc + val, 0);
console.log(answer_1);

// part 2

function findCommonLetter_2([bag_1, bag_2, bag_3]: string[]) {
  for (let letter_1 of bag_1) {
    for (let letter_2 of bag_2) {
      for (let letter_3 of bag_3) {
        if (letter_1 === letter_2 && letter_2 === letter_3) {
          return letter_1;
        }
      }
    }
  }
  throw `couldn't find same letter: ${bag_1} and ${bag_2} and ${bag_3}`;
}

const answer_2: number = chunkify(data, 3)
  .map(findCommonLetter_2)
  .map(scoreLetter)
  .reduce((acc, val) => acc + val, 0);
console.log(answer_2);
