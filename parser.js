// parser.js
// Recebe uma lista de tokens gerados por tokenize(inputCode)
// e constrói uma árvore sintática (AST) com base na gramática LL(1)

let tokens = [];
let current = 0;

function parse(tokensInput) {
  tokens = tokensInput;
  current = 0;
  return parsePrograma();
}

function match(type) {
  return tokens[current] && tokens[current].type === type;
}

function advance() {
  return tokens[current++];
}

function expect(type) {
  if (!match(type)) throw new Error(`Esperado token ${type}, encontrado ${tokens[current]?.type}`);
  return advance();
}

function parsePrograma() {
  const declaracoes = parseDeclaracoes();
  const main = parseFuncaoPrincipal();
  return { type: 'Programa', declaracoes, main };
}

function parseDeclaracoes() {
  const decls = [];
  while (match('TYPE_INT') || match('TYPE_DOUBLE') || match('TYPE_STRING')) {
    decls.push(parseDeclaracao());
  }
  return decls;
}

function parseDeclaracao() {
  const tipo = advance().type;
  const id = expect('IDENTIFIER').value;
  expect('SEMICOLON');
  return { type: 'Declaracao', tipo, id };
}

function parseFuncaoPrincipal() {
  expect('FUNCTION');
  expect('IDENTIFIER'); // "main"
  expect('LPAREN');
  expect('RPAREN');
  expect('LBRACE');
  const comandos = parseComandos();
  expect('RBRACE');
  return { type: 'MainFunction', comandos };
}

function parseComandos() {
  const comandos = [];
  while (!match('RBRACE')) {
    comandos.push(parseComando());
  }
  return comandos;
}

function parseComando() {
  if (match('RETURN')) {
    advance();
    const expr = parseExpressao();
    expect('SEMICOLON');
    return { type: 'Return', expr };
  }

  if (match('IF')) {
    advance();
    expect('LPAREN');
    const cond = parseExpressao();
    expect('RPAREN');
    expect('LBRACE');
    const thenBlock = parseComandos();
    expect('RBRACE');

    let elseBlock = null;
    if (match('ELSE')) {
      advance();
      expect('LBRACE');
      elseBlock = parseComandos();
      expect('RBRACE');
    }

    expect('END_IF');

    return { type: 'If', cond, thenBlock, elseBlock };
  }

  if (match('WHILE')) {
    advance();
    expect('LPAREN');
    const cond = parseExpressao();
    expect('RPAREN');
    expect('LBRACE');
    const body = parseComandos();
    expect('RBRACE');
    expect('END_WHILE');

    return { type: 'While', cond, body };
  }

  if (match('TYPE_INT') || match('TYPE_DOUBLE') || match('TYPE_STRING')) {
    return parseDeclaracao();
  }

  const cmd = parseAtribuicao();
  expect('SEMICOLON');
  return cmd;
}

function parseAtribuicao() {
  const id = expect('IDENTIFIER').value;
  expect('ASSIGN');
  const expr = parseExpressao();
  return { type: 'Atribuicao', id, expr };
}

function parseExpressao() {
  let left = parseRelacional();
  return left;
}

function parseRelacional() {
  let left = parseAditivo();
  while (match('GREATER_THAN') || match('LESS_THAN') || match('EQUAL')) {
    const op = advance().type;
    const right = parseAditivo();
    left = { type: 'BinOp', op, left, right };
  }
  return left;
}

function parseAditivo() {
  let left = parseTermo();
  while (match('PLUS') || match('MINUS')) {
    const op = advance().type;
    const right = parseTermo();
    left = { type: 'BinOp', op, left, right };
  }
  return left;
}

function parseTermo() {
  let left = parseFator();
  while (match('MULTIPLY') || match('DIVIDE')) {
    const op = advance().type;
    const right = parseFator();
    left = { type: 'BinOp', op, left, right };
  }
  return left;
}

function parseFator() {
  if (match('LPAREN')) {
    advance();
    const expr = parseExpressao();
    expect('RPAREN');
    return expr;
  }
  if (match('INTEGER_LITERAL') || match('FLOAT_LITERAL')) {
    return { type: 'Literal', value: advance().value };
  }
  if (match('IDENTIFIER')) {
    return { type: 'Var', name: advance().value };
  }
  throw new Error(`Fator inesperado: ${tokens[current]?.type}`);
}

export { parse };
