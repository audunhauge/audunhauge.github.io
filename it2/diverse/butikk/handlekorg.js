// 

class Handlekorg {
	constructor() {
		this.liste = {};
		this.totAntall = 0;
	}

	tom() {
		this.liste = {};
		this.totAntall = 0;
	}

	/**
 	 * Legger en vare til handlekorgen. Dersom denne varen allerede
 	 * er i korgen, da økes antallet for denne.
 	 * totAntall justeres
 	 * @param {Vare} vare
 	 */
	add(vare) {
		if (this.liste[vare.navn]) {
			this.liste[vare.navn].antall++;  // antall av denne varen
		} else {
			this.liste[vare.navn] = { antall: 1, vare: vare };
		}
		this.totAntall++;  // totalt antall varer
	}

	/**
 	 * Fjerner en vare fra korgen dersom den finnes
 	 * totAntall justeres
 	 * @param {Vare} vare
 	 */
	drop(vare) {
		if (this.liste[vare.navn]) {
			this.liste[vare.navn].antall--;  // antall av denne varen
			if (this.liste[vare.navn].antall === 0) {
				delete this.liste[vare.navn];
			}
			this.totAntall--;
		}
	}

	/**
 	 * Gir tilbake totalt antall varer i korgen
	 *  @returns {int}
	 */
	get antall() {
		return this.totAntall;
	}

	/**
 	 *  Gir tilbake sum av pris * antall for alle varer i korgen
 	 *  @returns {Number}
	 */
	get total() {
		let tot = 0;
		for (let varenavn in this.liste) {
			tot += this.liste[varenavn].antall * this.liste[varenavn].vare.pris;
		}
		return tot;
	}

	/**
 	 * Viser korgen i displayDiv, alle linjer er kobla til eventlistener for klikk
	 * Ved klikk kjøres denne funksjonen
	 * @param {Div} displayDiv - div hvor korgen skal vises
	 * @param {function} eventListener - funksjon som kjøres for klikk på linjer
	 */
	vis(displayDiv, eventListener) {
		displayDiv.innerHTML = '<h2>Min Handlekorg</h2>';
		for (let varenavn in this.liste) {
			let item = this.liste[varenavn];
			displayDiv.appendChild(item.vare.linje(item.antall, eventListener));
		}
		let divTot = document.createElement('div');
		divTot.classList.add('total');
		divTot.innerHTML = 'Totalsum : ' + this.total + ' kr <p>Antall varer : ' + this.antall;
		displayDiv.appendChild(divTot);
	}
}

