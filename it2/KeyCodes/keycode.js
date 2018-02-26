// @ts-check



// Her bruker jeg promise (et løfte om å gi en verdi)
// slik at jeg gjør om en eventlistener til en funksjon
// som stopper og venter på et tastetrykk
function getKeyCode() {
    return new Promise(resolve =>
        document.addEventListener('keydown', (event) => {
            resolve(event.keyCode);
        }
        ));
}

// funksjonen må være async for å kunne bruke await
// dvs denne funksjonen tar en kaffepause og venter på at
// getKeyCode skal hoste opp en keyCode (som venter på at bruker skal trykke ...)
async function setup() {
    let divCode = document.getElementById("code");
    let k = 0;
    while (k != 32) {
        k = await getKeyCode();  // her tar koden pause helt til vi får en keyCode
        divCode.innerHTML = "Koden er " + k;
    }
    divCode.innerHTML = "Du har avslutta økten";
}