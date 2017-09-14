// @flow
let icons = {};

function setup() {
    icons.clock = String.fromCodePoint(0x1f550);
    icons.openBook = String.fromCodePoint(0x1f4d6);
    icons.blueBook = String.fromCodePoint(0x1f4d8);
    icons.memo = String.fromCodePoint(0x1f4dd);
    icons.newspaper = String.fromCodePoint(0x1f4f0);
    icons.microscope = String.fromCodePoint(0x1f52c);

    let links = document.querySelectorAll("ul li a");
    Array.from(links).forEach(e => {
        if (e.attributes) {
            let icon = e.attributes.getNamedItem("data-icon");
            if (icon) {
                let iconName = icon.value;
                let iconCode = icons[iconName];
                if (iconCode) {
                    e.setAttribute("data-icon", iconCode);
                }
            }
        }
    })

}