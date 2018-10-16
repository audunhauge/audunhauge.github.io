// @ts-check

/**
 * Returnerer s med stor forbokstav
 * @param {string} s 
 */
function storForbokstav(s) {
    let f = s.charAt(0).toUpperCase();
    let r = s.substr(1);
    return f + r.toLowerCase();
}

/**
 * Tar et navn som "ole johann olsen"
 * og gir tilbake "Ole Johann Olsen"
 * @param {string} s 
 */
function niceName(s) {
    let nameParts = s.split(" ");
    let result = [];
    for (let i = 0; i < nameParts.length; i++) {
        let navneBit = nameParts[i];
        result.push(storForbokstav(navneBit));
    }
    return result.join(" ");
}


/**
 * Returnerer en div med width=bredde
 * @param {number} bredde 
 */
function lagSoyle(bredde) {
    let div = document.createElement("div");
    div.className = "soyle";
    div.style.width = bredde + "px";
    return div;
}

function setEtikett(soyle, navn) {
    soyle.innerHTML = niceName(navn);
}


function bmi(person) {
    let h = person.hoyde / 100;
    let bmiVerdi = person.vekt / (h * h);
    return bmiVerdi;
}