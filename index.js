import { tokenize } from './regex.js';
import { parse } from './parser.js';
import { generateCode } from './codegen.js';
import { SaM } from './sam.js';
import { buildSymbolTable } from './symbolTable.js';

const codeFonte = `
function main() {
  int x;
  x = 5;
  while (x > 0) {
    x = x - 10;
  }
  return x;
}
`;

// const codeFonte = `
// function main() {
//   int ligado;
//   int tentativas;
//   ligado = 0;
//   tentativas = 0;

//   while (!ligado) {
//     tentativas = tentativas + 1;
//     if (tentativas > 3) {
//       ligado = 1;
//     }
//     end-if
//   }

//   return tentativas;
// }
// `;

const tokens = tokenize(codeFonte);
const ast = parse(tokens);
console.log("--- ARVORE SINTATICA ---");
console.log(JSON.stringify(ast, null, 2));
const instructions = generateCode(ast);

console.log("\n--- TABELA DE SÍMBOLOS ---");
const symbolTable = buildSymbolTable(ast);
console.table(symbolTable);

console.log('\n\n--- INSTRUÇÕES SAM ---');
console.log(instructions.join('\n'));

console.log("\n\n--- EXECUÇÃO DA VM ---");
const vm = new SaM(instructions);
vm.run();

