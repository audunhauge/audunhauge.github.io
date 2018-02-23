// @ts-check

function setup() {
    let spanYear = document.getElementById("year");
    let spanMonth = document.getElementById("month");
    let divUkedager = document.getElementById("ukedager");
    let divDatoer = document.getElementById("datoer");

    let btnNextYear = document.getElementById("nextYear");
    let btnPrevYear = document.getElementById("prevYear");
    let btnNextMonth = document.getElementById("nextMonth");
    let btnPrevMonth = document.getElementById("prevMonth");

    btnNextMonth.addEventListener("click", nextMonth);
    btnPrevMonth.addEventListener("click", prevMonth);

    let arrDato = [];

    function lagUkedager() {
        let dagNavn = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"];
        for (let d of dagNavn) {
            let kort = d.substr(0, 2);
            let div = document.createElement('div');
            div.className = "ukedag";
            div.innerHTML = kort;
            divUkedager.appendChild(div);
        }
    }

    function lagDatoer() {
        for (let d = 1; d < 43; d++) {
            let div = document.createElement('div');
            arrDato.push(div);
            div.className = "dato";
            div.innerHTML = String(d);
            divDatoer.appendChild(div);
        }
    }

    function nextMonth(e) {
        if (minDato.month < 12) {
            minDato.month++;
        } else {
            minDato.month = 1;
            minDato.year++;
        }
        visMonth(minDato);
    }

    function prevMonth(e) {
        if (minDato.month > 1) {
            minDato.month--;
        } else {
            minDato.month = 12;
            minDato.year--;
        }
        visMonth(minDato);
    }

    let minDato = {
        year: 2018,
        month: 2,
        day: 1
    };

    function visMonth(dato) {
        // trenger å vite hvilken dag 1. av denne måneden er
        let d = new Date(`${dato.year}/${dato.month}/1`);
        let start = (d.getDay() + 6) % 7;
        let mNavn = "Januar,Feb,Mar,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Des".split(",");
        let mLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        spanYear.innerHTML = String(dato.year);
        spanMonth.innerHTML = mNavn[dato.month - 1];
        let lengde = mLength[dato.month - 1];
        for (let i = 0; i < 42; i++) {
            let div = arrDato[i];
            div.className = "dato hidden";
        }
        for (let i = 0; i < lengde; i++) {
            let div = arrDato[i + start];
            div.innerHTML = String(i + 1);
            div.classList.remove("hidden");
        }
    }

    lagUkedager();
    lagDatoer();
    visMonth(minDato);
}