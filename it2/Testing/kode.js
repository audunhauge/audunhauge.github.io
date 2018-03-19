function setup() {

   let t = new Test("body");


   /**
    * Add to numbers
    * @param {number} a 
    * @param {number} b 
    * @returns {number} a+b
    */
   function add(a,b) {
       return a+b;
   }

   /**
    * Convert number to range 0..4
    * @param {number} a number to convert
    * @returns {number} converted value
    */
   function convert(a) {
       let limits = [2,10,36,64];
       let values = [1,2,3,4];
       let idx = limits.findIndex( v => v>a ) -1;
       return values[idx] || 0;
   }

   // run tests

   t.nassert(add,add(1,2)=== 3,"1+2=3");
   t.assert(add(-1,2) === 1,"add -1+2");
   t.assert(add(0,0) === 0,"add 0+02");
   t.assert(add(0.1,0.2) === 0.3,"add 0.1+0.2");

   t.assert(convert(2) === 0,"covert 2=>0");
   t.assert(convert(3) === 1,"covert 3=>1");
   t.assert(convert(3) === 1,"covert 3=>1");

   t.display();


}