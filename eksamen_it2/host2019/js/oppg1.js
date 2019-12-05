// @ts-check

function setup() {
    let audioList = Array.from(document.querySelectorAll("audio"));
    let divKropp = document.getElementById("kropp");

    const lyder = new Map();  // map fra id til audio
    audioList.forEach(e => {
        // 
        let divId = e.id.replace("lyd","");
        lyder.set(divId,e);
    })
   
    divKropp.addEventListener("click",muskelAnimasjon);

    function muskelAnimasjon(e) {
        let t = e.target;
        if (t.className.includes("muskel")) {
            // klikk på muskel
            let id = t.id;
            if (lyder.has(id)) {
                lyder.get(id).play();
                t.classList.add("animert");
                setTimeout(() => {
                    t.classList.remove("animert");
                }, 5000);
            }
        }
    }
}