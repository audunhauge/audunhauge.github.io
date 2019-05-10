// @ts-check

function setup() {
    let brett = [
        [1, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 1],
        [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
        [0, 0, 1, 9, 1, 0, 1, 2, 9, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 1, 9, 2, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
        [0, 0, 1, 9, 1, 0, 0, 0, 1, 9, 9, 9, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 9, 1, 0, 0],
        [0, 0, 1, 9, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    let divBrett = document.getElementById("brett");
    let ruter = Array.from(document.querySelectorAll("#brett > div"));
    let i = 0;
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            let b = brett[y][x];
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
                    reveal(idx - 1);
                    reveal(idx + 1);
                    reveal(idx + 16);
                    reveal(idx - 16);
                }
            }
        }
    }
}