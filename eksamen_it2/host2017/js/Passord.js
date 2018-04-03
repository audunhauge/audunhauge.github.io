// @flow

class ValgTelling {
  constructor() {
    this.partiStemmer = {};
    this.prosent = {};  // lagres når resultat kjøres
  }

  velg(parti) {
    if (!this.partiStemmer[parti]) {
      this.partiStemmer[parti] = 0;
    }
    this.partiStemmer[parti]++;
  }

  resultat() {
    let partiene = Object.keys(this.partiStemmer);
    // vel å merke partier som fikk stemmer
    let total = partiene.reduce( (sum,e) => +this.partiStemmer[e] + sum, 0 );
    return Object.keys(this.partiStemmer)
      .map(e => {
        let antall = this.partiStemmer[e];
        let prosent = (100*antall/total).toFixed(2);
        this.prosent[e] = prosent;
        return `<li>${e} fikk ${antall} stemmer
        som utgjør ${prosent}% av stemmene.`;
      })
      .join("");
  }

  /**
   * Forutsetter at resultat() er kjørt
   * slik at this.prosent har gyldige verdier
   * @param {HTMLElement} table 
   * @param {Array} partiliste 
   */
  sammenlikning(table, partiliste) {
    partiliste.forEach((partiInfo, i) => {
      let [p,o] = partiInfo.split(":");
      let nyProsent = this.prosent[p] || "0.0";
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = p;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = o;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = nyProsent;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = (+nyProsent - +o).toFixed(2);
      td.dataset.sgn = String(Math.sign(+nyProsent - +o));
      tr.appendChild(td);

      table.appendChild(tr);
    });
  }

}

class Passord {
  constructor(plain) {
    sha256(plain).then(v => (this.pwd = v));
  }

  check(crypt) {
    return this.pwd === crypt;
  }
}

class PassordListe {
  constructor() {
    this.liste = [];
  }

  add(plain) {
    this.liste.push(new Passord(plain));
  }
  
  /**
   * Tester om passordet finnes
   * Dersom ja - da er dette passordet oppbrukt
   * @param {string} plain 
   * @returns {boolean} true if valid passwrd
   */
  async test(plain) {
    let valid = false;
    let crypt = await sha256(plain);
    let unused = [];
    for (let pwd of this.liste) {
      if (pwd.check(crypt)) {
        valid = true;
      } else {
        unused.push(pwd);
      }
    }
    this.liste = unused;
    return valid;
  }
}

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder("utf-8").encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map(b => ("00" + b.toString(16)).slice(-2))
    .join("");
  return hashHex;
}
