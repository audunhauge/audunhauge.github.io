// @ts-check

const fagnavn = ("Engelsk,Geografi,Historie,Kroppsøving,"
    + "Naturfag,Matematikk,NorskHovedmålSkriftlig,NorskSidemålSkriftlig,"
    + "NorskMuntlig,Religion,Samfunnsfag").split(",");

function setup() {
    let fellesfag = Array.from(document.querySelectorAll("div.felles input"));
    let programfag = Array.from(document.querySelectorAll("div.programfag input"));
    let eksamen = Array.from(document.querySelectorAll("div.eksamen input"));


    let divOppsummering = document.getElementById("oppsummering");
    let divSortert = document.getElementById("sortert");
    let divPoeng = document.getElementById("poeng");
    let frmRegistrer = document.getElementById("registrer");


    frmRegistrer.addEventListener("change", visOppsummering);


    function visOppsummering(e) {
        let karakterliste = [];
        let innhold = "<h4>Felles</h4>";
        let farge = "blue";
        for (let i = 0; i < fellesfag.length; i++) {
            let inpFag = fellesfag[i];
            sjekkVerdi(inpFag);
            let karakter = Number(inpFag.value) || 0;
            let fag = fagnavn[i];
            innhold += `<div class="felles"> ${fag} : ${karakter} </div>`;
            karakterliste.push({ fag, karakter, farge });
        }
        innhold += "<h4>Programfag</h4>";
        farge = "green";
        for (let i = 0; i < programfag.length; i += 2) {
            let fag = programfag[i].value;
            if (fag === "") continue;
            sjekkVerdi(programfag[i + 1]);
            let karakter = Number(programfag[i + 1].value) || 0;
            innhold += `<div class="programfag"> ${fag} : ${karakter} </div>`;
            karakterliste.push({ fag, karakter, farge });
        }
        innhold += "<h4>Eksamen</h4>";
        farge = "red";
        for (let i = 0; i < eksamen.length; i += 2) {
            let fag = eksamen[i].value;
            if (fag === "") continue;
            sjekkVerdi(eksamen[i + 1]);
            let karakter = Number(eksamen[i + 1].value) || 0;
            innhold += `<div class="eksamen"> ${fag} : ${karakter} </div>`;
            karakterliste.push({ fag, karakter, farge });
        }
        divOppsummering.innerHTML = innhold;

        // fjerner ugyldige karakterer
        let gyldig = karakterliste.filter(e => e.karakter >= 1 && e.karakter <= 6);
        gyldig.sort((a, b) => b.karakter - a.karakter);
        let sortert = gyldig.map(e => `
          <tr style="color:${e.farge}">
            <td>${e.fag}</td><td>${e.karakter}</td>
          </tr>
        `);
        divSortert.innerHTML = `<table>${sortert.join("")}</table>`;
        divPoeng.innerHTML = "";  // fjern gammelt
        let sum = gyldig.reduce((s, v) => s + v.karakter, 0);
        if (sum > 0) {
            let snitt = sum / gyldig.length;
            let poeng = snitt * 10;
            divPoeng.innerHTML = "Du fikk " + poeng.toFixed(2) + " poeng";
        }
    }

}

/**
 * Sjekker at innhold i inp er tom eller heltall 1..6
 * @param {Element} inp input som skal sjekkes
 */
function sjekkVerdi(inp) {
    inp.classList.remove("feil");
    if (inp.value === "") return;
    let v = Number(inp.value) || 0;
    if (v > 0 && v < 7 && v % 1 === 0) return;
    inp.classList.add("feil");
}