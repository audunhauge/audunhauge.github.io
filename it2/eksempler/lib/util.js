"use strict";

/**
 *  Returns dom element specified by #id or id or classname
 *  if no # or . then use getElementById
 *  NOTE zz("div") selects element with id==="div"
 *  @param {selector} selector like "#id" or "idwithnohash" or ".klass"
 *  @returns {DOM_ELEMENT} or undefined if not found
 */
var zz = function(selector) {
   var pre = selector.charAt(0);
   if (pre === '#' || pre === '.') {
     return document.querySelector(selector);
   } else {
     return document.getElementById(selector);
   }
 }

zz.all = document.querySelectorAll.bind(document);

// nodeList er ikke array, kan ikke bruke .map
zz.nodeMap = function(nodeList, fun) {
  for (var i = 0; i < nodeList.length; ++i) {
    fun(nodeList[i]); 
  }
}

zz.addClass = function(selector, klass) {
  zz.nodeMap(zz.all(selector), function(elm) {elm.classList.add(klass);});
} 

zz.removeClass = function(selector, klass) {
  zz.nodeMap(zz.all(selector), function(elm) {elm.classList.remove(klass);});
}

	
/**
 * sort numeric descending (9 ... 0)
 * @param {array} ar
 * @returns {array} ar in sorted order
 */
zz.sort90 = function(ar) {
  ar.sort(function(a,b) { return b-a;})
}
	
/**
 * sort numeric ascending (0 ... 9)
 * @param {array} ar
 * @returns {array} ar in sorted order
 */
zz.sort09 = function (ar) {
	ar.sort(function (a, b) { return a - b; })
}
	
/**
 * generate random number in range [lo,hi] inclusive
 * @param {number} lo  lower limit
 * @param {number} hi  high limit
 * @returns {number} random number in given range
 */
zz.roll = function (lo, hi) {
	if (lo == undefined) {
		return Math.random();
	}
	if (hi == undefined) {
		hi = lo; lo = 1;
	}
	return lo + Math.round(Math.random() * (hi - lo));
}
	
/**
 * shuffle([1,2,3]) => random shuffle of elements
 * @param {array} elements - elements to shuffle
 * @return {array} - elements in random order
 */
zz.shuffle = function (elements) {
	var length = elements.length;
	var shuffled = Array(length);
	for (var index = 0, rand; index < length; index++) {
		rand = zz.roll(0, index);
		if (rand !== index) shuffled[index] = shuffled[rand];
		shuffled[rand] = elements[index];
	}
	return shuffled;
}
	
/**
 * pick(3,[1,2,3,4,5]) = random slice length 3
 * pick([2,3,4]) pick one random item
 * @param {int|array} a - if only one param then must be array
 * @param {undefined|arry} b - array if a is integer, else undefined
 * @returns {array} - a subsequence of elements with length a or 1
 */
zz.pick = function (a, b) {
	var antall, elementer;
	if (b == undefined) {
		elementer = a;
		antall = 1;
	} else {
		elementer = b;
		antall = a;
	}
	return zz.shuffle(elementer).slice(0, antall);
}

zz.range = function (lo, hi) {
	var i;
	var ar = [];
	if (hi == undefined) {
		hi = lo; lo = 0;
	}
	if (lo >= hi) return ar;
	for (i = lo; i < hi; i++) {
		ar.push(i);
	}
	return ar;
}
	
/**
 * Konverterer norske tegn æøå til nærmeste engelske eoa
 * @param {string} txt - norsk tekst med æøå - skal være i LOWER CASE
 * @return {string} - æøå blir til eoa
 */
zz.norsk2english = function (txt) {
	return txt.replace(/ø/g, 'o').replace(/æ/g, 'e').replace(/å/g, 'a')
}
	
	
/**
 *  Lager en tabell med inputs 
 * @param {number} row  antall rader
 * @param {number} col  antall kolonner
 * @param {object} obj  instillinger for datagrid, overskrifter, felt-typer(for hver kolonne)
 * @return {string} "<table>...</table>"
 */ 
zz.dataGrid = function(row,col,obj) {
		if (obj == undefined) 
		    obj = { table:"grid", caption:"grid",
			        cols:zz.range(1,col+1), rows:zz.range(1,row+1)};
		var i,j;
		var t = '<table' + (obj.id ? ' id="'+obj.id+'"' : ' id="grid"' ) + (obj.table ? ' class="'+obj.table+'"' : '' ) + '>';
		if (obj.caption) t += '<caption>'+obj.caption+'</caption>';
		if (obj.cols) {
		  t += '<thead><tr>';
		  if (obj.rows) t += '<th></th>';
		  for (j=0; j<col; j++) {
			  t += '<th>'+obj.cols[j]+'</th>';
		  }
		  t += '</tr></thead>';
		}
		t += '<tbody>';
		for (i=0; i< row; i++) {
		  t += '<tr>';
		  if (obj.rows) t += '<th>'+obj.rows[i]+'</th>';
		  for (j=0; j<col; j++) {
			  t += '<td>';
			  t += '<input type="' + (obj.types ? obj.types[j] : 'text') + '">';
			  t += '</td>';
		  }
		  t += '</tr>';
		}
		t += '</tbody></table>';
  return t;
}
	  
zz.gridRef = function(id,x,y) {
		return document.querySelector("#" + id +" > tbody > tr:nth-child(" 
		   + y + ") > td:nth-child(" + x + ") > input" );
}


	
/**
 *  Lager en tabell 
 * @param {number} row  antall rader
 * @param {number} col  antall kolonner
 * @param {object} obj  instillinger for tabellen, overskrifter, klasser
 *                       data[i][j] vil gi verdi for en celle dersom definert
 *                       rownames:"a,b,c"
 *                       colnames:"x,y,z"
 *                       if rownames|colnames then data[rownames[i]][colnames[j]]
 * @return {string} "<table>...</table>"
 */ 
zz.table = function(row,col,obj) {
		if (obj == undefined) 
		    obj = { table:"simple", caption:"simple", 
			        cols:zz.range(1,col+1), rows:zz.range(1,row+1)};
		var i,j, px, py;
		var t = '<table' + (obj.id ? ' id="'+obj.id+'"' : ' id="simple"' ) + (obj.table ? ' class="'+obj.table+'"' : '' ) + '>';
		if (obj.caption) t += '<caption>'+obj.caption+'</caption>';
    if (obj.rownames) { py = obj.rownames.split(','); }
    if (obj.colnames) { px = obj.colnames.split(','); }
		if (obj.cols) {
		  t += '<thead><tr>';
		  if (obj.rows) t += '<th></th>';
		  for (j=0; j<col; j++) {
			  t += '<th>'
          + (obj.cols[j] ? obj.cols[j] : '')
          + '</th>';
		  }
		  t += '</tr></thead>';
		}
		t += '<tbody>';
		for (i=0; i< row; i++) {
      let yid = (py && py[i] ) ? py[i] : i;
		  t += '<tr>';
		  if (obj.rows) t += '<th>'+obj.rows[i]+'</th>';
		  for (j=0; j<col; j++) {
        let xid = (px && px[j] ) ? px[j] : j;
			  t += '<td>'
        t += (obj.data && obj.data[yid] && obj.data[yid][xid] !== undefined) ? obj.data[yid][xid] : '';
        t += '</td>';
		  }
		  t += '</tr>';
		}
		t += '</tbody></table>';
  return t;
}

/**
 *  Gir referanse til en celle i en tabell
 * @param {string} id   id for tabellen
 * @param {int} x  kolonnenummer
 * @param {int} y  radnummer
 * @return {DOM_Element}
 */ 	  
zz.tableRef = function(id,x,y) {
		return document.querySelector("#" + id +" > tbody > tr:nth-child(" 
		   + y + ") > td:nth-child(" + x + ")" );
}
	  

	
/**
 * @usage makeSelect("id","ski,dans,drama")
 * @param {sting} id
 * @param {string} elements
 * @return {string} html for a select, <select id="{id}"><option ...></option> .. </option></select>
 */
zz.makeSelect = function (id, elements, chosen) {
		chosen = (chosen != undefined) ? zz.norsk2english(chosen.toLowerCase()) : '';  // chosen er en optional parameter - kan være udefinert
		var etikettLo;  // etiketten i lower_case
		var etikett;
		var selected;   // får verdien " selected" dersom dette er default element
		var list = elements.split(",");
		var t = '<select id="' + id + '">';
    for (let i = 0; i < list.length; i++) {
      etikett = list[i];
      etikettLo = etikettLo = zz.norsk2english(etikett.toLowerCase());
      selected = (etikettLo === chosen) ? " selected" : "";
      t += '<option value="' + etikettLo + '"' + selected + '>'
      + etikett
      + '</option>';
    }
    t += '</select>';
		return t;
}

/**
 * Lager en input av gitt type
 *  @param {string} id -  toLowerCase for DOM-id, brukt som fallback for ledetekst
 *  @param {string} type  text,number,date,button,select
 *  @param {object} alternativer { ledetekst:'skriv',klasse:'knapp',valg:'a,b,c',valgt:'a',min:0,max:10}
 */
zz.lagInput = function (id='myid', type='text', alternativer = {}) {
  let myDiv = document.createElement('div');
  myDiv.className = alternativer.klasse || "inputDiv";
  let ledetekst = alternativer.ledetekst || id;
  let t = '';
  let minMaxPlace = '';
  id = id.toLowerCase();
  switch (type) {
    case "output":
      t = '<label for="' + id + '">' + ledetekst + '</label>'
      + '<output id="' + id + '"></output>';
      break;
    case "select":
      let options = (alternativer.valg || 'ja,nei');
      let choice = alternativer.valgt;
      t = '<label for="' + id + '">' + ledetekst + '</label>' 
      + zz.makeSelect(id, options, choice) ;
      break;
    case "button":
      // etinfo[2] = klasse for button
      let klass = alternativer.button || 'button';
      t = '<button type="button" id="' + id + '" class="' + klass + '">' + ledetekst + '</button>';
      break;
    case "number":   
      if (isFinite(alternativer.min)) {
        minMaxPlace += ' min=' + +alternativer.min;
      }
      if (isFinite(alternativer.max)) {
        minMaxPlace += ' max=' + +alternativer.max;
      }
    // TODO we drop thru on purpose
    default:
      if (alternativer.placeholder) {
        minMaxPlace += ' placeholder="' + alternativer.placeholder + '"';
      }
      t = '<label for="' + id + '">' + ledetekst + '</label>'
      + '<input id="' + id + '" type="' + type + '"' + minMaxPlace + '>';
      break;
  }
  myDiv.innerHTML = t;
  return myDiv;
}

/**
 * Create a form and populate with inputs
 *  options = { age:{type: "number",min:0,max:200}, ...}
 * @param {string} elements - comma separeted list of elements
 * @param {object} options - alle elements default to text if not set here
 */
zz.makeForm = function (id, elements, options) {
  let form = document.createElement('form');
  form.id = id;
  form.className = options.form || 'simple';
  for (let element of elements.split(",")) {
    let key = element.toLowerCase();
    let type = (options[key] && options[key].type) || "text";
    let inp = zz.lagInput(element, type, options[key]);
    form.appendChild(inp);
  }
  return form;
}