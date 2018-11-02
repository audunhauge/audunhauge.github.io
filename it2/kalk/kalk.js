// @ts-check

function setup() {
    let divTallene = document.getElementById("tallene");
    let divOperatorer = document.getElementById("operatorer");
    let divFunksjoner = document.getElementById("funksjoner");
    let inpDisplay = document.querySelector("#display > input");

    let nyttTall = true;
    let verdi = 0;
    let operator = "";

    divTallene.addEventListener("click", lesTall);
    divOperatorer.addEventListener("click", operer);
    divFunksjoner.addEventListener("click", funger);

    function funger(e) {
        let t = e.target;
        if (t.className === "fun") {
            let id = t.id;
            nyttTall = true;
            switch (id) {
                case "opErlik":
                    beregn();
                    break;
                case "opAC":
                    verdi = 0;
                    inpDisplay.value = "0";
                    operator = "";
                    break;
                case "opSin":
                    verdi = Number(inpDisplay.value);
                    let s = Math.sin(Math.PI * verdi / 180);
                    inpDisplay.value = String(s);
                    break;
            }

        }
    }

    function lesTall(e) {
        let t = e.target;
        if (t.className === "tall") {
            if (nyttTall) {
                inpDisplay.value = "";
                nyttTall = false;
                blink();
            }
            inpDisplay.value += t.innerHTML;
        }
    }

    function beregn() {
        nyttTall = true;
        blink();
        let update = true;
        switch (operator) {
            case "+":
                verdi += Number(inpDisplay.value);
                break;
            case "*":
                verdi *= Number(inpDisplay.value);
                break;
            case "/":
                verdi /= Number(inpDisplay.value);
                break;
            case "-":
                verdi -= Number(inpDisplay.value);
                break;
            default:
                update = false;
                break;
        }
        if (update) inpDisplay.value = String(verdi);
        verdi = Number(inpDisplay.value);
        operator = "";
    }

    function operer(e) {
        let t = e.target;
        if (t.className === "op") {
            beregn();
            let id = t.id;
            switch (id) {
                case "opPluss":
                    operator = "+";
                    break;
                case "opMin":
                    operator = "-";
                    break;
                case "opMul":
                    operator = "*";
                    break;
                case "opDiv":
                    operator = "/";
                    break;
                default:
                    break;
            }
        }
    }

    function blink() {
        inpDisplay.classList.add("active");
        setTimeout(() => inpDisplay.classList.remove("active"), 40);
    }
}