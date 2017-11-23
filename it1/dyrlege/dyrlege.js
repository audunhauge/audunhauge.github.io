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

    let ref = firebase.database().ref("kunde");

    function visKunder(snapshot) {
        let kundenr = snapshot.key;
        let info = snapshot.val();
        divListe.innerHTML += `
          <div>
            <h4>Kunde nr ${kundenr}</h4>
            <ul>
             <li>${info.fornavn} ${info.etternavn}
             <li>Epost : ${info.epost}
             <li>Mobil ${info.mobil}
            </ul>
          </div>
        `;
    }
    ref.on("child_added", visKunder);

}