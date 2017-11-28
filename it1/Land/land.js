function setup() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBsSmSbBvjGwUKapak-USd6oUBnkoVE0ls",
        authDomain: "civz-7871d.firebaseapp.com",
        databaseURL: "https://civz-7871d.firebaseio.com",
        projectId: "civz-7871d",
        storageBucket: "civz-7871d.appspot.com",
        messagingSenderId: "324948067446"
      };
    firebase.initializeApp(config);
    let divListe = document.getElementById("liste");
    let ref = firebase.database().ref("nations");

    function visLand(snapshot) {
        let navn = snapshot.key;
        let info = snapshot.val();
        divListe.innerHTML += `
          <div>
            <h4>${navn}</h4>
            <ul>
             <li>Capital ${info.capital}
             <li>${info.title} ${info.leader}
             <li> Perks
                <ul>
                    <li> Money: ${info.perk.money}
                    <li> Move: ${info.perk.move}
                    <li> War: ${info.perk.war}
                    <li> Science: ${info.perk.science}
                </ul>
            </ul>
          </div>
        `;
    }
    ref.on("child_added", visLand);

}