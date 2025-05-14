export class SaM {
  constructor(program) {
    this.stack = [];
    this.memory = {};
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
          const b = this.stack.pop();
          const a = this.stack.pop();
          this.stack.push(a + b);
        }
        break;
      case 'SUB':
        {
          const b = this.stack.pop();
          const a = this.stack.pop();
          this.stack.push(a - b);
        }
        break;
      case 'MUL':
        {
          const b = this.stack.pop();
          const a = this.stack.pop();
          this.stack.push(a * b);
        }
        break;
      case 'DIV':
        {
          const b = this.stack.pop();
          const a = this.stack.pop();
          this.stack.push(a / b);
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