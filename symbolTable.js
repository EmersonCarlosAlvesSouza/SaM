function buildSymbolTable(ast) {
    const table = {};

    // Adiciona as declarações globais (fora do main)
    for (const decl of ast.declaracoes) {
        table[decl.id] = {
            tipo: decl.tipo,
            escopo: 'global'
        };
    }

    // Adiciona variáveis dentro da função main
    if (ast.main && ast.main.comandos) {
        for (const cmd of ast.main.comandos) {
            extractSymbolsFromCommand(cmd, table, 'main');
        }
    }

    return table;
}

function extractSymbolsFromCommand(cmd, table, escopo) {
    if (cmd.type === 'Declaracao') {
        const { id, tipo } = cmd;
        if (!table[id]) {
            table[id] = {
                tipo,
                escopo
            };
        }
    } else if (cmd.type === 'Atribuicao') {
        const id = cmd.id;
        if (!table[id]) {
            table[id] = {
                tipo: 'desconhecido', // pode ser inferido mais tarde
                escopo
            };
        }
    } else if (cmd.type === 'If') {
        cmd.thenBlock.forEach(c => extractSymbolsFromCommand(c, table, escopo));
        if (cmd.elseBlock) {
            cmd.elseBlock.forEach(c => extractSymbolsFromCommand(c, table, escopo));
        }
    } else if (cmd.type === 'While') {
        cmd.body.forEach(c => extractSymbolsFromCommand(c, table, escopo));
    }
}

export { buildSymbolTable };
