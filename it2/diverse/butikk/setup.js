"use strict";

function setup() {
	var vareliste = new Vareliste();
	var handlekorg = new Handlekorg();
	var divHandlekorg = document.querySelector("#handlekorg");
	var divVareliste = document.querySelector("#vareliste");
	var divDialog = document.querySelector("#dialog");

	vareliste.add(new Vare("bukse", 390));
	vareliste.add(new Vare("slips", 90));
	vareliste.add(new Vare("jakke", 490));
	vareliste.add(new Vare("hatt", 1390));
	vareliste.add(new Vare("sko", 4390));
	vareliste.add(new Vare("støvler", 2390));
	vareliste.add(new Vare("kajakk", 12390));

	vareliste.vis(divVareliste, vareKjop);

	function vareKjop(e) {
		handlekorg.add(this.vare);
		handlekorg.vis(divHandlekorg, fjernVare);
	}

	function fjernVare(e) {
		handlekorg.drop(this.vare);
		handlekorg.vis(divHandlekorg, fjernVare);
	}

	var dialog = zz.makeForm("myform", "Navn,Betaling,Bestill,Nullstill",
		{
			betaling: {
				type: "select",
				valg: "visa,master",
				valgt: "visa"
			},
			bestill: { type: "button" },
			nullstill: { type: "button" },
		}
	);
	divDialog.innerHTML = '<h2>Bestill</h2>';
	divDialog.appendChild(dialog);
	document.querySelector("#bestill").addEventListener("click", bestill);
	document.querySelector("#nullstill").addEventListener("click", nullstill);

	function bestill(e) {
		divDialog.innerHTML = 'Din bestilling er sendt';
	}

	function nullstill(e) {
		handlekorg.tom();
		handlekorg.vis(divHandlekorg, fjernVare);
	}
}