// @ts-check

function makeBrett(n,m) {
    let b = Array(n).fill(0);
    while (m) {
        let i;
        do {
          i = Math.trunc(Math.random()*n);
        } while(b[i]);
        b[i] = 9;
    }

}

function setup() {
    let brett = makeBrett(16*16, 30);
    let divBrett = document.getElementById("brett");
    let ruter = Array.from(document.querySelectorAll("#brett > div"));
    for (let i = 0; i < 16*16; i++) {
            let b = brett[i];
            let r = ruter[i];
            r.className = "rute";
            r.dataset.idx = i;
            if (b === 9) {
                r.innerHTML = "O";
            } else if (b !== 0) {
                r.innerHTML = String(b);
            }
            i++;
        }
    }
    divBrett.addEventListener("click", showMine);

    function showMine(e) {
        let t = e.target;
        let idx = t.dataset.idx;
        if (t.innerHTML === "O") {
            document.getElementById("smily").innerHTML = ":(";
            return;
        }
        let usett = Array.from(document.querySelectorAll("div.rute:not(.synlig)"));
        if (usett.length === 12) {
            document.getElementById("tid").innerHTML = "OK";
            return;
        }
        if (t.classList.contains("rute")) {
            reveal(idx);
            function reveal(idx) {
                let t = ruter[idx];
                if (t.classList.contains("synlig")) {
                    return;
                }
                t.classList.add("synlig");
                if (t.innerHTML !== "") {
                    return;
                }
                if (idx < 16 || idx > 238 || idx % 16 === 0 || (idx + 1) % 16 === 0) {
                    // sadhkh
                } else {
                    setTimeout(() => reveal(idx-1), 300);
                    setTimeout(() => reveal(idx+1), 300);
                    setTimeout(() => reveal(idx-16), 300);
                    setTimeout(() => reveal(idx+16), 300);
                }
            }
        }
    }
}