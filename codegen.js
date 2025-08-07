export function generateCode(ast) {
    const output = [];
    let labelCounter = 0;

    // Map para variáveis locais: id -> offset
    const variaveis = new Map();

    // Assumimos que só existe função main, com variáveis locais em main.comandos
    // Vamos coletar variáveis locais (declarações) para calcular offsets
    let offset = 0;
    ast.main.comandos.forEach(cmd => {
        if (cmd.type === 'Declaracao') {
            variaveis.set(cmd.id, offset++);
        }
    });

    // Reserva espaço para variáveis locais na pilha
    output.push(`ADDSP ${variaveis.size}`);

    function novaLabel(base) {
        return `${base}_${labelCounter++}`;
    }

    function gen(node) {
        switch (node.type) {
            case 'Programa':
                // Gera código para a função main
                gen(node.main);
                break;

            case 'MainFunction':
                // Gera os comandos da main
                node.comandos.forEach(gen);
                break;

            case 'Declaracao':
                // Já processado para offsets, não gera código aqui
                break;

            case 'Atribuicao':
                gen(node.expr);
                if (!variaveis.has(node.id)) {
                    throw new Error(`Variável não declarada: ${node.id}`);
                }
                output.push(`STOREOFF ${variaveis.get(node.id)}`);
                break;

            case 'Var':
                if (!variaveis.has(node.name)) {
                    throw new Error(`Variável não declarada: ${node.name}`);
                }
                output.push(`PUSHOFF ${variaveis.get(node.name)}`);
                break;

            case 'Literal':
                output.push(`PUSHIMM ${node.value}`);
                break;

            case 'BinOp':
                gen(node.left);
                gen(node.right);
                switch (node.op) {
                    case 'PLUS': output.push('ADD'); break;
                    case 'MINUS': output.push('SUB'); break;
                    case 'MULTIPLY': output.push('MUL'); break;
                    case 'DIVIDE': output.push('DIV'); break;
                    case 'MOD': output.push('MOD'); break;
                    case 'GREATER_THAN': output.push('GREATER'); break;
                    case 'LESS_THAN': output.push('LESS'); break;
                    case 'GREATER_EQUAL':
                        output.push('LESS');
                        output.push('NOT');
                        break;
                    case 'LESS_EQUAL':
                        output.push('GREATER');
                        output.push('NOT');
                        break;
                    case 'EQUAL': output.push('EQUAL'); break;
                    case 'NOT_EQUAL':
                        output.push('EQUAL');
                        output.push('NOT');
                        break;
                    case 'AND': output.push('AND'); break;
                    case 'OR': output.push('OR'); break;
                    default:
                        throw new Error(`Operador binário não reconhecido: ${node.op}`);
                }
                break;

            case 'UnOp':
                gen(node.expr);
                switch (node.op) {
                    case 'NOT':
                        output.push('NOT');
                        break;
                    case 'MINUS':
                        output.push('PUSHIMM 0');
                        output.push('SWAP'); // Assumindo que sua VM suporta SWAP
                        output.push('SUB');
                        break;
                    default:
                        throw new Error(`Operador unário não reconhecido: ${node.op}`);
                }
                break;

            case 'If':
                const elseLabel = novaLabel('ELSE');
                const endLabel = novaLabel('ENDIF');

                gen(node.cond);
                output.push(`NOT`);
                output.push(`JUMPC ${node.elseBlock ? elseLabel : endLabel}`);

                node.thenBlock.forEach(gen);

                if (node.elseBlock) {
                    output.push(`JUMP ${endLabel}`);
                    output.push(`${elseLabel}:`);
                    node.elseBlock.forEach(gen);
                }

                output.push(`${endLabel}:`);
                break;

            case 'While':
                const startLabel = novaLabel('WHILE_START');
                const whileEndLabel = novaLabel('WHILE_END');
                output.push(`${startLabel}:`);
                gen(node.cond);
                output.push(`NOT`);
                output.push(`JUMPC ${whileEndLabel}`);
                node.body.forEach(gen);
                output.push(`JUMP ${startLabel}`);
                output.push(`${whileEndLabel}:`);
                break;

            case 'Return':
                gen(node.expr);
                output.push('PRINT');
                break;

            default:
                throw new Error(`Comando não reconhecido: ${node.type}`);
        }
    }

    // Gera código a partir da raiz do AST
    gen(ast);

    // Desaloca espaço das variáveis locais e para o programa
    output.push(`ADDSP -${variaveis.size}`);
    output.push('STOP');

    return output;
}
