// @ts-check

const monthNames = new Map();
monthNames.set(1, "Januar");
monthNames.set(2, "Februar");
monthNames.set(3, "Mars");
monthNames.set(4, "April");
monthNames.set(5, "May");
monthNames.set(6, "Juni");
monthNames.set(7, "July");
monthNames.set(8, "August");
monthNames.set(9, "September");
monthNames.set(10, "Oktober");
monthNames.set(11, "November");
monthNames.set(12, "Desember");

const monthLength = new Map();
monthLength.set(1, 31);
monthLength.set(2, 28);
monthLength.set(3, 31);
monthLength.set(4, 30);
monthLength.set(5, 31);
monthLength.set(6, 30);
monthLength.set(7, 31);
monthLength.set(8, 31);
monthLength.set(9, 30);
monthLength.set(10, 31);
monthLength.set(11, 30);
monthLength.set(12, 31);


const fridagerCache = {};

function fridager(year, month, offset, divListe) {
    if (!fridagerCache[year]) {
        let url = "https://webapi.no/api/v1/holydays/" + year;
        fetch(url).then(r => r.json())
            .then(data => { fridagerCache[year] = data.data; lesFridager(data.data) })
            .catch(e => console.log(e.message, "Dette virka ikke."));
    } else {
        lesFridager(fridagerCache[year]);
    }

    function lesFridager(info) {
        let datoer = info.map(e => ({ date: e.date.split("T")[0].split("-"), txt: e.description }));
        datoer.filter(e => e.date[1] == month).forEach(e => {
            let d = Number(e.date[2]);
            let t = e.txt;
            let div = divListe[d + offset - 1];
            div.title = t;
            div.classList.add("fri");
        });
    }
}


function setup() {
    let divYear = document.getElementById("year");
    let divMonth = document.getElementById("month");

    let divDagene = Array.from(document.querySelectorAll("#dagene > div"));

    let divNextY = document.getElementById("nexty");
    let divPrevY = document.getElementById("prevy");
    divPrevY.addEventListener("click", prevY);
    divNextY.addEventListener("click", nextY);
    let divNextM = document.getElementById("nextm");
    let divPrevM = document.getElementById("prevm");
    divPrevM.addEventListener("click", prevM);
    divNextM.addEventListener("click", nextM);

    function prevY() {
        year--;
        show();
    }
    function nextY() {
        year++;
        show();
    }
    function prevM() {
        if (month < 2) {
            year--;
            month = 13;
        }
        month--;
        show();
    }
    function nextM() {
        if (month > 11) {
            year++;
            month = 0;
        }
        month++;
        show();
    }

    let startYear, startMonth, startDay;
    let year, month, day;


    start();
    show();

    function start() {
        let now = new Date();
        year = startYear = now.getFullYear();
        month = startMonth = now.getMonth() + 1;
        day = startDay = now.getDate();

    }

    function show() {
        divYear.innerHTML = String(year);
        divMonth.innerHTML = monthNames.get(month);
        let antallDager = monthLength.get(month) + skudd(year, month);

        let thisDate = new Date(year, month - 1, 1);
        let offset = (thisDate.getDay() + 6) % 7;

        // fjern tidligere effekter
        for (let i = 0; i < 42; i++) {
            let dag = divDagene[i];
            dag.innerHTML = "";
            dag.classList.remove("merk", "fri");
            dag.title = "";
        }

        for (let i = 0; i < antallDager; i++) {
            let dag = divDagene[i + offset];
            dag.innerHTML = String(i + 1);
        }

        if (year === startYear && month === startMonth) {
            let idag = divDagene[day + offset - 1];
            idag.classList.add("merk");
        }

        fridager(year, month, offset, divDagene);

    }
}


function skudd(y, m) {
    if (m !== 2) return 0;
    if (y % 400 === 0) return 1;
    if (y % 100 === 0) return 0;
    if (y % 4 === 0) return 1;
    return 0;
}