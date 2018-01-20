// @ts-check
function setup() {
    let hoteller = {};

    let prisliste = {
        newyork: {
            Sheraton: [2000, 2500],
            Raddison: [2200, 2300],
            BigBlue: [1200, 1500],
        }
    }
    // enkeltrom = prisliste["newyork"]["Sheraton"][0]
    // dobbeltrom = prisliste["newyork"]["Sheraton"][1]

    hoteller.newyork = "Sheraton,Raddison,BigBlue".split(",");
    hoteller.roma = "Hilton,Sheraton,Eaton".split(",");

    let selBy = document.getElementById("by");
    let divByInfo = document.getElementById("byinfo");

    selBy.addEventListener("change", valgtBy);

    function valgtBy(e) {
        // @ts-ignore 
        let by = selBy.value;
        divByInfo.innerHTML = "";
        if (hoteller[by]) {
            bestilling(by)
        } else {
            divByInfo.innerHTML = "Ingen info ennå ... ";
        }

    }

    function bestilling(by) {
        let enkelt, dobbelt;  // husk prisen for rom - endres ved valg av hotell
        let byHotell = hoteller[by];
        let selHotell = document.createElement('select');
        let s = "<option>.. velg hotell ..</option>";
        for (let hotell of byHotell) {
            s += `<option>${hotell}</option>`;
        }
        let divSkjema = document.createElement('div');
        divSkjema.innerHTML = `
        <form>
        <br>Antall enkeltrom 
          <input id="antall1" min="0" max="20" type="number"> <span></span>kr
        <br>Antall dobbeltrom 
          <input id="antall2" min="0" max="20" type="number"> <span></span>kr
        <br>Bypass <input id="pass" type="checkbox">
        <p><button type="button">Bestill</button></p>
        </form>
        <div>Totalt <span>.</span> kr</div>
        `;
        selHotell.innerHTML = s;
        divByInfo.appendChild(divSkjema);
        divByInfo.insertBefore(selHotell, divSkjema);
        selHotell.addEventListener("change", hotellpris);
        divSkjema.querySelector("button").addEventListener("click", visPris);

        function hotellpris() {
            let hotell = selHotell.value;
            if (hotell.charAt(0) !== ".") {
                // gyldig hotell
                [enkelt, dobbelt] = prisliste[by][hotell];
                divSkjema.querySelector("span:nth-of-type(1)").innerHTML = enkelt;
                divSkjema.querySelector("span:nth-of-type(2)").innerHTML = dobbelt;
                visPris();
            }
        }

        function visPris() {
            let antall2 = document.getElementById("antall2").valueAsNumber;
            let antall1 = document.getElementById("antall1").valueAsNumber;
            let pass = document.getElementById("pass").checked ? 1 : 0;
            
            if (antall1>0 && enkelt || antall2>0 && dobbelt) {
                // nok info til å beregne pris
                let pris = antall1 * enkelt + antall2 * dobbelt + 700 * pass;
                divSkjema.querySelector("div > span").innerHTML = String(pris);
            }
        }

    }
}