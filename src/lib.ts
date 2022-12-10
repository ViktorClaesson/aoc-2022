export function chunkify<T>(arr: T[], chunkSize: number): T[][] {
  return [...Array(Math.ceil(arr.length / chunkSize)).keys()].map((i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
}
