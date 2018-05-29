// @ts-check

function setup() {

}

function test2(event) {
   
}

/**
 * Summerer tre tallverdier
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @returns {number}
 */
function summer(a,b,c) {
   return a+b+c;
}


/**
 * @returns {number} summen av alle parametre
 */
function summer2(... stuff) {
    let sum = 0;
    for (let v of stuff) {
      sum += v;
    }
    return sum;
}

summer2(1,2,3,4,5)
