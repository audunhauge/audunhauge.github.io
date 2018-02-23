function setup() {
    let divFig1 = document.querySelector("#fig1");
    let divBoks = document.querySelector("#boks1");
    let divBoks2 = document.getElementById("boks2");

    let moveFrames = [
        { left: "0vw" },
        { left: "600px" }
    ];
    let moveSettings = {
        duration: 3000,
        iterations: 1,
        fill: "forwards"
    }

    let move = divFig1.animate(moveFrames, moveSettings);

    let stepFrames = [
        { backgroundPositionX: "0px" },
        { backgroundPositionX: "-894px" }
    ];
    let stepSettings = {
        duration: 600,
        iterations: Infinity,
        easing: "steps(8)"
    }
    let step = divFig1.animate(stepFrames, stepSettings);

    move.onfinish = ferdigMove;

    let bend, lift;

    function ferdigMove(e) {
        step.cancel();
        divFig1.style.backgroundPositionY = "calc( -112px * 8 - 12px  )";
        stepSettings.iterations = 1;
        stepSettings.duration = 2200;
        bend = divFig1.animate(stepFrames, stepSettings);

        let liftFrames = [
            { top: "calc(100% - 60px)" },
            { top: "calc(100% - 100px)" }
        ];
        let liftSettings = {
            duration: 2200,
            delay: 1200,
            iterations: 1,
            fill: "forwards",
            easing: "ease-out"
        }
        lift = divBoks.animate(liftFrames, liftSettings);
        lift.onfinish = gaaTilbake;
    }

    function gaaTilbake() {
        //divBoks.parentNode.removeChild(divBoks);
        divBoks.style.opacity = 0;
        divBoks2.style.opacity = 1;
        divFig1.style.transform = "scaleX(-1)";
        setTimeout(() => {
            divFig1.style.backgroundPositionY = "calc( -112px * 6 - 12px  )";
            divFig1.style.transition = "none";
            divFig1.style.transform = "scaleX(1)";
            divBoks2.style.left = "20px";
            step.play();
            move.onfinish = putDownBox;
            move.playbackRate = -1;
            move.play();
        }, 1000);
    }

    function putDownBox() {
        step.cancel();
        divBoks2.style.opacity = "0";
        divFig1.style.transform = "scaleX(-1)";
        divFig1.style.backgroundPositionY = "calc( -112px * 8 - 12px  )";
        bend.play();
        divBoks.style.opacity = 1;
        divBoks.style.left = "10px";
        lift.playbackRate = -2;
        lift.play();
        lift.onfinish = endAll;
    }

    function endAll() {
        lift.cancel();
        move.cancel();
        bend.cancel();
    }

}