function indexArray(size: number) {
  return [...Array(size).keys()];
}

function chunkify<T>(arr: T[], chunkSize: number, chunkAmount: number): T[][] {
  return indexArray(chunkAmount).map((index) =>
    arr.slice(index * chunkSize, (index + 1) * chunkSize)
  );
}

export function chunksBySize<T>(arr: T[], chunkSize: number): T[][] {
  return chunkify(arr, chunkSize, Math.ceil(arr.length / chunkSize));
}

export function chunksByAmount<T>(arr: T[], chunkAmount: number): T[][] {
  return chunkify(arr, Math.ceil(arr.length / chunkAmount), chunkAmount);
}

export function rollingChunks<T>(arr: T[], chunkSize: number): T[][] {
  return indexArray(arr.length - chunkSize + 1).map((index) =>
    arr.slice(index, index + chunkSize)
  );
}
