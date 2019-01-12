// @ts-check
class DigitalTime extends HTMLElement {
    constructor() {
      super();
      let now = new Date();
      let h = now.getHours();
      let m = now.getMinutes();
      let s = now.getSeconds();
      this._root = this.attachShadow({ mode: "open" });
      this._root.innerHTML = `
       <div id="clock">
         <span id="h">${h}:</span>
         <span id="m">${m}:</span>
         <span id="s">${s}</span>
       </div>
       <style>
       #clock {
         width: 60px;
         background-color: blue;
         color:white;
         margin: 0.5em;
         padding: 5px;
         border-radius: 3px;
       }
       </style>
       `;
       setInterval(()=>{
        let now = new Date();
        let h = String(now.getHours());
        let m = String(now.getMinutes());
        let s = String(now.getSeconds());
        this.setAttribute("h",h);
        this.setAttribute("m",m);
        this.setAttribute("s",s);
       }, 1000);
    }
    static get observedAttributes() {
      return ["h","m","s"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this._root.querySelector("#"+name).innerHTML = newValue;
    }
  }
  window.customElements.define("digi-time", DigitalTime);