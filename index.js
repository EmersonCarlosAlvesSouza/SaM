import { SaM } from './sam.js';

const samcode = [
  "PUSHIMM 10",
  "ADDSP 2",       
  "PUSHIMM 20",    
  "STOREOFF 1",    
  "PUSHOFF 1",     
  "PRINT",
  "HALT"
];

const vm = new SaM(samcode);
vm.fbr = 0;
vm.run();

