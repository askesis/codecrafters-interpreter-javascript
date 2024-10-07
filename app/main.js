import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

const command = args[0];
const filename = args[1];

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}


const fileContent = fs.readFileSync(filename, "utf8");

let isUnexpectedCharacterSeen = false;

if (fileContent.length > 0) {
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const c of line) {
      switch (c) {
        case '(': console.log('LEFT_PAREN ( null'); break;
        case ')': console.log('RIGHT_PAREN ) null'); break;
        case '{': console.log('LEFT_BRACE { null'); break;
        case '}': console.log('RIGHT_BRACE } null'); break;
        case ',': console.log('COMMA , null'); break;
        case '.': console.log('DOT . null'); break;
        case ';': console.log('SEMICOLON ; null'); break;
        case '+': console.log('PLUS + null'); break;
        case '-': console.log('MINUS - null'); break;
        case '*': console.log('STAR * null'); break;

        default: {
          isUnexpectedCharacterSeen = true;
          console.error(`[line ${i + 1}] Error: Unexpected character: ${c}`);
          break;
        }
      }
    }
  }
}

console.log("EOF  null");

if (isUnexpectedCharacterSeen == true) {
  process.exit(65);
}
