export class SaM {
  constructor(program, labels = {}) {
    this.stack = [];
    this.program = program;
    this.labels = labels;
    this.pc = 0;
    this.running = true;
    this.fbr = 0;

  }


  run() {
    while (this.running && this.pc < this.program.length) {
      const line = this.program[this.pc];
      const [instruction, arg] = line.trim().split(" ");
      this.execute(instruction, arg);
      this.pc++;
    }
  }

  execute(instruction, arg) {
    var vTop;
    var vBelow;


    switch (instruction.toUpperCase()) {
      case 'PUSH':
        this.stack.push(Number(arg));
        break;
      case 'POP':
        this.stack.pop();
        break;
      case 'ADD':
      case 'ADDF':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow + vTop);
        }
        break;
      case 'SUB':
      case 'SUBF':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow - vTop);
        }
        break;
      case 'TIMES':
      case 'TIMESF':
        {
          let b = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow * b);
        }
        break;
      case 'DIV':
      case 'DIVF':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow / vTop);
        }
        break;
      case 'MOD':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow % vTop);
        }
        break;
      case 'LSHIFT':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop << Number(arg));
        }
        break;
      case 'RSHIFT':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop >> Number(arg));
        }
        break;
      case 'NOT':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop != 0 ? 0 : 1);
        }
        break;
      case 'OR':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push((vBelow || vTop) == 0 ? 0 : 1);
        }
        break;
      case 'AND':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push((vBelow && vTop) == 0 ? 0 : 1);
        }
        break;
      case 'XOR':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push((vBelow !== vTop) == true ? 1 : 0);
        }
        break;
      case 'NAND':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(!(vBelow && vTop) == true ? 1 : 0);
        }
        break;
      case 'BITNOT':
        {
          vTop = this.stack.pop();
          this.stack.push(~vTop);
        }
        break;
      case 'BITAND':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow & vTop);
        }
        break;
      case 'BITOR':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow | vTop);
        }
        break;
      case 'BITXOR':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow ^ vTop);
        }
        break;
      case 'BITNAND':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(~(vBelow & vTop));
        }
        break;
      case 'GREATER':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow > vTop ? 1 : 0);
        }
        break;
      case 'LESS':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow < vTop ? 1 : 0);
        }
        break;
      case 'EQUAL':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow === vTop ? 1 : 0);
        }
        break;
      case 'ISNIL':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop === 0 ? 1 : 0);
        }
        break;
      case 'ISPOS':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop > 0 ? 1 : 0);
        }
        break;
      case 'ISNEG':
        {
          vTop = this.stack.pop();
          this.stack.push(vTop < 0 ? 1 : 0);
        }
        break;
      case 'CMP':
      case 'CMPF':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vBelow < vTop ? -1 : vBelow > vTop ? 1 : 0);
        }
        break;
      case 'PRINT':
        console.log(this.stack[this.stack.length - 1]);
        break;
      case 'HALT':
        this.running = false;
        break;

      case 'ITOF':
        {
          vTop = this.stack.pop();
          this.stack.push(parseFloat(vTop));
        }
        break;

      case 'FTOI':
        {
          vTop = this.stack.pop();
          this.stack.push(parseInt(vTop));
        }
        break;

      case 'FTOIR':
        {
          vTop = this.stack.pop();
          this.stack.push(Math.round(vTop));
        }
        break;
      case 'PUSHIMM':
        {
          this.stack.push(parseInt(arg));
        }
        break;

      case 'PUSHIMMF':
        {
          this.stack.push(parseFloat(arg));
        }
        break;

      case 'PUSHIMMCH':
        {
          const char = arg.replace(/'/g, "");
          this.stack.push(char.charCodeAt(0));
        }
        break;

      case 'PUSHIMMSTR':
        {
          //aqui eu to simulando uma heap mano
          if (!this.heap) {
            this.heap = new Map();
            this.heapPointer = 0x4000; // endereço inicial da heap (Deixei igual ao da imagem do slide do saad)
            //a saide esta sendo 16384 porque o valor 0x4000 em decimal é 16384 caso tenha duvida mano
          }
          const stringValue = arg.replace(/"/g, "");
          const address = this.heapPointer;
          this.heap.set(address, stringValue);
          this.stack.push(address);
          this.heapPointer += stringValue.length; // avança o heap pointer
        }
        break;
      case 'PUSHIMMPA':
        {
          const label = arg;
          if (!(label in this.labels)) {
            throw new Error(`Label ${label} não encontrado.`);
          }
          this.stack.push(this.labels[label]);
        }
        break;
      case 'DUP':
        {
          vTop = this.stack[this.stack.length - 1];
          this.stack.push(vTop);
        }
        break;

      case 'SWAP':
        {
          vTop = this.stack.pop();
          vBelow = this.stack.pop();
          this.stack.push(vTop);
          this.stack.push(vBelow);
        }
        break;


      case 'MALLOC':
        {
          if (!this.heap) {
            this.heap = new Map();
            this.heapPointer = 0x4000;
          }
          const size = this.stack.pop();
          const address = this.heapPointer;

          // Alocar o bloco (simulando cada célula)
          const allocation = new Array(size + 1);
          allocation[0] = size; // A primeira célula guarda o tamanho
          this.heap.set(address, allocation);

          this.stack.push(address);
          this.heapPointer += (size + 1);
        }
        break;
      case 'PUSHIND':
        {
          const m = this.stack.pop();
          if (m < 0 || m >= this.stack.length) {
            throw new Error(`Endereço inválido PUSHIND: ${m}`);
          }
          this.stack.push(this.stack[m]);
        }
        break;


      case 'STOREIND':
        {
          const vTop = this.stack.pop();
          const vBelow = this.stack.pop();
          if (vBelow < 0 || vBelow >= this.stack.length) {
            throw new Error(`Endereço inválido STOREIND: ${vBelow}`);
          }
          this.stack[vBelow] = vTop;
        }
        break;


      case 'ADDSP':
        {
          const n = parseInt(arg);
          if (n > 0) {
            for (let i = 0; i < n; i++) {
              this.stack.push(0);
            }
          } else {
            for (let i = 0; i < Math.abs(n); i++) {
              if (this.stack.length === 0) break;
              this.stack.pop();
            }
          }
        }
        break;

      case 'PUSHOFF':
        {
          const k = parseInt(arg);
          const address = this.fbr + k;
          if (address < 0 || address >= this.stack.length) {
            throw new Error(`Endereço inválido PUSHOFF: ${address}`);
          }
          this.stack.push(this.stack[address]);
        }
        break;


      case 'STOREOFF':
        {
          const k = parseInt(arg);
          const vTop = this.stack.pop();
          const address = this.fbr + k;
          if (address < 0 || address >= this.stack.length) {
            throw new Error(`Endereço inválido STOREOFF: ${address}`);
          }
          this.stack[address] = vTop;
        }
        break;

              case 'PUSHSP':
        {
          this.stack.push(this.stack.length);
        }
        break;

      case 'POPSP':
        {
          const vTop = this.stack.pop();
          const delta = vTop - this.stack.length;
          if (delta > 0) {
            for (let i = 0; i < delta; i++) {
              this.stack.push(0);
            }
          } else {
            for (let i = 0; i < -delta; i++) {
              if (this.stack.length > 0) {
                this.stack.pop();
              }
            }
          }
        }
        break;

      case 'PUSHFBR':
        {
          this.stack.push(this.fbr);
        }
        break;

      case 'POPFBR':
        {
          const vTop = this.stack.pop();
          this.fbr = vTop;
        }
        break;

      case 'LINK':
        {
          this.stack.push(this.fbr);
          this.fbr = this.stack.length - 1;
        }
        break;

      case 'STOP':
        {
          this.running = false;
        }
        break;

              case 'JUMP':
        {
          const target = isNaN(arg) ? this.labels[arg] : parseInt(arg);
          if (target === undefined) {
            throw new Error(`Endereço ou label inválido JUMP: ${arg}`);
          }
          this.pc = target - 1;  // -1 porque o loop incrementa depois
        }
        break;

      case 'JUMPC':
        {
          const vTop = this.stack.pop();
          if (vTop !== 0) {
            const target = isNaN(arg) ? this.labels[arg] : parseInt(arg);
            if (target === undefined) {
              throw new Error(`Endereço ou label inválido JUMPC: ${arg}`);
            }
            this.pc = target - 1;
          }
        }
        break;

      case 'JUMPIND':
        {
          const vTop = this.stack.pop();
          this.pc = vTop - 1;
        }
        break;

      case 'JSR':
        {
          const target = isNaN(arg) ? this.labels[arg] : parseInt(arg);
          if (target === undefined) {
            throw new Error(`Endereço ou label inválido JSR: ${arg}`);
          }
          this.stack.push(this.pc + 1);  // empilha endereço de retorno
          this.pc = target - 1;
        }
        break;

      case 'JSRIND':
        {
          const vTop = this.stack.pop();
          this.stack.push(this.pc + 1);
          this.pc = vTop - 1;
        }
        break;

      case 'SKIP':
        {
          const vTop = this.stack.pop();
          this.pc = this.pc + vTop;
        }
        break;




      default:
        throw new Error(`Instrução desconhecida: ${instruction}`);
    }
  }
}