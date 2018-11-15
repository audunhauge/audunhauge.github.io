// @ts-check


function setup() {
    let divSiffer = document.getElementById("siffer");
    let divVerdi = document.getElementById("verdi");

    //*
    // prøvde å lage bits med kode, men det skar seg ....
    function lagBits(antall) {
        divSiffer.innerHTML = "";
        for (let i = antall - 1; i >= 0; i--) {
            let b = document.createElement("div");
            b.className = "bit";
            b.dataset.tall = String(2 ** i);
            divSiffer.appendChild(b);
        }
    }
    lagBits(8);

    //*/

    divSiffer.addEventListener("click", beregn);

    function beregn(e) {
        let t = e.target;
        if (t.classList.contains("bit")) {
            t.classList.toggle("on");
        }
        let bits = Array.from(divSiffer.querySelectorAll("div.on"));
        let sum = 0;
        for (let b of bits) {
            sum += Number(b.dataset.tall);
        }
        divVerdi.innerHTML = String(sum);

    }
}