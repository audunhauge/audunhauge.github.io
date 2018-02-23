


function setup() {
    



    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreFirebase);
    let btnLese = document.getElementById("lese");
    btnLese.addEventListener("click", lesFirebase);

    function lagreFirebase() {
        let ref = firebase.database().ref("mavoTest");
        let data = {};
        try {
            data = JSON.parse(localStorage.getItem("mavoTest"));
        } catch (error) {
            console.log(error.message);
        }
        ref.set(data);
    }

    function lesFirebase() {
        firebase.database().ref('mavoTest').once('value').then(function (snapshot) {
            let data;
            try {
                data = JSON.stringify(snapshot.val());    
            } catch (error) {
                data = "";
            }
            localStorage.setItem("mavoTest", data);
            document.location = "/";
        });
    }

}