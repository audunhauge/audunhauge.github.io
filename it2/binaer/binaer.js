// @ts-check

function setup() {
    let divSiffer = document.getElementById("siffer");
    let selSize = document.getElementById("size");
    let divVerdi = document.getElementById("verdi");

    selSize.addEventListener("change", lagSiffer);

    divSiffer.addEventListener("click", beregnVerdi);

    function lagSiffer(e) {
        let size = Number(selSize.value);
        divSiffer.innerHTML = "";
        divSiffer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        divSiffer.style.width = (20*size) + "px";
        for (let i=0; i< size; i++) {
            let s = document.createElement("div");
            s.className = "bit";
            s.dataset.tall = String(2n ** BigInt(size - i));
            divSiffer.appendChild(s);
        }
    }

    function beregnVerdi(e) {
        let t = e.target;
        if (t.classList.contains("bit")) {
            t.classList.toggle("on");
        }
        let bits = Array.from(divSiffer.querySelectorAll(".bit.on"));
        let verdi = bits.map(e => +e.dataset.tall).reduce((s,v) => s+BigInt(v),0n);
        divVerdi.innerHTML = String(verdi);
    }
}