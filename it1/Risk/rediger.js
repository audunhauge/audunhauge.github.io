function setup() {
    var config = {
        apiKey: "AIzaSyBlPjI5glXQ6ilEg9EVVPQS1lFh_Bsfa7c",
        authDomain: "risk-b1fc9.firebaseapp.com",
        databaseURL: "https://risk-b1fc9.firebaseio.com",
        projectId: "risk-b1fc9",
        storageBucket: "",
        messagingSenderId: "217937368827"
    };
    firebase.initializeApp(config);

    let database = firebase.database();

    let inpLand = document.getElementById("land");
    let inpRegion = document.getElementById("region");

    let btnLagreLand = document.getElementById("lagreland");
    btnLagreLand.addEventListener("click", lagreLand);

    let inpKort = document.getElementById("kort");
    let inpAntallNye = document.getElementById("antallnye");

    let btnLagreKort = document.getElementById("lagrekort");
    btnLagreKort.addEventListener("click", lagreKort);

    function lagreLand(e) {
        let land = inpLand.value;
        let kortid = inpRegion.value;
        let ref = database.ref("land/" + land);
        ref.set({ kortid });
    }

    function lagreKort(e) {
        let kort = inpKort.value;
        let antallnye = inpAntallNye.value;
        let ref = database.ref("kort/" + kort);
        ref.set({ antallnye });
    }


}