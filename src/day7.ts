import fs from "fs";

// data structures

class Folder {
  name: string;
  parent: Folder;
  files: File[] = [];
  folders: Folder[] = [];

  constructor(name: string, parent: Folder | null = null) {
    this.name = name;
    if (parent !== null) {
      this.parent = parent;
    } else {
      this.parent = this;
    }
  }

  size(): number {
    return (
      this.files.reduce((acc, file) => acc + file.size, 0) +
      this.folders.reduce((acc, folder) => acc + folder.size(), 0)
    );
  }

  allFolders(): Folder[] {
    return [this, ...this.folders.flatMap((folder) => folder.allFolders())];
  }

  addFile(name: string, size: number) {
    this.files.push(new File(name, size));
  }

  addFolder(name: string) {
    this.folders.push(new Folder(name, this));
  }

  findFolder(name: string): Folder {
    const subFolder = this.folders.find((folder) => folder.name === name);
    if (subFolder === undefined) {
      throw `folder ${this.name} doesn't have a sub-folder ${name}`;
    }
    return subFolder;
  }
}

class File {
  name: string;
  size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

// methods

function initFileSystem(data: string[][]): Folder {
  const rootFolder: Folder = new Folder("/");

  let currentFolder: Folder = rootFolder;
  for (const instruction of data) {
    if (instruction[0] === "$" && instruction[1] === "cd") {
      if (instruction[2] === "/") {
        currentFolder = rootFolder;
      } else if (instruction[2] === "..") {
        currentFolder = currentFolder.parent;
      } else {
        currentFolder = currentFolder.findFolder(instruction[2]);
      }
    } else if (instruction[0] === "dir") {
      currentFolder.addFolder(instruction[1]);
    } else if (!isNaN(+instruction[0])) {
      currentFolder.addFile(instruction[1], +instruction[0]);
    }
  }

  return rootFolder;
}

function answer_1(rootFolder: Folder): number {
  return rootFolder
    .allFolders()
    .filter((folder) => folder.size() <= 100000)
    .reduce((acc, folder) => acc + folder.size(), 0);
}

function answer_2(rootFolder: Folder): number {
  const spaceNeeded = 30000000 - (70000000 - rootFolder.size());
  return rootFolder
    .allFolders()
    .filter((folder) => folder.size() >= spaceNeeded)
    .reduce((acc, folder) => Math.min(acc, folder.size()), Infinity);
}

// solve

const data: string[][] = fs
  .readFileSync("inputs/day7.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" "));

const rootFolder = initFileSystem(data);

console.log(`answer 1: ${answer_1(rootFolder)}`);
console.log(`answer 2: ${answer_2(rootFolder)}`);
