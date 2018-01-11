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

     let btnLagre = document.getElementById("lagre");
     btnLagre.addEventListener("click", lagreData);

     function lagreData(e) {
         let land = inpLand.value;
         let region = inpRegion.value;
         let ref = database.ref("land/" + land);
         ref.set( { kortid }); 
     }
}