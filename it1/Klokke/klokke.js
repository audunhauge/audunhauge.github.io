// @ f low

function setup() {
  let divKlokke = document.getElementById("klokke");
  let tall = Array(12).fill(1);
  let rot = 0;
  for (let t of tall) {
    let div = document.createElement("div");
    div.className = "tall";
    div.style.transform = `rotate(${rot}deg)`;
    rot += 30;
    divKlokke.appendChild(div);
  }
}
