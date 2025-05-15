export class SaM {
  constructor(program) {
    this.stack = [];
    this.program = program;
    this.pc = 0;
    this.running = true;
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
    switch (instruction.toUpperCase()) {
      case 'PUSH':
        this.stack.push(Number(arg));
        break;
      case 'POP':
        this.stack.pop();
        break;
      case 'ADD':
        {
          const vTop = this.stack.pop();
          const vBelow = this.stack.pop();
          this.stack.push(vBelow + vTop);
        }
        break;
      case 'SUB':
        {
          const vTop = this.stack.pop();
          const vBelow = this.stack.pop();
          this.stack.push(vBelow - vTop);
        }
        break;
      case 'TIMES':
        {
          const b = this.stack.pop();
          const vBelow = this.stack.pop();
          this.stack.push(vBelow * b);
        }
        break;
      case 'DIV':
        {
          const vTop = this.stack.pop();
          const vBelow = this.stack.pop();
          this.stack.push(vBelow / vTop);
        }
        break;
      case 'MOD':
      {
        const vTop = this.stack.pop();
        const vBelow = this.stack.pop();
        this.stack.push(vBelow % vTop);
      }
      break;
      case 'LSHIFT':
        {
          const vTop = this.stack.pop();
          this.stack.push(vTop << Number(arg));
        }
        break;
        case 'RSHIFT':
          {
            const vTop = this.stack.pop();
            this.stack.push(vTop >> Number(arg));
          }
          break;
      case 'PRINT':
        console.log(this.stack[this.stack.length - 1]);
        break;
      case 'HALT':
        this.running = false;
        break;
      default:
        throw new Error(`Instrução desconhecida: ${instruction}`);
    }
  }
}