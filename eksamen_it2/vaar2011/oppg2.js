function setup() {
    document.getElementById("beregn").addEventListener("click", beregn);

    function beregn(e) {
        let aar1 = document.getElementById("aar1").valueAsNumber;
        let aar2 = document.getElementById("aar2").valueAsNumber;
        let mm1 = document.getElementById("mm1").valueAsNumber;
        let mm2 = document.getElementById("mm2").valueAsNumber;

        let diff = mm2 - mm1;
        let prosent = 100 * diff / mm1;
        document.getElementById("resultat").innerHTML = `
           Økningen er på ${diff}, tilsvarer ${prosent.toFixed(2)} %
        `;
    }
}