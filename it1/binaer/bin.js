// @ts-check

function setup() {
    let divRegister = document.getElementById("register");
    let divVerdi = document.getElementById("verdi");

    divRegister.addEventListener("click", beregn);
    divVerdi.addEventListener("click", visBin);

    function beregn(e) {
        let t = e.target;
        if (t.classList.contains("bit")) {
            t.classList.toggle("on");
        }
        let bits = Array.from(divRegister.querySelectorAll(".on"));
        let sum = bits.map(e => +e.dataset.tall).reduce((s,v) => s+v,0);
        divVerdi.innerHTML = String(sum);

    }
    
    function visBin(e) {
        let v = Number(divVerdi.innerHTML);
        v++;
        divVerdi.innerHTML = String(v);
        let bits = Array.from(divRegister.querySelectorAll(".bit"));
        bits.forEach(b => {
            b.classList.remove("on");
            if (Number(b.dataset.tall) & v) {
                b.classList.add("on");
            }
        });
    }

}
