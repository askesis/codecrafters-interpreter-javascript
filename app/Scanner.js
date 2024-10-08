import Lox from "./Lox.js";
import Token from "./Token.js";
import { EOF, LEFT_BRACE, LEFT_PAREN, RIGHT_BRACE, COMMA, DOT, MINUS, PLUS, SEMICOLON, STAR, SLASH, STRING, EQUAL_EQUAL, EQUAL, BANG, BANG_EQUAL, LESS_EQUAL, LESS, GREATER, GREATER_EQUAL, RIGHT_PAREN, NUMBER, IDENTIFIER, AND, CLASS, ELSE, FALSE, FOR, FUN, IF, NIL, OR, PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE } from "./TokenType.js";

class Scanner {
  tokens = [];
  start = 0;
  current = 0;
  line = 1;

  constructor(source) {
    this.source = source;
  }

  static keywords = {
    "and":    AND,
    "class":  CLASS,
    "else":   ELSE,
    "false":  FALSE,
    "for":    FOR,
    "fun":    FUN,
    "if":     IF,
    "nil":    NIL,
    "or":     OR,
    "print":  PRINT,
    "return": RETURN,
    "super":  SUPER,
    "this":   THIS,
    "true":   TRUE,
    "var":    VAR,
    "while":  WHILE,
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(EOF, "", null, this.line))

    return this.tokens;
  }

  scanToken() {
    const c = this.advance();

    switch (c) {
      case '(': this.addToken(LEFT_PAREN); break;
      case ')': this.addToken(RIGHT_PAREN); break;
      case '{': this.addToken(LEFT_BRACE); break;
      case '}': this.addToken(RIGHT_BRACE); break;
      case ',': this.addToken(COMMA); break;
      case '.': this.addToken(DOT); break;
      case '-': this.addToken(MINUS); break;
      case '+': this.addToken(PLUS); break;
      case ';': this.addToken(SEMICOLON); break;
      case '*': this.addToken(STAR); break;
      case '!':
        this.addToken(this.match('=') ? BANG_EQUAL : BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? EQUAL_EQUAL : EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? LESS_EQUAL : LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? GREATER_EQUAL : GREATER);
        break;
      case '/': {
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(SLASH);
        }
        break;
      }
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.line++;
        break;
      case '"': this.string(); break;

      default: {
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) { 
          this.identifier() 
        } else {
          Lox.error(this.line, `Unexpected character: ${c}`)
        }
      }
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.slice(this.start, this.current);
    let type = Scanner.keywords[text];

    if (type == undefined) type = IDENTIFIER

    this.addToken(type);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    const num = parseFloat(this.source.slice(this.start, this.current));

    this.addToken(NUMBER, Number.isInteger(num) ? num.toFixed(1) : num);
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.slice(this.start + 1, this.current - 1);
    this.addToken(STRING, value);
  }

  match(expected) {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.source.charAt(this.current) != expected) {
      return false;
    }

    this.current++;

    return true;
  }

  peek() {
    if (this.isAtEnd()) {
      return '\0';
    }

    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';

    return this.source.charAt(this.current + 1);
  } 

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') || 
      c == '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  addToken(type, literal = null) {
    const text = this.source.slice(this.start, this.current);

    this.tokens.push(new Token(type, text, literal, this.line));
  }
}

export default Scanner