import { tokenize } from './regex.js';
import { SaM } from './sam.js';
import { parse } from './parser.js';

const code = `
int i;
int pares;
int impares;

function main() {
  i = 1;
  pares = 0;
  impares = 0;

  while (i <= 6) {
    if (i % 2 == 0) {
      pares = pares + 1;
    } else {
      if (i > 3) {
        impares = impares + 2;
      }
      end-if
    }
    end-if
    i = i + 1;
  }
  end-while

  return pares + impares;
}




`;

const tokens = tokenize(code);
const ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));
