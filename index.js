import { SaM } from './sam.js';

const samcode = [
  "PUSH 10",
  "PUSH 20",
  "ADD",
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.run();
