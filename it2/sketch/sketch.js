// @ts-check

const g = id => document.getElementById(id);

function setup() {
  const divTools = g("tools");
  const canCanvas = g("canvas");
  const divFarger = g("farger");
  // @ts-ignore
  const ctx = canCanvas.getContext('2d');

  let farge = "blue";

  divTools.addEventListener("click", activateTool);

  function activateTool(e) {
    const t = e.target;
    if (t.title) {
      switch (t.title) {
        case "peker":
          break;
        case "firkant":
          tegnFirkant();
          break;
        case "sirkel":
          break;
        case "trekant":
          break;
        case "strek":
          break;
        case "visk":
          break;
      }
    }
  }

  function tegnFirkant() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.beginPath();
    ctx.strokeStyle = farge;
    ctx.strokeRect(200, 200,50,50);
  }
}
