// @ts-check


function setup() {
    let land = "Norway";  // selLand.value;
    let year = "1990";    //inpYear.value;
    let url = `http://api.population.io/1.0/population/${year}/${land}/?format=json`;
    fetch(url).then(r => r.json())
        .then(data => behandle(data))
        .catch(e => console.log("Dette virka ikke."));

    function behandle(data) {
        console.log(data);
    }
}

