// @ts-check


function setup() {
    let poeng = 0;

    let divBrett = document.getElementById("brett");
    let homebar = document.querySelector("home-bar");

    if (homebar) {
        homebar.setAttribute("info", "0 poeng");
        homebar.setAttribute("menu",
            `<i class="material-icons">menu</i>
    <ul>
      <li>Omstart
      <li>ChildeMode
    </ul>
    `)
        homebar.addEventListener("menu", menuHandler);
    }

    function menuHandler(e) {
        let info = homebar.info;
        let text = info.target.innerHTML.trim().toLowerCase();
        if (text) {
            if (text === "omstart") {
               startSpillet();
            }
        }
    }

    const ruter = [];
    for (let i = 0; i < 5000; i += 1) {
        let div = document.createElement("div");
        div.className = "rute";
        divBrett.appendChild(div);
        ruter.push(div);
    }

   

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
        let x, y;
        let free = false;
        while (!free) {
            x = Math.floor(Math.random() * 100);
            y = Math.floor(Math.random() * 50);
            free = isfree({ x, y });
        }
        food.push({ x, y });
    }

    const isfree = ({ x, y }, klass = "sneek") => !ruter[y * 100 + x].classList.contains(klass);

    function setR({ x, y }, klass = "sneek") {
        ruter[y * 100 + x].classList.add(klass);
    }
    function clearR({ x, y }, klass = "sneek") {
        ruter[y * 100 + x].classList.remove(klass);
    }

    function startSpillet() {
        poeng = 0;
        food = [];
        snake = [{ x: 50, y: 10 }];
        h = 0;
        speed = { x: 1, y: 0 };
        makeFood();
        makeFood();
        ruter.forEach( e => {
            e.className = "rute";
        })
        ruter.slice(0, 100).forEach(e => e.classList.add("sneek"));
        ruter.slice(4900, 5000).forEach(e => e.classList.add("sneek"));
    }

    startSpillet();

    

    addEventListener("keydown", styrSnake);

    function styrSnake(e) {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                speed.x = 0;
                speed.y = -1;
                break;
            case "s":
            case "ArrowDown":
                speed.x = 0;
                speed.y = 1;
                break;
            case "a":
            case "ArrowLeft":
                speed.x = -1;
                speed.y = 0;
                break;
            case "d":
            case "ArrowRight":
                speed.x = 1;
                speed.y = 0;
                break;
        }
    }

    function isThisFood({ x, y }) {
        return ruter[y * 100 + x].classList.contains("food");
    }

    function eatFood({ x, y }) {
        food = food.filter(e => e.x !== x || e.y !== y);
        clearR({ x, y }, "food");
    }


    // her settes intervallet mellom hver gang snaken flytter seg
    // tiden er i ms
    let timer = setInterval(gameLoop, 80);



    function gameLoop() {
        let head = snake[h];
        let tail = snake[t()];
        clearR(tail);
        tail.x = head.x + speed.x;
        tail.y = head.y + speed.y;
        if (!isfree(tail)) {
            // kollisjon self
            clearInterval(timer);
            homebar.setAttribute("username", "Game over");
        }
        if (isThisFood(tail)) {
            eatFood(tail);
            growSnake();
            makeFood();
            poeng += 1;
            if (homebar) {
                homebar.setAttribute("info", poeng + " poeng");
            }
        }
        h = t();
        setR(tail);
        food.forEach(e => setR(e, "food"));
    }
}