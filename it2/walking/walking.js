function setup() {
    let divFig1 = document.querySelector("#fig1");
    let divBoks = document.querySelector("#boks1");

    let moveFrames = [
        { left: "0vw" },
        { left: "600px" }
    ];
    let moveSettings = {
        duration: 12000,
        iterations: 1,
        fill: "forwards"
    }

    let move = divFig1.animate(moveFrames, moveSettings);

    let stepFrames = [
        { backgroundPositionX: "0px" },
        { backgroundPositionX: "-894px" } 
    ];
    let stepSettings = {
        duration: 800,
        iterations: Infinity,
        easing: "steps(8)"
    }
    let step = divFig1.animate(stepFrames, stepSettings);

    move.onfinish = ferdigMove;

    function ferdigMove(e) {
        step.cancel();
        divFig1.style.backgroundPositionY =  "calc( -112px * 8 - 12px  )";
        stepSettings.iterations = 1;
        stepSettings.duration = 2200;
        let bend = divFig1.animate(stepFrames, stepSettings);
        bend.play();

        let liftFrames = [
            { top: "calc(100vh - 60px)" },
            { top: "calc(100vh - 100px)" } 
        ];
        let liftSettings = {
            duration: 2200,
            delay: 1200,
            iterations: 1,
            fill: "forwards",
            easing: "ease-out"
        }
        let lift = divBoks.animate(liftFrames, liftSettings);
        lift.onfinish = gaaTilbake;
    }

    function gaaTilbake() {
        divBoks.parentNode.removeChild(divBoks);
        let divBoks2 = document.getElementById("boks2");
        divBoks2.style.opacity = 1;
        divFig1.style.transform = "scaleX(-1)";
        divFig1.style.backgroundPositionY =  "calc( -112px * 6 - 12px  )";
        divFig1.style.transition = "none";
        divFig1.style.transform = "scaleX(1)";
        divBoks2.style.left = "20px";
        step.play();
        move.playbackRate = -1;
        move.play();

    }

}