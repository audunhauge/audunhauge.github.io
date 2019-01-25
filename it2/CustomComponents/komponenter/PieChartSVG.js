// @ts-check
class PieChartSVG extends HTMLElement {
    constructor() {
        super();
        let width = 250;
        let height = 250;
        this._root = this.attachShadow({ mode: "open" });
        this.redraw();
    }
    redraw() {
        let width = +this.getAttribute("width") || 256;
        let font = this.getAttribute("font") || "white";
        let height = width;
        let half = width / 2;
        let heading = this.getAttribute("heading") || "PieChart";
        let fz = 2 + Math.floor(1.5 * Math.sqrt(half));
        let inner = `
        <div id="pie">
          <div id="heading">${heading}</div>
          <svg id="paper" viewBox="-${half} -${half} ${width} ${width}" style="transform: rotate(-90deg)"></svg>
        </div>
        <style>
          svg text {
            font: ${fz}px serif; fill: ${font};
          }
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
        let colors = data.map((e, i) => e.color || (["red", "green", "blue", "teal", "coral", "beige"])[i % 6]);
        let labels = data.map(e => e.label || e.value);
        let values = data.map(e => +e.value);
        let r = +this.getAttribute("width") / 2;
        let sum = values.reduce((m, v) => m + v, 0);
        values = values.map(e => 2 * Math.PI * e / sum);
        let tot = 0;  // angle
        let svg = this._root.querySelector('svg');
        let ang2xy = (ang) => ([r * Math.cos(ang), r * Math.sin(ang)]);
        values.forEach((v, i) => {
            let [startX, startY] = ang2xy(tot);
            tot += v;
            let [endX, endY] = ang2xy(tot);
            let arcFlag = v > Math.PI  ? 1 : 0;
            let pathData = [
                `M ${startX} ${startY}`, // Move
                `A ${r} ${r} 0 ${arcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', colors[i]);
            svg.appendChild(path);
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${startX} ${startY} L 0 0`);
            path.id = `i${i}`;
            svg.appendChild(path);
            let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.innerHTML = `<textpath startOffset="5%" href="#i${i}">${labels[i]}</textpath>`;
            svg.appendChild(text);
        });


    }
    static get observedAttributes() {
        return ["heading", "width", "height","font"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "heading") {
            this._root.querySelector("#" + name).innerHTML = newValue;
        } else {
            this.redraw();
        }
    }

}
window.customElements.define("svg-chart", PieChartSVG);