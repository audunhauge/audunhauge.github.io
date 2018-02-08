function setup() {
  var flowers = [
     document.getElementById("b1"),
     document.getElementById("b2"),
     document.getElementById("b3")
  ];

  var delay = Math.random()*1000 + 3000;
  setTimeout(grow,delay);

  function grow(e) {
    var blomst = flowers.pop();
    if (blomst) {
      blomst.classList.add("spirer");
      delay = Math.random()*1000 + 300;
      setTimeout(grow,delay);
    }
  }
}