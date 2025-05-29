import { SaM } from './sam.js';

const samcode = [
  "PUSH 10.5",
  "PUSH 20.7",
  "ADD",
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.run();