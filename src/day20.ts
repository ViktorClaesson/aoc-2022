import fs from "fs";

// solution methods

function mix(data: number[], times: number): number[] {
  let tempArray: [number, number][] = data.slice().map((v, i) => [v, i]);

  for (let ci = 0; ci < data.length * times; ci++) {
    let ti = tempArray.findIndex(
      ([_, oi]) => oi === ci % tempArray.length
    ) as number;
    let v = tempArray[ti][0] % (tempArray.length - 1);

    while (v > 0) {
      const temp = tempArray[ti];
      tempArray[ti] = tempArray[(ti + 1) % tempArray.length];
      tempArray[(ti + 1) % tempArray.length] = temp;
      ti = (ti + 1) % tempArray.length;
      v -= 1;
    }
    while (v < 0) {
      const temp = tempArray[ti];
      tempArray[ti] = tempArray[(ti - 1 + tempArray.length) % tempArray.length];
      tempArray[(ti - 1 + tempArray.length) % tempArray.length] = temp;
      ti = (ti - 1 + tempArray.length) % tempArray.length;
      v += 1;
    }
  }
  return tempArray.map(([v, _]) => v);
}

function answerPartOne(data: number[]): number {
  const mixed = mix(data, 1);
  const zeroIndex = mixed.findIndex((v) => v === 0);

  return (
    mixed[(zeroIndex + 1000) % mixed.length] +
    mixed[(zeroIndex + 2000) % mixed.length] +
    mixed[(zeroIndex + 3000) % mixed.length]
  );
}

function answerPartTwo(data: number[]): number {
  const mixed = mix(
    data.map((v) => v * 811589153),
    10
  );
  const zeroIndex = mixed.findIndex((v) => v === 0);

  return (
    mixed[(zeroIndex + 1000) % mixed.length] +
    mixed[(zeroIndex + 2000) % mixed.length] +
    mixed[(zeroIndex + 3000) % mixed.length]
  );
}

// solve

const _ = (() => {
  const data: number[] = fs
    .readFileSync("inputs/day20.txt", "utf8")
    .split("\n")
    .map((s) => +s);

  console.log(`Answer part 1: ${answerPartOne(data)}`);
  console.log(`Answer part 2: ${answerPartTwo(data)}`);
})();
