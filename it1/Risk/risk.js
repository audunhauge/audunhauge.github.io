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
      let land = database.ref("land");
      land.on("child_added", visLand)
}

function visLand(snapshot) {
    let land = snapshot.key;
    let divMain = document.getElementById("main");
    divMain.innerHTML += `<div>${land}</div>`
}