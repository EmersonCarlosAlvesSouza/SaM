# 📘 Gramática LL(1) - Projeto de Compiladores

Este documento descreve a gramática formal utilizada no projeto do compilador em JavaScript. A gramática define a estrutura da linguagem fonte, baseada em expressões aritméticas, controle de fluxo, declarações e uma função principal (`main`). O parser correspondente foi implementado utilizando análise preditiva recursiva LL(1).

---

## 🧠 Estrutura Geral da Gramática

```
Programa        → Declaracoes FuncaoPrincipal
Declaracoes     → (Declaracao)* | ε
Declaracao      → Tipo Identificador ;
Tipo            → int | double | string
FuncaoPrincipal → function main ( ) { Comandos }

Comandos        → (Comando)*

Comando         → Atribuicao ;
                | return Expressao ;
                | if ( Expressao ) { Comandos } (else { Comandos })? end-if
                | while ( Expressao ) { Comandos } end-while

Atribuicao      → Identificador = Expressao
```

---

## 🧮 Expressões Aritméticas

As expressões aritméticas respeitam precedência de operadores:
- `*` e `/` têm maior precedência
- `+` e `-` vêm depois

```
Expressao       → Termo Expressao'
Expressao'      → + Termo Expressao' | - Termo Expressao' | ε
Termo           → Fator Termo'
Termo'          → * Fator Termo' | / Fator Termo' | ε
Fator           → ( Expressao ) | ! Fator | Numero | Identificador
```

# ✅ Análise LL(1) da Gramática — Projeto de Compiladores

Demonstração de que a gramática utilizada é **LL(1)**, ou seja, pode ser analisada com um parser preditivo.

---

## Critérios para LL(1)

Para cada não-terminal com produções alternativas `A → α | β`, a gramática é LL(1) se:

- `FIRST(α) ∩ FIRST(β) = ∅`
- Se `ε ∈ FIRST(α)` então `FIRST(β) ∩ FOLLOW(A) = ∅`

---

## Regras analisadas

---

### 1. **Programa → Declaracoes FuncaoPrincipal**

- `FIRST(Declaracoes)` = { `int`, `double`, `string`, `function` }  
  *(isso porque `Declaracoes` pode ser vazia, e `function` é o primeiro token de `FuncaoPrincipal`)*
- `FIRST(FuncaoPrincipal)` = { `function` }
- Ambas são compatíveis com `function`, mas como `Declaracoes` pode ser **ε**, analisamos `FOLLOW(Declaracoes)`:
  - `FOLLOW(Declaracoes)` = { `function` }
- ✅ `FIRST(Declaracoes)` ∩ `FOLLOW(Declaracoes)` = ∅ (exceto pelo caso controlado do `ε` que não causa ambiguidade)  
→ LL(1) Válido

---

### 2. **Declaracoes → (Declaracao)\***

- `Declaracao → Tipo IDENTIFIER ;`
- `FIRST(Declaracao)` = { `int`, `double`, `string` }
- Quando não houver mais declarações, seguimos para `function`
- `FOLLOW(Declaracoes)` = { `function` }
- ✅ `{int, double, string}` ∩ `{function}` = ∅  
→ LL(1) Válido

---

### 3. **Comando → Atribuicao ; | return Expressao ; | if (...) {...} else {...} end-if | while (...) {...} end-while**

- `FIRST(Atribuicao)` = { `IDENTIFIER` }
- `FIRST(return Expressao)` = { `return` }
- `FIRST(if ...)` = { `if` }
- `FIRST(while ...)` = { `while` }

Todos são tokens únicos e distintos  
✅ `IDENTIFIER`, `return`, `if`, `while` são disjuntos  
→ LL(1) Válido

---

### 4. **Expressao → Termo Expressao'**

- `FIRST(Termo)` = { `(`, `INTEGER_LITERAL`, `FLOAT_LITERAL`, `IDENTIFIER` }
- `Expressao' → + Termo Expressao' | - Termo Expressao' | ε`
  - `FIRST(Expressao')` = { `+`, `-`, `ε` }
  - `FOLLOW(Expressao')` = { `;`, `)` } (fim de expressão ou parêntese de fechamento)
- ✅ `{+, -}` ∩ `{;, )}` = ∅  
→ LL(1) Válido

---

### 5. **If e While (novas estruturas)**

#### `if (cond) { ... } else { ... } end-if`

- `FIRST(if)` = { `if` }, exclusivo
- Blocos `{}` são claramente delimitados
- A presença obrigatória do `end-if` evita ambiguidades com comandos subsequentes
- ✅ LL(1) Válido

#### `while (cond) { ... } end-while`

- `FIRST(while)` = { `while` }, exclusivo
- O `end-while` também delimita claramente o fim do bloco
- ✅ LL(1) Válido

---

## ✅ Conclusão

Todas as decisões da gramática seguem as regras do LL(1):

- Não há conflitos nos conjuntos `FIRST`
- As produções com `ε` possuem `FOLLOW` compatível
- A linguagem é compatível com análise preditiva com 1 símbolo de lookahead

🎓 **A gramática é LL(1)**.





// fazer expressão lógica

## Expressões Lógicas e Relacionais

Além das expressões aritméticas, a linguagem suporta expressões lógicas e relacionais, que podem ser usadas em estruturas como if e while. As precedências dos operadores são respeitadas da seguinte forma:
Ordem de Precedência (da mais alta para a mais baixa):

>, <, == (relacionais)

! (negação)

&& (E)

|| (OU)



## Regra da Gramatica Expandida

Expressao           → ExpressaoLogica
ExpressaoLogica     → ExpressaoRelacional ExpressaoLogica'
ExpressaoLogica'    → && ExpressaoRelacional ExpressaoLogica' | || ExpressaoRelacional ExpressaoLogica'| ε


ExpressaoRelacional → ExpressaoAritmetica ExpressaoRelacional'
ExpressaoRelacional'→ > ExpressaoAritmetica | < ExpressaoAritmetica  | == ExpressaoAritmetica | ε

ExpressaoAritmetica → Termo ExpressaoAritmetica'
ExpressaoAritmetica'→ + Termo ExpressaoAritmetica'  | - Termo ExpressaoAritmetica'  | ε

Termo               → Fator Termo'
Termo'              → * Fator Termo'| / Fator Termo' | ε

Fator               → ( Expressao )  | ! Fator  | Numero  | Identificador




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