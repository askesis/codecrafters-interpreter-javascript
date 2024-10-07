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

function mapTypeToLexeme(type) {
  switch (type) {
    case 'LEFT_PAREN': return '(';
    case 'RIGHT_PAREN': return ')';
    case 'LEFT_BRACE': return '{';
    case 'RIGHT_BRACE': return '}';
    case 'COMMA': return ',';
    case 'DOT': return '.';
    case 'SEMICOLON': return ';';
    case 'PLUS': return '+';
    case 'MINUS': return '-';
    case 'STAR': return '*';

    case 'BANG': return '!';
    case 'BANG_EQUAL': return '!=';
    case 'EQUAL_EQUAL': return '==';
    case 'EQUAL': return '=';
    case 'LESS_EQUAL': return '<=';
    case 'LESS': return '<';
    case 'GREATER_EQUAL': return '>=';
    case 'GREATER': return '>';

    case 'SLASH': return '/';
  }
}

function printToken(type, literal) {
  const lexeme = mapTypeToLexeme(type);

  console.log(`${type} ${lexeme} ${literal}`);
}

function extractCommentLine(line) {

}

if (fileContent.length > 0) {
  const lines = fileContent.split('\n');

  for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex];

    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case '(': printToken('LEFT_PAREN', null); break;
        case ')': printToken('RIGHT_PAREN', null); break;
        case '{': printToken('LEFT_BRACE', null); break;
        case '}': printToken('RIGHT_BRACE', null); break;
        case ',': printToken('COMMA', null); break;
        case '.': printToken('DOT', null); break;
        case ';': printToken('SEMICOLON', null); break;
        case '+': printToken('PLUS', null); break;
        case '-': printToken('MINUS', null); break;
        case '*': printToken('STAR', null); break;

        case '!': {
          printToken(line[i+1] == '=' ? 'BANG_EQUAL': 'BANG', null );
          if (line[i+1] === '=') i++;
          break;
        }
        case '=': {
          printToken(line[i+1] == '=' ? 'EQUAL_EQUAL': 'EQUAL', null );
          if (line[i+1] === '=') i++;
          break;
        }
        case '<': {
          printToken(line[i+1] == '=' ? 'LESS_EQUAL': 'LESS', null );
          if (line[i+1] === '=') i++;
          break;
        }
        case '>': {
          printToken(line[i+1] == '=' ? 'GREATER_EQUAL': 'GREATER', null );
          if (line[i+1] === '=') i++;
          break;
        }
        case '/': {
          if (line[i+1] == '/') { // comments detected, don't add any token
            i = line.length;
          } else {
            printToken('SLASH', null );
          }
          break;
        }

        default: {
          isUnexpectedCharacterSeen = true;
          console.error(`[line ${rowIndex + 1}] Error: Unexpected character: ${line[i]}`);
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
