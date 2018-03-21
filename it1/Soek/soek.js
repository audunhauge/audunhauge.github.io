function setup() {

    var config = {
        apiKey: "AIzaSyBsSmSbBvjGwUKapak-USd6oUBnkoVE0ls",
        authDomain: "civz-7871d.firebaseapp.com",
        databaseURL: "https://civz-7871d.firebaseio.com",
        projectId: "civz-7871d",
        storageBucket: "civz-7871d.appspot.com",
        messagingSenderId: "324948067446"
    };

    firebase.initializeApp(config);

    let database = firebase.database();

    let inpFind = document.getElementById("find"); // kobling til søkefeltet
    inpFind.addEventListener("keydown", finnOrd);
    let divResultat = document.getElementById("resultat"); // kobling til div#resultat

    function finnOrd(e) {
        if (e.keyCode === 13) { // bruker trykket return
            let valgt = inpFind.value;
            let ref = firebase.database().ref("dyr").orderByChild("navn").equalTo(valgt);
            ref.once("value").then(function (snapshot) {
                let funnet = snapshot.val();
                if (funnet) {
                    // vi fant noe som matcher
                    let htm = Object.entries(funnet).map(([k,v]) => {
                      let felt = Object.entries(v).map(([k,v]) => 
                          `<li>${k} : ${v}</li>`
                      );
                      return `${k} <ul>${felt.join('')}</ul>`;
                    });
                    divResultat.innerHTML = htm;
                } else {
                    divResultat.innerHTML = "Ingen treff (sjekk stor/liten bokstav)";
                }

            });
        }
    }
}

