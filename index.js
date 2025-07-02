import { tokenize } from './regex.js';
import { parse } from './parse.js';

const code = `
function main() {
  int x;
  x = 2 + 3;
  return x;
}
`;

const tokens = tokenize(code);
const ast = parse(tokens);

console.log("\n\n Analisador lexico: \n\n");
console.log(tokenize(code));

console.log("\n\n Analisador sintatico: \n\n");
console.log(JSON.stringify(ast, null, 2));
