//ANALISADOR LEXICO

export const regex_table = {
  // Palavras-chave de controle
  "^if$": "IF",
  "^else$": "ELSE",
  "^end-if$": "END_IF",
  "^while$": "WHILE",
  "^end-while$": "END_WHILE",
  "^for$": "FOR",
  "^function$": "FUNCTION",
  "^return$": "RETURN",
  "^break$": "BREAK",
  "^continue$": "CONTINUE",


  // Constantes e tipos
  "^const$": "CONST",
  "^int$": "TYPE_INT",
  "^double$": "TYPE_DOUBLE",
  "^string$": "TYPE_STRING",

  // Booleanos e valores nulos
  "^true$": "TRUE",
  "^false$": "FALSE",
  "^null$": "NULL",
  "^undefined$": "UNDEFINED",

  // Operadores
  "^\\+$": "PLUS",
  "^-$": "MINUS",
  "^\\*$": "MULTIPLY",
  "^/$": "DIVIDE",
  "^%$": "MOD",
  "^===$": "STRICT_EQUAL",
  "^==$": "EQUAL",
  "^!=$": "NOT_EQUAL",
  "^!==$": "STRICT_NOT_EQUAL",
  "^>$": "GREATER_THAN",
  "^>=$": "GREATER_EQUAL",
  "^<$": "LESS_THAN",
  "^<=$": "LESS_EQUAL",
  "^=$": "ASSIGN",
  "^\\+\\+$": "INCREMENT",
  "^--$": "DECREMENT",
  "^&&$": "AND",
  "^\\|\\|$": "OR",
  "^!$": "NOT",

  // Pontuação
  "^\\($": "LPAREN",
  "^\\)$": "RPAREN",
  "^\\{$": "LBRACE",
  "^\\}$": "RBRACE",
  "^\\[$": "LBRACKET",
  "^\\]$": "RBRACKET",
  "^;$": "SEMICOLON",
  "^:$": "COLON",
  "^,$": "COMMA",
  "^\\.$": "DOT",

  // Literais
  "^\\d+$": "INTEGER_LITERAL",
  "^\\d+\\.\\d+$": "FLOAT_LITERAL",
  "^\".*\"$": "STRING_LITERAL",
  "^'.*'$": "STRING_LITERAL",

  // Identificadores
  "^[a-zA-Z_$][a-zA-Z0-9_$]*$": "IDENTIFIER"
};

export function tokenize(inputCode) {
  const tokens = [];

  // Protege palavras compostas (end-if, end-while)
  const protectedCode = inputCode
    .replace(/\bend-if\b/g, ' end_if ')
    .replace(/\bend-while\b/g, ' end_while ');

  const words = protectedCode
    .replace(/([(){}\[\];:,=+\-*/%!<>])/g, ' $1 ')
    .replace(/==+|!=+|>=|<=|&&|\|\|/g, match => ` ${match} `)
    .split(/\s+/)
    .filter(word => word.length > 0);

  for (const word of words) {
    let matched = false;

    const normalizedWord = word
      .replace(/^end_if$/, 'end-if')
      .replace(/^end_while$/, 'end-while');

    for (const [regex, type] of Object.entries(regex_table)) {
      const re = new RegExp(regex);
      if (re.test(normalizedWord)) {
        tokens.push({ type, value: normalizedWord });
        matched = true;
        break;
      }
    }

    if (!matched) {
      throw new Error(`Token inválido: ${word}`);
    }
  }

  return tokens;
}

