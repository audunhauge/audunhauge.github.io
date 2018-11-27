// @ts-check

function setup() {
    let divYear = document.getElementById("year");
    let divMonth = document.getElementById("month");
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
    let year;
    let month;
    let day;
    start();
    show();
    function start() {
        year = 2018;
        month = 11;
        day = 28;
    }
    function show() {
        divYear.innerHTML = String(year);
        divMonth.innerHTML = String(month);
    }
}