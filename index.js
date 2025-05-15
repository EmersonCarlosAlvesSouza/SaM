import { SaM } from './sam.js';

const samcode = [
  "PUSH 10101010101010101010101010101010",
  "PUSH 01010101010101010101010101010101",
  "BITNAND",
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.run();