function setup() {
    let inpKode = document.getElementById("kode");
    let btnLag = document.getElementById("lag");
    let divDiagram = document.getElementById("diagram");
    btnLag.addEventListener("click", lagDiagram);

    function lagDiagram() {
        let kode = inpKode.value;
        let linjer = kode.split('\n');
        let d = '<svg>';
        let x = 0, y = 0;
        linjer.forEach(line => {
            let t = line.trim();
            if (t.startsWith("for")) {
                t = t.substr(3);
                d += `<path d="M 50 ${y} H 120 L 150 ${y+20} V ${y+40} H 20 V ${y+20} Z" 
                         fill="none" stroke="black" />`;
                d += `<text x="64" y="${y + 22}">for ${t}</text>`;
                y += 80;
            } else if (t.startsWith("if")) {
                d += `<g transform="rotate(45,70,${y + 30})">`;
                d += `<rect x="20" y="${y}" width="60" height="60" fill="none" stroke="black" />`;
                d += '</g>';
                d += `<text x="34" y="${y + 18}">${line.trim()}</text>`;
                y += 70;
            } else {
                d += `<rect x="10" y="${y}" width="140" height="16" fill="none" stroke="black" />`;
                d += `<text x="14" y="${y + 12}">${line.trim()}</text>`;
                y += 50;
            }
        });
        d += '</svg';
        divDiagram.innerHTML = d;
        let svg = document.querySelector('svg');
        svg.style.height = y + "px";

    }

}