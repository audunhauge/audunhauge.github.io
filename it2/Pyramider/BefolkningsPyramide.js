// @ts-check
class Pyramide extends HTMLElement {
  constructor() {
    super();
    const country = this.getAttribute("country") || "Norway";
    const year = this.getAttribute("year") || "1950";
    const caption = this.getAttribute("caption") || `${country} ${year}`;
    const width = this.getAttribute("width") || "400";

    const size = Number(this.getAttribute("size")) || 3;
    const height = (size + 2) * 100;

    this._root = this.attachShadow({ mode: "open" });
    this.halfw = Number(width) / 2;
    this.data = {}; // store fetched data
    this.country = undefined;
    this.year = undefined;

    this._root.innerHTML = `
        <div id="home">
          <div id="pyramide"></div>
          <div id="caption">${caption}</div>
        </div>
            <style>
            .soyle {
                position: relative;
                height: ${size}px;;
                width: 10px;
                left: calc(${width}px / 2);
            }
            .soyle.females {
                background-color: red;
            }
            
            .soyle.males {
                top: -2px;
                background-color: blue;
                margin-top: -1px;
                transform: rotate(180deg);
                transform-origin: left;
            }
            
            #pyramide {
                position: relative;
                width: ${width}px;
                height: ${height}px;
                border: solid 1px gray;
                background-color: var(--mainBg);
                padding: 2px;
            }

            #home {
                margin-top: 1em;
                width: ${+width+10}px;
            }
            
            #caption {
                text-align:center;
            }
            </style>
          `;
    //  this.hentDataOgTegn(country, year);
  }

  hentDataOgTegn(country = "Norway", year = "1950") {
    let url = `http://api.population.io:80/1.0/population/${year}/${country}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        this.data = data;
        this.behandle(data);
      })
      .catch(e => console.log("Dette virka ikke."));
  }

  behandle(data) {
    let divPyr = this._root.querySelector("#pyramide");
    divPyr.innerHTML = "";
    // let max = Math.max(... data.map(e => e.males));

    let max = data.reduce((s, e) => Math.max(s, e.males), 0);

    for (let i = data.length - 1; i >= 0; i--) {
      let aardata = data[i];
      let f = (this.halfw * Number(aardata.females)) / max;
      let m = (this.halfw * Number(aardata.males)) / max;
      let divm = document.createElement("div");
      let divf = document.createElement("div");
      divm.className = "soyle males";
      divf.className = "soyle females";
      divf.style.width = f + "px";
      divm.style.width = m + "px";
      divPyr.appendChild(divf);
      divPyr.appendChild(divm);
    }
  }

  caption() {
    this._root.querySelector("#caption").innerHTML = `${this.country} ${this.year}`;
  }

  static get observedAttributes() {
    return ["country", "year"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "country") {
      this.country = newValue;
      this.hentDataOgTegn(this.country, this.year);
    }
    if (name === "year") {
      this.year = newValue;
      this.hentDataOgTegn(this.country, this.year);
    }
    this.caption();
  }
}
window.customElements.define("pop-pyr", Pyramide);
