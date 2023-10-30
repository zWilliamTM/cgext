const t = require("tap");
const fs = require("fs");
const path = require("path");
const { rimrafSync } = require("rimraf");
const { changeExtension, changeExtensionRecursively } = require("../lib/utils");

const testFolder = path.join(__dirname, "test_tmp");

t.beforeEach((t) => {
  fs.mkdirSync(testFolder, { recursive: true });
});

t.afterEach((t) => {
  rimrafSync(testFolder);
});

t.test("changeExtension", (t) => {
  const folderDir = testFolder;

  const filePath = path.join(folderDir, "test.txt");
  fs.writeFileSync(filePath, "hello world");
  t.ok(fs.existsSync(folderDir), "folder test exists");
  t.ok(fs.existsSync(filePath), "file exists");

  // transform file
  const fileName = path.basename(filePath);
  const oldExtension = ".txt";
  const newExtension = ".js";
  const newFilePath = path.join(folderDir, "test.js");

  changeExtension(folderDir, fileName, oldExtension, newExtension);

  t.ok(fs.existsSync(newFilePath), "file exists");
  t.end();
});

t.test("changeExtensionRecursively", (t) => {
  const folderDir = testFolder;

  const fixtures = {
    dir1: ["file1.txt", "file2.txt"],
    dir2: ["file3.txt", "file4.txt"],
    dir3: ["file5.txt", "file6.txt"],
    dir4: ["file7.txt", "file8.txt"],
  };

  buildFolderWithNested(fixtures, folderDir);

  changeExtensionRecursively(folderDir, ".txt", ".js");

  const files = returnFilepath(fixtures, folderDir);
  files.forEach((file) => {
    t.ok(fs.existsSync(file), "file exists");
  });
  t.end();
});

t.test("changeExtensionRecursively Extreme", (t) => {
  const folderDir = testFolder;

  const fixtures = {
    dir1: ["file1.txt", "file2.txt", { dir11: ["file11.txt", "file12.txt"] }],
    dir2: ["file3.txt", "file4.txt"],
    dir3: ["file5.txt", "file6.txt"],
    dir4: ["file7.txt", "file8.txt"],
  };

  buildFolderWithNested(fixtures, folderDir);

  changeExtensionRecursively(folderDir, ".txt", ".js");

  const files = returnFilepath(fixtures, folderDir);
  files.forEach((file) => {
    t.ok(fs.existsSync(file), "file exists");
  });

  t.end();
});

function returnFilepath(fixtures, root) {
  const filesUnflatten = Object.entries(fixtures).map(([dir, files]) => {
    return files.map((file) => {
      if (typeof file === "object") {
        const nameDir = Object.keys(file)[0];
        const files = Object.values(file)[0];

        return files.map((file) => {
          return path.join(
            root,
            dir,
            nameDir,
            path.basename(file, ".txt") + ".js"
          );
        });
      }

      return path.join(root, dir, path.basename(file, ".txt") + ".js");
    });
  });

  return filesUnflatten.flat(Infinity);
}

function buildFolderWithNested(fixtures, folderDir) {
  Object.entries(fixtures).forEach(([dir, files]) => {
    const dirPath = path.join(folderDir, dir);
    fs.mkdirSync(dirPath, { recursive: true });

    files.forEach((file) => {
      if (typeof file === "object") {
        const nameDir = Object.keys(file)[0];
        const files = Object.values(file)[0];

        fs.mkdirSync(path.join(dirPath, nameDir), { recursive: true });

        files.forEach((file) => {
          const filePath = path.join(dirPath, nameDir, file);
          fs.writeFileSync(filePath, "hello world");
        });
      } else {
        fs.writeFileSync(path.join(dirPath, file), "hello world");
      }
    });
  });
}
