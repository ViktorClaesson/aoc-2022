import fs from "fs";
import { equals } from "./utils/common";
import { id1 } from "./utils/debug";

// data structures && init functions

type Packet = (Packet | number)[];

// solution methods

function checkPacketsRec(
  packet1: Packet,
  packet2: Packet
): boolean | undefined {
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
        return checkPacketsRec(packet1.slice(1), packet2.slice(1));
      } else {
        return packet1Value < packet2Value;
      }
    }

    return checkPacketsRec([packet1Value], packet2Value);
  }

  if (typeof packet2Value === "number") {
    return checkPacketsRec(packet1Value, [packet2Value]);
  }

  const answer = checkPacketsRec(packet1Value, packet2Value);
  return answer === undefined
    ? checkPacketsRec(packet1.slice(1), packet2.slice(1))
    : answer;
}

function checkPackets(packet1: Packet, packet2: Packet): boolean {
  let answer;
  while ((answer = checkPacketsRec(packet1, packet2)) === undefined) {
    packet1 = packet1.slice(1);
    packet2 = packet2.slice(1);
    if (packet1.length === 0 && packet2.length === 0) {
      return true;
    }
  }
  return answer;
}

function answerPartOne(packetPairs: [Packet, Packet][]): number {
  return packetPairs
    .map((packets, index) => (checkPackets(...packets) ? index + 1 : 0)) // right order => index + 1, wrong order => 0
    .reduce((acc, val) => acc + val, 0); // reduce by addition
}

function answerPartTwo(packets: Packet[]): number {
  return [[[2]], [[6]], ...packets]
    .sort((packet1, packet2) => -2 * +checkPackets(packet1, packet2) + 1) // wrong order (true) => -1, right order (false) => 1
    .map((packet, index) =>
      equals(packet, [[2]]) || equals(packet, [[6]]) ? index + 1 : 1
    ) // divider packet => index + 1, otherwise => 1
    .reduce((acc, val) => acc * val, 1); // reduce by multiplication
}

// solve

const data: string = fs.readFileSync("inputs/day13.txt", "utf8");
const packetPairs: [Packet, Packet][] = data
  .split("\n\n")
  .map((pair) => pair.split("\n"))
  .map(([packet1, packet2]) => [eval(packet1), eval(packet2)]);
const packets: Packet[] = data
  .split("\n")
  .filter((line) => line.length > 0)
  .map((line) => eval(line));

console.log(`Answer part 1: ${answerPartOne(packetPairs)}`);
console.log(`Answer part 2: ${answerPartTwo(packets)}`);
