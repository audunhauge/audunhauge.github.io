// @ts-check

function setup() {
    let divNy = document.getElementById("ny");
    let divPy = document.getElementById("py");
    let divYear = document.getElementById("year");
    let divNm = document.getElementById("nm");
    let divPm = document.getElementById("pm");
    let divMonth = document.getElementById("month");

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
        divMonth.innerHTML = mNavn[month - 1];
        divYear.innerHTML = String(year);
    }

    visCalender();


}