import { tokenize } from './regex.js';
import { parse } from './parser.js';
import { buildSymbolTable } from './symbolTable.js';

const code = `
int x;
int y;
double teste;
function main() {
  int z;
  x = 5;
  y = x + 1;


  return y;
}
`;

const tokens = tokenize(code);
const ast = parse(tokens);
const symbolTable = buildSymbolTable(ast);

console.log("AST:");
console.log(JSON.stringify(ast, null, 2));

console.log("\nTabela de Símbolos:");
console.table(symbolTable);
