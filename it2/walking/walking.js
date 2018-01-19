function setup() {
    let divFig1 = document.querySelector("#fig1");
    let divBoks = document.querySelector("#boks");

    let move = divFig1.animate(
        [
            { left: "0px" },
            { left: "600px" },
        ],
        {
            duration: 4000,
            iterations: 1,
            fill: "forwards"
        }
    )
    divFig1.style.backgroundPositionY = "calc( -112px * 2 - 12px  )";
    // start with walk animation from sprite-sheet

    let sprite = [
        { backgroundPositionX: "0px", offset: 0 },
        { backgroundPositionX: "-894px", offset: 1 }
    ];
    let options = {
        easing: "steps(8)",
        duration: 800,
        iterations: Infinity,
    }

    let walk = divFig1.animate(sprite, options)


    move.onfinish = (e) => {
        console.log("fine");
        // change to bend animation
        walk.pause();
        options.duration = 1200;
        options.iterations = 1;
        walk.cancel();
        let bend = divFig1.animate(sprite, options)
        divFig1.style.backgroundPositionY = "calc( -112px * 8 - 12px  )";
        let liftbox = divBoks.animate(
            [ { top: "calc(100vh - 60px)"}, {top:"calc(100vh - 110px)"}],
            { duration: 500, fill:"forwards", delay:700, easing:"ease-out"}
        )
        liftbox.onfinish = (e) => {
            divBoks.classList.add("hidden");
            divFig1.querySelector(".boks").classList.remove("hidden");
        }
    }
}