// @ts-check
function setup() {

    var config = {
        apiKey: "AIzaSyBsSmSbBvjGwUKapak-USd6oUBnkoVE0ls",
        authDomain: "civz-7871d.firebaseapp.com",
        databaseURL: "https://civz-7871d.firebaseio.com",
        projectId: "civz-7871d",
        storageBucket: "",
        messagingSenderId: "324948067446"
    };
    firebase.initializeApp(config);


    let btnLogin = document.getElementById("login");
    btnLogin.addEventListener("click", login);

    function login() {
        window.location.href = "login.html";
    }

    if (firebase.auth().currentUser) {
        // bruker er logga inn
       let liPrivat = document.getElementById("privat");
       liPrivat.innerHTML ='<a href="privat.html>privat</a>';
    }
}