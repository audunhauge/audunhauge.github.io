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

    newRobotz(10);
    putRobotz();

    

    function newRobotz(n) {
        for (let i = 0; i < n; i++) {
            let div = document.createElement("div");
            div.className = "robot ting";
            let robot = new Ting(div, 0, 0);
            divBrett.append(div);
            robotz.push(robot);
        }
    }

    function putRobotz() {
        for (let robot of robotz) {
            let ledig = false;
            let x, y;
            while (!ledig) {
                x = Math.trunc(Math.random() * 40) + 10;
                y = Math.trunc(Math.random() * 40) + 10;
                ledig = ruter[x][y] === 0;
            }
            robot.div.className = "robot ting";
            robot.x = x;
            robot.y = y;
            robot.alive = true;
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
                break;
            case "d":
                player.x += 1;
                gyldig = true;
                break;
            case "a":
                player.x -= 1;
                gyldig = true;
                break;
            case "q":
                player.x -= 1;
                player.y -= 1;
                gyldig = true;
                break;
            case "e":
                player.x += 1;
                player.y -= 1;
                gyldig = true;
                break;
            case "w":
                player.y -= 1;
                gyldig = true;
                break;
            case "s":
                player.y += 1;
                gyldig = true;
                break;
            case "z":
                player.x -= 1;
                player.y += 1;
                gyldig = true;
                break;
            case "x":
                player.x += 1;
                player.y += 1;
                gyldig = true;
                break;
        }
        player.x = (player.x + 60) % 60;
        player.y = (player.y + 60) % 60;
        ruter[player.x][player.y] = 2;
        player.render();
        if (gyldig) {
            flyttRobotz();
            if (alleErFinito(robotz) ) {
                alert("level won");
                newRobotz(5);
                putRobotz();
                plasserSpiller();
            } 
        }
    }

    function alleErFinito(a) {
       return ! a.some(e => e.alive);
    }

    function flyttRobotz() {
        for (let robot of robotz) {
            if (robot.alive) {
                ruter[robot.x][robot.y] = 0;
                let dx = Math.sign(robot.x - player.x);
                let dy = Math.sign(robot.y - player.y);
                if (ruter[robot.x - dx][robot.y - dy] !== 0) {
                    if (ruter[robot.x - dx][robot.y - dy] === 2) {
                        alert("jo dead");
                    }
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