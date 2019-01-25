// @ts-check
class PieChart extends HTMLElement {
    constructor() {
        super();
        let width = 250;
        let height = 250;
        this._root = this.attachShadow({ mode: "open" });
        this.redraw();
    }
    redraw() {
        let a = this.getAttribute("width");
        let b = this.getAttribute("height");
        let width =  a || b || 250;
        let height =  b || a || 250;
        let heading = this.getAttribute("heading") || "PieChart";
        let inner = `
        <div id="pie">
          <div id="heading">${heading}</div>
          <canvas id="paper" width=${width} height=${height}></canvas>
        </div>
        <style>
          #heading {
              font-size: 1.2em;
              width: ${width}px;
              text-align:center;
              color: blue;
          }
          #paper {
              width: ${width}px;
              height: ${height}px;
          }
        </style>
        `;
        this._root.innerHTML = inner;
    }
    init(data) {
        // data = [ {label,color,value}, ... ]
        let colors = data.map((e,i) => e.color || (["red","green","blue","teal","coral","beige"])[i % 6]);
        let labels = data.map(e => e.label || e.value);
        let values = data.map(e => +e.value);
        let sum = values.reduce((m, v) => m + v, 0);
        values = values.map(e => 360 * e / sum);
        const canvas = this._root.querySelector("#paper");
        // @ts-ignore
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        for (let i = 0; i < data.length; i++) {
            // tegner ett kakesegment for hvert datasett
            this.drawSegment(canvas, ctx, { values, colors, labels, i });
        }
    }
    static get observedAttributes() {
        return ["heading", "width", "height"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "heading") {
            this._root.querySelector("#" + name).innerHTML = newValue;
        } else {
            this.redraw();
        }
    }
    drawSegment(canvas, context, { values, colors, labels, i }) {
        context.save();
        const sumTo = (data, i) => data.slice(0, i).reduce((s, v) => s + v, 0);
        const d2r = deg => (deg * Math.PI) / 180;
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        let radius = Math.floor(canvas.width / 2);
        var startingAngle = d2r(sumTo(values, i));
        var arcSize = d2r(values[i]);
        var endingAngle = startingAngle + arcSize;
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();
        context.fillStyle = colors[i];
        context.fill();
        context.restore();
        drawSegmentLabel(canvas, context, values, labels, i);
        function drawSegmentLabel(canvas, context, data, labels, i) {
            context.save();
            var x = Math.floor(canvas.width / 2);
            var y = Math.floor(canvas.height / 2);
            var angle = d2r(sumTo(data, i));
            context.translate(x, y);
            context.rotate(angle);
            var dx = Math.floor(canvas.width * 0.5) - 10;
            var dy = Math.floor(canvas.height * 0.05);
            context.textAlign = "right";
            var fontSize = Math.floor(canvas.height / 25);
            context.font = fontSize + "pt Helvetica";
            context.fillText(labels[i], dx, dy);
            context.restore();
        }
    }
}
window.customElements.define("pie-chart", PieChart);