import { tokenize } from './regex.js';
import { SaM } from './sam.js';
import { parse } from './parser.js';

const code = `
int a;
int b;
int c;
int resultado;

function main() {
  a = 5;
  b = 3;
  c = 1;

  if (a > 2 && b < 5 || !c) {
    resultado = 100;
  }
  end-if

  return resultado;
}
`;

const tokens = tokenize(code);
const ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));
