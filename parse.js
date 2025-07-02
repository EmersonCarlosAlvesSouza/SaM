//ANALISADOR SINTATICO(PARSE)

export function parse(tokens) {
  let current = 0;

  function match(...types) {
    if (current < tokens.length && types.includes(tokens[current].type)) {
      return tokens[current++];
    }
    return null;
  }

  function expect(type) {
    const token = match(type);
    if (!token) {
      throw new Error(`Esperado ${type}, mas encontrado ${tokens[current]?.type || 'EOF'}`);
    }
    return token;
  }

  function parseProgram() {
    return {
      type: "Program",
      body: [parseFunctionDecl()]
    };
  }

  function parseFunctionDecl() {
    expect("FUNCTION");
    const name = expect("IDENTIFIER").value;
    expect("LPAREN");
    expect("RPAREN");
    expect("LBRACE");

    const body = [];
    while (!match("RBRACE")) {
      body.push(parseStatement());
    }

    return {
      type: "FunctionDeclaration",
      name,
      body
    };
  }

  function parseStatement() {
    if (["TYPE_INT", "TYPE_DOUBLE", "TYPE_STRING"].includes(tokens[current].type)) {
      return parseVarDecl();
    }
    if (tokens[current].type === "IDENTIFIER" && tokens[current + 1]?.type === "ASSIGN") {
      return parseAssignment();
    }
    if (tokens[current].type === "RETURN") {
      return parseReturn();
    }

    throw new Error(`Declaração inválida começando com ${tokens[current].type}`);
  }

  function parseVarDecl() {
    const varType = expect(tokens[current].type).type;
    const name = expect("IDENTIFIER").value;
    expect("SEMICOLON");

    return {
      type: "VariableDeclaration",
      varType,
      name
    };
  }

  function parseAssignment() {
    const name = expect("IDENTIFIER").value;
    expect("ASSIGN");
    const expr = parseExpression();
    expect("SEMICOLON");

    return {
      type: "Assignment",
      name,
      value: expr
    };
  }

  function parseReturn() {
    expect("RETURN");
    const value = parseExpression();
    expect("SEMICOLON");

    return {
      type: "ReturnStatement",
      value
    };
  }

  function parseExpression() {
    let left = parseTerm();
    while (match("PLUS", "MINUS")) {
      const operator = tokens[current - 1].type;
      const right = parseTerm();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right
      };
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (match("MULTIPLY", "DIVIDE")) {
      const operator = tokens[current - 1].type;
      const right = parseFactor();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right
      };
    }
    return left;
  }

  function parseFactor() {
    if (match("INTEGER_LITERAL", "FLOAT_LITERAL", "STRING_LITERAL", "IDENTIFIER")) {
      return {
        type: "LiteralOrIdentifier",
        value: tokens[current - 1].value,
        tokenType: tokens[current - 1].type
      };
    }

    if (match("LPAREN")) {
      const expr = parseExpression();
      expect("RPAREN");
      return expr;
    }

    throw new Error(`Fator inesperado: ${tokens[current].type}`);
  }

  return parseProgram();
}
