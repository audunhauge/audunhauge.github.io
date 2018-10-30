// @ts-check

function setup() {
    let divTallene = document.getElementById("tallene");
    let divOperatorer = document.getElementById("operatorer");
    let inpDisplay = document.querySelector("#display > input");
    divTallene.addEventListener("click", tallTast);
    divOperatorer.addEventListener("click", operatorTast);

    let nyStart = true;
    let verdi = 0n;          // verdien vi har beregna så langt
    let operand = "";       // handlingen vi skal gjøre

    function tallTast(e) {
        let t = e.target;
        if (t.className === "tall") {
            let display = inpDisplay.value;
            if (nyStart) {
                display = "";
                blinkDisplay();
                nyStart = false;
            }
            display += t.innerHTML;
            inpDisplay.value = display;
        }
    }

    function operatorTast(e) {
        let t = e.target;
        if (t.className === "op") {
            let opid = t.id;
            // rettetasten er spesiell:
            //   alle andre kan kjøre beregn() først,
            //   men rettetasten skal bare fjerne siste verdi
            //   dersom nyStart ikke er true
            if (opid === "opC" && ! nyStart) {
                let display = inpDisplay.value;
                let l = display.length;
                inpDisplay.value = display.substr(0,l-1);
                return;
            }
            // alle andre operator taster
            beregn();
            switch (opid) {
                case 'opAC':
                    inpDisplay.value = "0.0";
                    verdi = 0n;
                    break;
                case 'opPluss':
                    operand = "pluss";
                   
            }

        }
    }

    function beregn() {
        blinkDisplay();
        switch(operand) {
            case "pluss":
              verdi += BigInt(inpDisplay.value);
              inpDisplay.value = String(verdi);
              break;
            default:
              // merk at ErLik faller ned her
              verdi = BigInt(inpDisplay.value);
        }
        // operand = "";
        
        // dersom denne kommenteres ut kan en utføre siste operasjon 
        // på nytt med ErLik knappen - 2+2= 4, = 8 = 16 = 32 ...
        // = vil nå legge sammen siste verdi med den som er i display, disse er like
        // så vi får en dobling hver gang

        nyStart = true;
    }

    /**
     * Visuell markering av at vi starter på nytt Tall
     */
    function blinkDisplay() {
        inpDisplay.classList.add("active");
        setTimeout(() => inpDisplay.classList.remove("active"),100);
    }
}