// @ts-check

function setup() {
    let divTallene = document.getElementById("tallene");
    let divOperatorer = document.getElementById("operatorer");
    let inpDisplay = document.querySelector("#display > input");

    let nyttTall = true;
    let verdi = 0;
    let operator = "";

    divTallene.addEventListener("click", lesTall);
    divOperatorer.addEventListener("click", operer);

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
        switch(operator) {
            case "+":
              verdi += Number(inpDisplay.value);
              inpDisplay.value = String(verdi);
              break;
        }
        verdi = Number(inpDisplay.value);
        operator = "";
    }

    function operer(e) {
        let t = e.target;
        if (t.className === "op") {
            beregn();
            let id = t.id;
            switch(id) {
                case "opC":
                  break;
                case "opAC":
                  inpDisplay.value = "0";
                  verdi = 0;
                  operator = "";
                  break;
                case "opPluss":
                  operator = "+";
                  break;
                case "opErlik":
                  break;
                default:
                  break;
            }
        }
    }

    function blink() {
        inpDisplay.classList.add("active");
        setTimeout( () => inpDisplay.classList.remove("active"), 40);
    }
}