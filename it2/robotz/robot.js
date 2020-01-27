// @ts-check




class Ting {
    constructor(div, x, y) {
        this.x = x;
        this.y = y;
        this.div = div;
        this.alive = true;
    }
    render() {
        this.div.style.transform = `translate( ${this.x * 10}px, ${this.y * 10}px)`;
    }
}

const ruter = [];
const robotz = [];

function $(id) { return document.getElementById(id) }


function setup() {
    const divBrett = $("brett");
    for (let i = 0; i < 60; i++) {
        ruter.push([]);
        for (let j = 0; j < 60; j++) {
            ruter[i].push(0);
        }
    }

    function plasserSpiller() {
        let ledig = false;
        let x, y;
        while (!ledig) {
            x = Math.trunc(Math.random() * 40) + 10;
            y = Math.trunc(Math.random() * 40) + 10;
            ledig = ruter[x][y] === 0;
        }
        player.x = x;
        player.y = y;
        player.render();
    }

    let player = new Ting($("player"), 0, 0);
    plasserSpiller();


    putRobotz();

    function putRobotz() {
        for (let i = 0; i < 10; i++) {
            let x = Math.trunc(Math.random() * 60);
            let y = Math.trunc(Math.random() * 60);
            let div = document.createElement("div");
            div.className = "robot ting";
            let robot = new Ting(div, x, y);
            divBrett.append(div);
            robotz.push(robot);
            robot.render();
        }
    }
    document.addEventListener("keydown", flyttSpiller);

    function flyttSpiller(e) {
        ruter[player.x][player.y] = 0;
        let gyldig = false;
        switch (e.key) {
            case "t":
                plasserSpiller();
                player.render();
                break;
            case "d":
                player.x += 1;
                gyldig = true;
                player.render();
                break;
            case "a":
                player.x -= 1;
                player.render();
                gyldig = true;
                break;
            case "q":
                player.x -= 1;
                player.y -= 1;
                player.render();
                gyldig = true;
                break;
            case "e":
                player.x += 1;
                player.y -= 1;
                player.render();
                gyldig = true;
                break;
            case "w":
                player.y -= 1;
                player.render();
                gyldig = true;
                break;
            case "s":
                player.y += 1;
                player.render();
                gyldig = true;
                break;
            case "z":
                player.x -= 1;
                player.y += 1;
                player.render();
                gyldig = true;
                break;
            case "x":
                player.x += 1;
                player.y += 1;
                player.render();
                gyldig = true;
                break;
        }
        ruter[player.x][player.y] = 2;
        if (gyldig) {
            flyttRobotz();
            if (alleErFinito(robotz) ) {
                alert("game won");
            } 
        }
    }

    function alleErFinito(a) {
        for (let r of a) {
            if (r.alive) return false;
        }
        return true;
    }

    function flyttRobotz() {
        for (let robot of robotz) {
            if (robot.alive) {
                ruter[robot.x][robot.y] = 0;
                let dx = Math.sign(robot.x - player.x);
                let dy = Math.sign(robot.y - player.y);
                if (ruter[robot.x - dx][robot.y - dy] !== 0) {
                    robot.alive = false;
                    robot.div.className = "dead ting";
                    ruter[robot.x][robot.y] = 3;
                } else {
                    robot.x -= dx;
                    robot.y -= dy;
                    robot.render();
                    ruter[robot.x][robot.y] = 1;
                }
            }
        }
    }
}