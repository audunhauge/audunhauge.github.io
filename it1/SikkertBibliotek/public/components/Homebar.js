// @ts-check
class HomeBar extends HTMLElement {
  constructor() {
    super();
    const heading = this.getAttribute("heading") || "";
    const crumb = this.getAttribute("crumb") || "";
    const username = this.getAttribute("username") || "";
    this._info = {};
    let now = new Date();
    let datestr = now.toDateString();
    this._root = this.attachShadow({ mode: "open" });
    this._root.innerHTML = `
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <div id="home">
        <div id="menu" tabindex="0">
            <i class="material-icons">menu</i>
            <ul>
              <li data-link="/index">Home</li>
              <slot><li>simple menu</li></slot>
            </ul>
        </div>
        <div id="heading">${heading}</div>
        <div id="crumb">${crumb}</div>
        <div id="username">${username}</div>
        <div id="info">${datestr}</div>
      </div>
          <style>
            #home {
                display: grid;
                align-items: center;
                grid-template-columns: 1fr 1fr 2fr 3fr 1fr;
                height: 70px;
                background-color: rgba(32,166,231,.8);
                background-image: var(--grad, linear-gradient(180deg,#20a8e9,rgba(30,158,220,.5)) );
                color: #fff;
            }

            div#menu {
              place-self:center left;
            }

            div#menu ul,
            div#info > ul {
              text-align: left;
              text-transform: capitalize;
              visibility: hidden;
              list-style: none;
              margin: 0;
              padding: 5px;
              z-index:100;
              position: relative;
              top:-0px;
              color: black;
              background-color: rgb(245, 245, 245);
              box-shadow: 2px 2px 2px gray;
              border: solid gray 1px;
              border-radius: 4px;
              padding: 5px;
            }

            div#menu:focus-within ul,
            div#menu:hover ul,
            div#info:hover > ul {
               visibility: visible;
            }

            ::slotted(li:focus),
            ::slotted(li:hover),
            div#menu slot:hover,
            div#menu ul li:hover,
            div#info > ul > li:hover {
              background: rgb(32,166,231);
            }

            div#info li, div#menu li {
              padding: 2px;
            }

            #home > div {
                font-size: 1.2em;
                height: 32px;
                padding: 5px;
                text-align: center;
                white-space: nowrap;
            }
            div#heading {
                font-size: 1.5em;
                white-space: nowrap;
                margin-left: 2em;
            }
            #home i.material-icons {
              font-size: 32px;
            }
            @media not (screen and (-webkit-device-pixel-ratio: 1)) {
              #username , #info, #crumb { display:none; }
              #home {grid-template-columns: 1fr 1fr 3fr;}
            }
            @media screen and (max-width: 750px) {
              #username , #info { display:none; }
              #home {grid-template-columns: 1fr  1fr 3fr;}
            }
            @media screen and (max-width: 550px) {
              #username , #info, #crumb { display:none; }
              #home {grid-template-columns: 1fr 2fr; }
            }
          </style>
        `;

    this._root
      .querySelector("#crumb")
      .addEventListener("click", () => this.dispatchEvent(new Event("crumb")));
    this._root.querySelector("#menu").addEventListener("click", e => {
      let t = e.target;
      this._info.target = t;
      if (t.localName === "li" && t.dataset.link) {
        let link = t.dataset.link;
        location.href = `${link}.html`;
      } else this.dispatchEvent(new Event("menu"));
    });
    this._root.querySelector("#info").addEventListener("click", e => {
      let t = e.target;
      this._info.target = t;
      this.dispatchEvent(new Event("info"));
    });
    this._root
      .querySelector("#username")
      .addEventListener("click", () =>
        this.dispatchEvent(new Event("username"))
      );
  }

  /*
  // TODO ikke vits i da jeg ikke vet hvordan jeg
  // kan trigge click inne i menyen når tab -> focus
  connectedCallback() {
    setTimeout(() => {
      // set tabindex on assigned menu items
      let items = Array.from(this._root.querySelectorAll("#menu slot"));
      if (items && items.length) {
        items[0].assignedElements().forEach((e, i) => {
          e.setAttribute("tabindex", String(i + 1));
        });
      }
    }, 1000);
  }
  */

  get info() {
    return this._info;
  }

  static get observedAttributes() {
    return ["username", "heading", "menu", "info", "crumb", "getlinks"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "username") {
      fetch(newValue)
        .then(r => r.json())
        .then(({ username }) => {
          this._root.querySelector("#username").innerHTML = username;
        })
        .catch(e => console.log("Dette virka ikke."));
        return;
    } 
    if (name === "getlinks") {
      // links can be got by fetch
      fetch(newValue)
        .then(r => r.json())
        .then(({ items }) => {
          let html = items
            .filter(e => e.endsWith(".html"))
            .map(e => e.replace(".html", ""));
          this._root.querySelector("#menu ul").innerHTML += html
            .map(e => `<li data-link="${e}">${e}</li>`)
            .join("");
        })
        .catch(e => console.log("Dette virka ikke."));
        return;
    } 
    this._root.querySelector("#" + name).innerHTML = newValue;
    
  }
}

window.customElements.define("home-bar", HomeBar);
