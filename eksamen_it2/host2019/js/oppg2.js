// @ts-check

const g = id => document.getElementById(id);
const get = element => element.value;

function setup() {
    let selAktivitet = g("aktivitet");
    let inpVarighet = g("varighet");
    let btnBeregn = g("beregn");
    let divSvar = g("svar");
    btnBeregn.addEventListener("click", beregnForbruk);

    function beregnForbruk() {
        let intensitet = 0;
        let aktivitet = get(selAktivitet);
        let valgtIntensitet = document.querySelector("input:checked");
        if (valgtIntensitet) {
            intensitet = get(valgtIntensitet);
        }
        let varighet = get(inpVarighet);
        let forbruk = aktivitet * intensitet * varighet / 60;
        divSvar.innerHTML = `Ditt forbruk er ${forbruk.toFixed(2)} kcal`;
    }
}