// @ts-check

function setup() {
    let divTallene = document.getElementById("tallene");
    let divOperatorer = document.getElementById("operatorer");
    let inpDisplay = document.querySelector("#display > input");

    let nyttTall = true;

    divTallene.addEventListener("click", lesTall);
    divOperatorer.addEventListener("click", operer);

    function lesTall(e) {
        let t = e.target;
        if (t.className === "tall") {
            if (nyttTall) {
                inpDisplay.value = "";
                nyttTall = false;
            }
            inpDisplay.value += t.innerHTML;
        }
    }

    function operer(e) {
        let t = e.target;
        if (t.className === "op") {
            let id = t.id;
            switch(id) {
                case "opC":
                  break;
                case "opAC":
                  inpDisplay.value = "";
                  break;
                case "opPluss":
                  break;
                case "opErlik":
                  break;
                default:
                  break;
            }
        }
    }
}