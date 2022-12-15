export function toString(item: any): string {
  if (item && item.constructor === Array) {
    return `[${item.map((subItem) => toString(subItem)).join(", ")}]`;
  }
  return `${item}`;
}

export function id1<T>(t: T): T {
  console.log(`${toString(t)}`);
  return t;
}

export function idN<T>(t: T[]): T[] {
  console.log(...t.map(toString));
  return t;
}
