const fs = require("fs");
const path = require("path");

const changeExtensionRecursively = (rootDir, oldExtension, newExtension) => {
  const contents = fs.readdirSync(rootDir);

  contents.forEach((content) => {
    const itemPath = path.join(rootDir, content);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      changeExtensionRecursively(itemPath, oldExtension, newExtension);
    } else {
      changeExtension(rootDir, content, oldExtension, newExtension);
    }
  });
};

const changeExtension = (folder, file, oldExtension, newExtension) => {
  const filePath = path.join(folder, file);

  if (path.extname(filePath) !== oldExtension) return;

  const newFilePath = path.join(
    folder,
    path.basename(file, oldExtension) + newExtension
  );

  try {
    fs.renameSync(filePath, newFilePath);
    console.log(`${filePath} -> ${newFilePath}`);
  } catch (e) {
    console.error(e);
  }
};

module.exports = { changeExtension, changeExtensionRecursively };
