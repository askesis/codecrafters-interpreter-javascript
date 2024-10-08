import fs from "fs";

import Scanner from './Scanner.js';

class Lox {
  static hadError = false;

  constructor(command, filename) {
    this.filename = filename;

    if (!command && ! filename) {
      console.error("Usage: ./your_program.sh tokenize <filename>");
      process.exit(1);
    }

    if (command !== "tokenize") {
      console.error(`Usage: Unknown command: ${command}`);
      process.exit(1);
    }
  }

  main() {
    this.runFile();
  }

  runFile() {
    const fileContent = fs.readFileSync(this.filename, "utf8");

    this.run(fileContent);

    if (Lox.hadError) process.exit(65);
  }

  run(source) {
    const scanner = new Scanner(source);

    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token.toString());
    }
  }

  static error(line, message) {
    Lox.report(line, "", message);
  }

  static report(line, where, message) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    Lox.hadError = true;
  }
}

export default Lox;