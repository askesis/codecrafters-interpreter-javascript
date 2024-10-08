import Lox from './Lox.js';

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

const lox = new Lox(args[0], args[1]);

lox.main();
