
class Perk {
    constructor(perks) {
        this.money = perks.money || "0";
        this.move = perks.move || "0";
        this.war = perks.war || "0";
        this.science = perks.science || "0";
    }

    render() {
        let s = `
        <ul>
          <li>Money: ${this.money}
          <li>Move: ${this.move}
          <li>War: ${this.war}
          <li>Science: ${this.science}
        </ul>
        `;
        return s;
    }
}


class Nation {
    constructor(navn, info, perk) {
        this.navn = navn;
        this.title = info.title || "Supreme";
        this.leader = info.leader || "Mr President";
        this.capital = info.capital || navn + "City";
        this.picture = info.picture || "";
        this.perk = perk || new Perk({});
    }

    render() {
        let s = `
        <ul>
          <li>Name: ${this.navn}
          <li>Leader: ${this.title} ${this.leader}
          <li>Capital: ${this.capital}
          <li>Picture: <img src="${this.picture}">
          <li>Perks: ${this.perk.render()}
        </ul>
        `;
        return s;
    }
}




function setup() {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBsSmSbBvjGwUKapak-USd6oUBnkoVE0ls",
        authDomain: "civz-7871d.firebaseapp.com",
        databaseURL: "https://civz-7871d.firebaseio.com",
        projectId: "civz-7871d",
        storageBucket: "civz-7871d.appspot.com",
        messagingSenderId: "324948067446"
    };
    firebase.initializeApp(config);
    const database = firebase.database;

    let divListe = document.querySelector("#liste");
    let ref = database().ref("nations");


    ref.once("value").
        then(function (snapshot) {
            let landene = snapshot.val();
            if (landene) {
                for (let l in landene) {
                    let info = landene[l];
                    let perk = info.perk || {};
                    let p = new Perk(perk);
                    let n = new Nation(l, info, p);
                    divListe.innerHTML += n.render();
                }

            }
        }
        );


}