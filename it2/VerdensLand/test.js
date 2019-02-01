// @ts-check


/**
 * 
 * @param {number} a Et tall
 * @param {string} b En tekst
 * @param {Array} c en liste med tall
 * @param {boolean} d ja/nei
 * @returns {string}
 */
function test(a,b,c,d) {
    if (d) {
        return "2";
    } else {
        return JSON.stringify([]);
    }
   return "test"
}

test(1,"ole",[],Boolean(0));