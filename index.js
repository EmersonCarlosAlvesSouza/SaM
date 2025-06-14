import { SaM } from './sam.js';

const samcode = [
  "PUSHIMM 1",
  "PRINT",
  "JUMP 4",
  "PUSHIMM 999",  
  "PUSHIMM 2",
  "PRINT",
  "PUSHIMM 0",
  "JUMPC 9",      
  "PUSHIMM 3",
  "PRINT",
  "STOP"
];



const vm = new SaM(samcode);
vm.fbr = 0;
vm.run();

