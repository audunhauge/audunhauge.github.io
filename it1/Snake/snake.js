// @ts-check


function setup() {
    let divBrett = document.getElementById("brett");

    const ruter = [];
    for (let i = 0; i < 5000; i += 1) {
        let div = document.createElement("div");
        div.className = "rute";
        divBrett.appendChild(div);
        ruter.push(div);
    }

    ruter.slice(0,100).forEach(e => e.classList.add("sneek"));
    ruter.slice(4900,5000).forEach(e => e.classList.add("sneek"));

    let food = [];
    let snake = [{ x: 50, y: 10 }];
    let h = 0;
    let speed = { x: 1, y: 0 };

    let t = (d = 1) => (h + d + snake.length) % snake.length;

    function growSnake() {
        let tail = snake[t()];
        snake.splice(t(), 0, { x: tail.x, y: tail.y });
    }

    function makeFood() {
        let x,y;
        let free = false;
        while(!free) {
            x = Math.floor(Math.random() * 100);
            y = Math.floor(Math.random() * 50);
            free = isfree({x,y});
        }
        food.push({x,y});
    }

    const isfree = ({x,y},klass="sneek") => !ruter[y*100+x].classList.contains(klass);

    function setR({ x, y}, klass="sneek" ) {
        ruter[y * 100 + x].classList.add(klass);
    }
    function clearR({ x, y}, klass="sneek") {
        ruter[y * 100 + x].classList.remove(klass);
    }
    
    makeFood();
    makeFood();

    addEventListener("keydown", styrSnake);

    function styrSnake(e) {
        switch (e.key) {
            case "ArrowUp":
                speed.x = 0;
                speed.y = -1;
                break;
            case "ArrowDown":
                speed.x = 0;
                speed.y = 1;
                break;
            case "ArrowLeft":
                speed.x = -1;
                speed.y = 0;
                break;
            case "ArrowRight":
                speed.x = 1;
                speed.y = 0;
                break;
        }
    }

    function isThisFood({x,y}) {
        return ruter[y*100+x].classList.contains("food");
    }

    function eatFood({x,y}) {
        food = food.filter(e => e.x !== x || e.y !== y);
        clearR({x,y},"food");
    }

    let timer = setInterval(gameLoop, 60);

    function gameLoop() {
        let head = snake[h];
        let tail = snake[t()];
        clearR(tail);
        tail.x = head.x + speed.x;
        tail.y = head.y + speed.y;
        if (!isfree(tail)) {
            // kollisjon self
            clearInterval(timer);
        }
        if (isThisFood(tail)) {
            eatFood(tail);
            growSnake();
            makeFood();
        }
        h = t();
        setR(tail);
        food.forEach(e => setR(e,"food"));
    }
}