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




Exemplos para testar o programa:

Exemplo 1: Aritmética com precedência

int resultado;
function main() {
  resultado = 2 + 3 * 4;
  return resultado;
}

Exemplo 2: Lógica com && e ||

int a;
int b;
int resultado;
function main() {
  a = 4;
  b = 6;
  if (a > 2 && b < 10 || a == 0) {
    resultado = 1;
  }
  end-if
  return resultado;
}

Exemplo 3: Uso de ! (NOT)

int x;
int resultado;
function main() {
  x = 0;
  if (!x) {
    resultado = 10;
  }
  end-if
  return resultado;
}

Exemplo 4: Agrupamento com parênteses para mudar precedência

int a;
int b;
int resultado;
function main() {
  a = 1;
  b = 2;
  if (a == 0 || (b > 1 && a < 2)) {
    resultado = 123;
  }
  end-if
  return resultado;
}

Exemplo 5: Combinação de tudo + operação aritmética no if

int a;
int b;
int resultado;
function main() {
  a = 3;
  b = 5;
  if ((a + b) > 7 && !(a == 0)) {
    resultado = 999;
  }
  end-if
  return resultado;
}

Exemplo 6 — while simples com if

int i;
int total;

function main() {
  i = 0;
  total = 0;

  while (i < 5) {
    if (i % 2 == 0) {
      total = total + i;
    }
    end-if
    i = i + 1;
  }
  end-while

  return total;
}

Exemplo 7 — while com if-else e AND

int i;
int acumulador;

function main() {
  i = 1;
  acumulador = 0;

  while (i <= 5) {
    if (i > 2 && i < 5) {
      acumulador = acumulador + i;
    } else {
      acumulador = acumulador - 1;
    }
    end-if
    i = i + 1;
  }
  end-while

  return acumulador;
}

Exemplo 8 — while com NOT

int ligado;
int tentativas;

function main() {
  ligado = 0;
  tentativas = 0;

  while (!ligado) {
    tentativas = tentativas + 1;
    if (tentativas > 3) {
      ligado = 1;
    }
    end-if
  }
  end-while

  return tentativas;
}

Exemplo 9 — while com OR e controle de loop

int a;
int b;
int resultado;

function main() {
  a = 0;
  b = 5;
  resultado = 0;

  while (a < 5 || b > 0) {
    resultado = resultado + 1;
    a = a + 1;
    b = b - 1;
  }
  end-while

  return resultado;
}

Exemplo 10 — while com if aninhado

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
