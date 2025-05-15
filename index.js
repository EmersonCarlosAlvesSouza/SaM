import { SaM } from './sam.js';

const samcode = [
  "PUSH 32",
  "LSHIFT 2",
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.run();