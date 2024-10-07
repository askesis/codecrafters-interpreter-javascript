import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

const filename = args[1];

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  for (const c of fileContent) {
    switch (c) {
      case '(': console.log('LEFT_PAREN ( null'); break;
      case ')': console.log('RIGHT_PAREN ) null'); break;
      case '{': console.log('LEFT_BRACE { null'); break;
      case '}': console.log('RIGHT_BRACE } null'); break;
    
      default:
        break;
    }
  }
}

console.log("EOF  null");
