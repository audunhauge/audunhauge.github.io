// @ts-check
function setup() {
    let hoteller = {};

    let prisliste = {
        newyork: {
            Sheraton: [ 2000, 2500],
            Raddison: [ 2200, 2300],
            BigBlue: [ 1200, 1500],
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
          let byHotell = hoteller[by];
          let selHotell = document.createElement('select');
          let s = "";
          for (let hotell of byHotell) {
              s += `<option>${hotell}</option>`;
          }
          selHotell.innerHTML = s;
          divByInfo.appendChild(selHotell);
        }
       
    }
}