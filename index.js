import { tokenize } from './regex.js';
import { SaM } from './sam.js';

import { parse } from './parser.js';

const code = `
int x;
function main() {
  x = 2 + 3 * (4 + 1);
  return x;
}
`;

const tokens = tokenize(code);
const ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));



/*
const programa = [
 // Função main
  "ADDSP 1",              // reserva espaço para variável local (offset 0)
  "PUSHIMM 2",            // valor a ser passado para a função
  "STOREOFF 0",           // salva na variável local (x = 2)
  
  "PUSHIMM 0",            // espaço na pilha para retorno da função (offset -2)
  "PUSHOFF 0",            // empilha parâmetro da função (x)

  "LINK",                 // cria novo frame e salva FBR atual
  "JSR funcao",           // salta para a função
  "POPFBR",               // restaura FBR

  "ADDSP -1",             // remove parâmetro da função da pilha

  "STOREOFF 0",           // armazena valor de retorno da função em x

  "PUSHOFF 0",            // empilha x (valor de retorno)
  "PRINT",                // imprime resultado

  "ADDSP -1",             // desaloca variável local
  "STOP",

  // Definição da função
  "funcao:",
  "PUSHOFF -1",           // pega parâmetro da função (offset -1)
  "PUSHIMM 1",
  "ADD",
  "STOREOFF -2",          // salva valor de retorno no offset -2
  "JUMPIND"               // retorna para endereço de retorno empilhado por JSR
];

const vm = new SaM(programa);
vm.run();
*/