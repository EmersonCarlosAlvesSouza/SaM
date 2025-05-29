import { SaM } from './sam.js';

const samcode = [
  "PUSH 10",
  "PUSH 10",
  "CMP",
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.run();