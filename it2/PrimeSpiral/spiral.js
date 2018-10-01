function setup() {
  let divMain = document.getElementById("main");

  drawSpiral(divMain);
}

const LIMIT = 150000;
const W = Math.floor(Math.sqrt(LIMIT));
console.log(W);

function drawSpiral(div) {
  let n = 1,
    w = 2,
    x = 1,
    y = 0;
  while (n < LIMIT) {
    let v = w;
    while (v--) {
      let pri = prime(n++);
      div.appendChild(mkblock(x, y, pri));
      y++;
    }
    y--;
    x--;
    v = w;
    while (v--) {
      let pri = prime(n++);
      div.appendChild(mkblock(x, y, pri));
      x--;
    }
    x++;
    y--;
    v = w;
    while (v--) {
      let pri = prime(n++);
      div.appendChild(mkblock(x, y, pri));
      y--;
    }
    y++;
    x++;
    v = w;
    while (v--) {
      let pri = prime(n++);
      div.appendChild(mkblock(x, y, pri));
      x++;
    }
    w += 2;
  }
}

/**  pure functions */
/** no side effects, depend only on input, same input => same result */
function prime(n) {
  return isPrime(n) ? "a" : "b";
}

function isPrime(n) {
  // if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  // skip these tests as we can assert 1<=n<= limit < maxsafe_int
  if (n % 2 == 0) return n == 2;
  if (n % 3 == 0) return n == 3;
  var m = Math.sqrt(n);
  for (var i = 5; i <= m; i += 6) {
    if (n % i == 0) return false;
    if (n % (i + 2) == 0) return false;
  }
  return true;
}

const mkblock = (x, y, pri) => {
  const d = document.createElement("div");
  d.className = "sqr" + pri;
  d.style.top = W - 2 * y + "px";
  d.style.left = W + 2 * x + "px";
  return d;
};

/** end pure */
