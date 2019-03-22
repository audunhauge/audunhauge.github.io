// @ts-check

function setup() {
    let neste = "kryss";
    let divBrett = document.getElementById("brett");
    let alleRuter = 
    Array.from(document.querySelectorAll("div.rute"));
    for (let i=0; i < alleRuter.length; i++) {
        let rute = alleRuter[i];
        rute.id = "r" + i; 
    }

    divBrett.addEventListener("click", settKryss);

    function settKryss(e) {
        let t = e.target;
        //console.log(t.id);
        t.classList.add(neste);
        if (neste === "kryss") {
            neste = "runding"
        } else {
            neste = "kryss"
        }
    }
}