// @ts-check

function setup() {
    let selLand = document.getElementById("land");
    let inpYear = document.getElementById("year");
    selLand.addEventListener("change", getData);

    function getData() {
        let land = selLand.value;
        let year = inpYear.value;
        let url = `http://api.population.io/1.0/population/${year}/${land}/?format=json`;
        fetch(url).then(r => r.json())
            .then(data => behandle(data))
            .catch(e => console.log("Dette virka ikke."))
    }
}

function behandle(data) {
    let divMain = document.getElementById("main");
    data.reverse().forEach(element => {
        let m = document.createElement("div");
        m.className = "soyle";
        m.style.width = (element.males / 2000) + "px";
        m.style.left = (600 - element.males / 2000) + "px";
        divMain.appendChild(m);
        let f = document.createElement("div");
        f.className = "soyle fem";
        f.style.width = (element.females / 2000) + "px";
        f.style.left = (element.males / 2000) + "px";
        m.appendChild(f);
    });
}