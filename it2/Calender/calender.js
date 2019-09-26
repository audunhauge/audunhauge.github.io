// @ts-check

function setup() {
    let divNy = document.getElementById("ny");
    let divPy = document.getElementById("py");
    let divYear = document.getElementById("year");
    let divNm = document.getElementById("nm");
    let divPm = document.getElementById("pm");
    let divMonth = document.getElementById("month");
    let divDatoer = document.getElementById("datoer");

    let datoer = [];
    let dagerImnd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (let i = 0; i < 42; i++) {
        let div = document.createElement("div");
        div.className = "dato";
        div.innerHTML = String(i);
        divDatoer.appendChild(div);
        datoer.push(div);
    }


    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let mNavn = "Jan,Feb,Mar,Apr,Mai,Jun,Jul,Aug,September,Okt,Nov,Des".split(",");

    divNy.addEventListener("click", nextyear);
    divPy.addEventListener("click", prevyear);

    function nextyear() {
        year += 1;
        divYear.innerHTML = String(year);
    }

    function prevyear() {
        year -= 1;
        divYear.innerHTML = String(year);
    }

    divNm.addEventListener("click", nextmonth);
    divPm.addEventListener("click", prevmonth);

    function nextyear() {
        year += 1;
        visCalender();
    }

    function prevyear() {
        year -= 1;
        visCalender();
    }

    function nextmonth() {
        month += 1;
        if (month > 12) {
            month = 1;
            nextyear();
        }
        visCalender();
    }

    function prevmonth() {
        month -= 1;
        if (month < 1) {
            month = 12;
            prevyear();
        }
        visCalender();
    }

    function visCalender() {
        let monthStart = new Date(`${month}.1.${year}`);
        let start = (monthStart.getDay() + 6) % 7;
        divMonth.innerHTML = mNavn[month - 1];
        divYear.innerHTML = String(year);
        for (let i = 0; i < 42; i++) {
            let div = datoer[i];
            div.classList.add("hidden");
        }
        let siste = dagerImnd[month - 1];
        for (let i = 0 + start; i < siste + start; i++) {
            let div = datoer[i];
            div.classList.remove("hidden");
            div.innerHTML = String(i - start + 1);
        }
    }

    visCalender();


}