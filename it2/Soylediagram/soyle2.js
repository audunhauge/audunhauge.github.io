// @ts-check

function tegnDivs() {
    let divGrafikk = document.getElementById("grafikk2");
    for (let i = 0; i < data.length; i++) {
        let soyle = data[i];
        let divSoyle = document.createElement("div");
        divSoyle.className = "soyle";
        divSoyle.style.transform  = `translate(${80 + i * 30},0)`;  
        divSoyle.style.height = (soyle.value) + "px";
        divSoyle.style.backgroundColor = soyle.farge || "lightblue";
        divSoyle.innerHTML = '<span>' + (soyle.label || soyle.value) + '</span>';
        divGrafikk.appendChild(divSoyle);
    }
}