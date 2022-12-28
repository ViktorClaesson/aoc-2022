import fs from "fs";

// solution methods

function mix(data: number[]): number[] {
  let tempArray: [number, number][] = data.slice().map((v, i) => [v, i]);
  // console.log(tempArray.map(([v, _]) => v).toString());

  for (let ci = 0; ci < data.length; ci++) {
    let ti = tempArray.findIndex(([_, oi]) => oi === ci) as number;
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

    // console.log(tempArray.map(([v, _]) => v).toString());
  }
  return tempArray.map(([v, _]) => v);
}

function answerPartOne(data: number[]): number {
  const mixed = mix(data);
  const zeroIndex = mixed.findIndex((v) => v === 0);

  return (
    mixed[(zeroIndex + 1000) % mixed.length] +
    mixed[(zeroIndex + 2000) % mixed.length] +
    mixed[(zeroIndex + 3000) % mixed.length]
  );
}

function answerPartTwo(): number {
  return 42;
}

// solve

const _ = (() => {
  const data: number[] = fs
    .readFileSync("inputs/day20.txt", "utf8")
    .split("\n")
    .map((s) => +s);

  console.log(`Answer part 1: ${answerPartOne(data)}`);
  console.log(`Answer part 2: ${answerPartTwo()}`);
})();
