var justNow = new Date();     // assumed constant for duration of app
var monthNames = "Januar,Februar,Mars,April,May,Juni,Juli,August,September,Oktober,November,Desember".split(",");
var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

var activeDate = {         // brukes til å lagre valgt dato/mnd/aar
    d: justNow.getDate(),
    m: justNow.getMonth(),
    y: justNow.getFullYear()
}
var today = {              // dagens dato - skal markeres
    d: justNow.getDate(),
    m: justNow.getMonth(),
    y: justNow.getFullYear()
}

function visKalender() {
    var skip,antall;  // hopp over skip datoer, denne måneden har antall dager
    var i,hash;
    var divDato;
    var firstInMonth = new Date(activeDate.y,activeDate.m,1);
    removeClass(".dato","chosen");   // ellers sitter valg igjen fra forrige måned når vi blar
    removeClass(".dato","today");  
    removeClass(".dato","notat");    
    document.getElementById("tinyed").innerHTML = '';   // fjern tinyed 
    document.querySelector("#year").innerHTML = activeDate.y;
    document.querySelector("#month").innerHTML = monthNames[activeDate.m];    
    skip = (firstInMonth.getDay()+6) % 7;   // kompenserer for at usa begynner ukene på søndag
    antall = antallDager(activeDate.y,activeDate.m);
    // skjul alle datoer
    addClass(".dato","skip");
    // vis datoer med riktig tall
    for (i=0; i < antall; i++) {
        hash = "" + activeDate.y + activeDate.m +(i+1);
        divDato = document.getElementById("dd"+(i+skip));
        divDato.classList.remove("skip");
        if (localStorage[hash]) {
            divDato.classList.add("notat");
        }
        if (today.y === activeDate.y && today.m === activeDate.m && today.d === i+1) {
            divDato.classList.add("today");
        }
        divDato.innerHTML = (i+1);
    }    
}
function lagUkedager() {
    var divUkedager = document.querySelector("#ukedager");
    var dagnavn = "Ma,Ti,On,To,Fr,Lø,Sø".split(",");
    var i, dag;
    var divDag;
    for (i = 0; i < dagnavn.length; i++) {
        dag = dagnavn[i];
        divDag = document.createElement("div")
        divDag.innerHTML = dag;
        divDag.classList.add("dag");
        divUkedager.appendChild(divDag);
    }
}
function lagDatoer() {
    var i;
    var divDato;
    var divDatoer = document.querySelector("#datoer");
    for (i=0; i<42; i++) {
        divDato = document.createElement("div")
        divDato.innerHTML = (i+1);
        divDato.id ="dd"+i;
        divDato.classList.add("dato");
        divDato.addEventListener("click",datoClick);
        divDatoer.appendChild(divDato);
    }
}
 
/**
 * Responds to click on a specific date
 * @param {Event} e
 */
function datoClick(e) {
    var myself = e.target;
    
    var tinyEd = document.getElementById("tinyed");
    var tinytext;  // ingen text som default
    var hash = "" + activeDate.y + activeDate.m + myself.innerHTML;
    
    
    if (myself.classList.contains("chosen")) {
        // we clicked again on a chosen date
        // prepare to edit text
        tinytext = localStorage[hash] ? localStorage[hash] : '';
        tinyEd.innerHTML = '<textarea tabindex="5" id="tiny">' + tinytext + '</textarea>'
         + '<p><button tabindex="6" id="lagre" class="butt">Lagre</button>';
        document.getElementById("lagre").addEventListener("click",lagreText); 
        document.getElementById("tiny").focus();
    } else {
        // fjern tinyed
        tinyEd.innerHTML = '';
    }
    removeClass(".dato","chosen");  // fjerner klassen chosen fra alle datoer
    myself.classList.add("chosen"); // legg til chosen på dato som ble klikka
    
    function lagreText() {
        var txt = document.getElementById("tiny").value;
        localStorage[hash] = txt;
        if (txt === "") {
            localStorage.removeItem(hash);
        }
        document.getElementById("lagre").removeEventListener("click",lagreText);
        visKalender();
    }
}
 
function nextYear() {
    activeDate.y++;
    visKalender();
}
function prevYear() {
    activeDate.y--;
    visKalender();
}
function nextMonth() {
    activeDate.m++;
    if (activeDate.m > 11) {
        activeDate.m = 0;
        activeDate.y++;
    }
    visKalender();
}
function prevMonth() {
    activeDate.m--;
    if (activeDate.m < 0) {
        activeDate.m = 11;
        activeDate.y--;
    }
    visKalender();
}
function setup() {
    document.querySelector("#next_year").addEventListener("click", nextYear);
    document.querySelector("#prev_year").addEventListener("click", prevYear);
    document.querySelector("#next_month").addEventListener("click", nextMonth);
    document.querySelector("#prev_month").addEventListener("click", prevMonth);
    lagUkedager();
    lagDatoer();
    visKalender();
}
 
 
 
// ************* utility functions *********************
/**
 * removes class given by klass from all dom-objects matched by selector
 * @param {cssselect} selector
 * @param {string} klass
 */
function removeClass(selector,klass) {
    var items = document.querySelectorAll(selector);
    var i;
    if (items.length) {
        for (i=0; i < items.length; i++) {
            items[i].classList.remove(klass);
        }
    }
}

/**
 * adds class given by klass to all dom-objects matched by selector
 * @param {cssselect} selector
 * @param {string} klass
 */
function addClass(selector,klass) {
    var items = document.querySelectorAll(selector);
    var i;
    if (items.length) {
        for (i=0; i < items.length; i++) {
            items[i].classList.add(klass);
        }
    }
}

/**
 * Calculate number of days in a month
 * @param {int} year
 * @param {int} month
 * @return {int} antall dager i måned
 */
function antallDager(y,m) {
    
    var dager = daysInMonth[m];
    if (m === 1) {
        if (y % 400 === 0) return dager + 1;
        if (y % 100 === 0) return dager;
        if (y % 4 === 0) return dager + 1;
    }
    return dager;
}