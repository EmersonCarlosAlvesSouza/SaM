# sam-js

Exemplos do SAM para testar:

1 -

  "ADDSP 2",          // reserva espaço para 2 variáveis (offsets 0 e 1)
  "PUSHIMM 5",        // empilha 5
  "STOREOFF 0",       // x = 5

  "PUSHOFF 0",        // empilha x
  "PUSHIMM 6",        // empilha 6
  "ADD",              // soma x + 6 = 11
  "STOREOFF 1",       // y = x + 6

  "PUSHOFF 1",        // empilha y (11)
  "PRINT",            // imprime y

  "ADDSP -2",         // desaloca variáveis
  "STOP"              // fim do programa


2 -

 "ADDSP 3",
  "PUSHIMM 5",
  "STOREOFF 0",
  "PUSHIMM 3",
  "STOREOFF 1",
  "PUSHOFF 0",
  "PUSHOFF 1",
  "GREATER",
  "JUMPC label_if",
  "PUSHOFF 1",
  "STOREOFF 2",
  "JUMP label_endif",
  "label_if:",
  "PUSHOFF 0",
  "STOREOFF 2",
  "label_endif:",
  "PUSHOFF 2",
  "PRINT",
  "ADDSP -3",
  "HALT"

const vm = new SaM(programa);
vm.run();

3 - 
  "ADDSP 3",           // reserva espaço para x, y, z
  "PUSHIMM 5",
  "STOREOFF 0",        // x = 5
  "PUSHIMM 3",
  "STOREOFF 1",        // y = 3

  "label_while:",

  "PUSHOFF 0",         // x
  "PUSHOFF 1",         // y
  "GREATER",           // x > y
  "ISNIL",             // !(x > y) → condição de parada
  "JUMPC label_endwhile", // se !(x > y), sair do loop

  "PUSHOFF 0",         // x
  "PUSHOFF 1",         // y
  "ADD",               // x + y
  "STOREOFF 2",        // z = x + y

  "PUSHOFF 1",         // y
  "PUSHIMM 1",
  "ADD",               // y = y + 1
  "STOREOFF 1",        // atualiza y

  "JUMP label_while",

  "label_endwhile:",
  "PUSHOFF 2",         // empilha z
  "PRINT",             // imprime z
  "ADDSP -3",          // desaloca variáveis
  "STOP"


4 - 
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