# 📘 Gramática LL(1) - Projeto de Compiladores

Este documento descreve a gramática formal utilizada no projeto do compilador em JavaScript. A gramática define a estrutura da linguagem fonte, baseada em expressões aritméticas, declarações e uma função principal (`main`). O parser correspondente foi implementado utilizando análise preditiva recursiva LL(1).

---

## 🧠 Estrutura Geral

```
Programa       → Declaracoes FuncaoPrincipal
Declaracoes    → (Declaracao)*
Declaracao     → Tipo Identificador ;
Tipo           → int | double | string
FuncaoPrincipal→ function main ( ) { Comandos }
Comandos       → (Comando)*
Comando → Atribuicao ; | return Expressao ; | if ( Expressao ) { Comandos } (else { Comandos })? | while ( Expressao ) { Comandos }
Atribuicao     → Identificador = Expressao
```

---

## 🧮 Expressões Aritméticas

As expressões aritméticas respeitam precedência de operadores:
- `*` e `/` têm maior precedência
- `+` e `-` vêm depois

```
Expressao      → Termo Expressao'
Expressao'     → + Termo Expressao' | - Termo Expressao' | ε
Termo          → Fator Termo'
Termo'         → * Fator Termo' | / Fator Termo' | ε
Fator          → ( Expressao ) | Numero | Identificador
```

---

## 📌 Elementos Léxicos

Esses são definidos no analisador léxico (`regex.js`):

- **Identificadores**: letras seguidas de letras/números/underscore (`[a-zA-Z_][a-zA-Z0-9_]*`)
- **Números inteiros**: `\d+`
- **Números de ponto flutuante**: `\d+\.\d+`
- **Strings**: entre aspas simples ou duplas
- **Operadores**: `+`, `-`, `*`, `/`, `=`, `==`, etc.
- **Palavras-chave**: `int`, `double`, `string`, `function`, `return`, etc.

---

## ✅ Exemplo de Código Aceito

```js
int x;
function main() {
  x = 2 + 3 * (4 + 1);
  return x;
}
```

## 🌳 Saída Esperada (AST simplificada)

```json
{
  "type": "Programa",
  "declaracoes": [
    { "type": "Declaracao", "tipo": "TYPE_INT", "id": "x" }
  ],
  "main": {
    "type": "MainFunction",
    "comandos": [
      {
        "type": "Atribuicao",
        "id": "x",
        "expr": {
          "type": "BinOp",
          "op": "PLUS",
          "left": { "type": "Literal", "value": "2" },
          "right": {
            "type": "BinOp",
            "op": "MULTIPLY",
            "left": { "type": "Literal", "value": "3" },
            "right": {
              "type": "BinOp",
              "op": "PLUS",
              "left": { "type": "Literal", "value": "4" },
              "right": { "type": "Literal", "value": "1" }
            }
          }
        }
      },
      {
        "type": "Return",
        "expr": { "type": "Var", "name": "x" }
      }
    ]
  }
}
```

---

## 📌 Observações Finais

- A gramática está escrita em um formato **LL(1)**, compatível com análise preditiva com 1 token de lookahead.
- Recursões à esquerda foram evitadas para garantir que o parser LL(1) funcione corretamente.
- A implementação do parser e do analisador léxico em JavaScript está baseada nesta gramática.

---

(Verificando se esta ll1)

O parse esta: 

Analisa um token por vez (lookahead = 1)
Decide o que fazer com base apenas nesse token
Usa chamadas recursivas (por funções como parseExpressao, parseTermo, etc)
Não precisa voltar (backtracking)