#! /usr/bin/env node

const { changeExtensionRecursively } = require("../lib/utils");

function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 3) {
    process.exit(1);
  }

  const [dir, extension, newExtension] = argv;

  if ([dir, extension, newExtension].some((x) => x === undefined)) {
    process.exit(1);
  }

  changeExtensionRecursively(dir, extension, newExtension);
}

main();
