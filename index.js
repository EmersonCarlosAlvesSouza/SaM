import { SaM } from './sam.js';

const samcode = [
  "READSTR",
  "WRITESTR",
  "READ",
  "WRITE",
  "READCH",
  "WRITECH",
  "READF",
  "WRITEF",
  "STOP"
];




const vm = new SaM(samcode);
vm.fbr = 0;
vm.run();

