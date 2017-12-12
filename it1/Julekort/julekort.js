function setup() {
    let divSky = document.getElementById("sky");
    let divSanta = document.getElementById("santa");
    let stars = divSky.querySelectorAll(".star");
    stars.forEach(stjerne => {
        stjerne.style.left = -120 + Math.floor(Math.random() * 240) + "px";
        stjerne.style.top = -80 + Math.floor(Math.random() * 160) + "px";
    });

    divSanta.addEventListener("click" , dropGifts);

    function dropGifts(e) {
        let pakke = document.createElement('div');
        pakke.className = "pakke";
        pakke.style.left = e.screenX + "px";
        pakke.style.top = (e.screenY - 50) + "px";
        divSky.appendChild(pakke);
    }
}