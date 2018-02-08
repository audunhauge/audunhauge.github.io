var roll = (lo, hi) => {
	if (lo == undefined) {
		return Math.random();
	}
	if (hi == undefined) {
		hi = lo; lo = 1;
	}
	return lo + Math.round(Math.random() * (hi - lo));
}

var shuf = (elements) => {
  var length = elements.length;
	var shuffled = Array(length);
	for (var index = 0, rand; index < length; index++) {
		rand = zz.roll(0, index);
		if (rand !== index) shuffled[index] = shuffled[rand];
		shuffled[rand] = elements[index];
	}
	return shuffled;
} 

var score = (path, cost) => {
   let segment = R.aperture(2, path);
   let len = segment.reduce( (sum,[a,b]) => sum + cost(a,b),0);
   return len;
}

function makeWalk(path, cost, count) {
  let genomes = [];
  for (let i=0; i<count; i++) {
    let critter = shuf(path);
    let price = score(critter, cost);
    genomes.push({ p:critter, k:price});
  }
  return genomes;
}


function breed(weak,strong,cost) {
  // weak has low fitnes, strong has good
  let a = roll(0,strong.p.length / 3);
  let b = roll(a+2,strong.p.length);
  let seq = strong.p.slice(a,b);
  let rest = R.difference(weak.p,seq);
  weak.p = seq.concat(rest);
  weak.k = score(weak.p,cost);
  return weak;
}

function mutate(weak,cost) {
  for (let i=0; i<weak.p.length-1; i++) {
    if (Math.random() > 0.8) {
      // mutate at this point by swapping neighbours
      let r = weak.p[i];
      weak.p[i] = weak.p[i+1];
      weak.p[i+1] = r;
    }
  }
  weak.k = score(weak.p,cost);
  return weak;
}

function cross(critter) {
  let a = roll(1,critter.length-1);
  let f = critter.slice(a);
  let l = critter.slice(0,a);
  return f.concat(l);
}

function evolve(pop,cost) {
  // assume at least 11 critters
  let k = 0;
  //pop.sort( (a,b) => a.k - b.k );
  for (let i=2;i<pop.length-10; i++) {
    if (Math.random() > 0.5 && i > 3) {
      pop[i] = breed(pop[i],pop[k],cost);
      k = (k + 1) % 3;
    } else if(i>3) {
      pop[i] = mutate(pop[i], cost);
    }
  }
  // just shuffle the last five
  for (let n=0,i=pop.length-1; n<5; i--,n++) {
    pop[i].p = shuf(pop[i].p);
    pop[i].k = score(pop[i].p,cost);
  }
  // sliced copies of best solution
  for (let n=0,i=pop.length-5; n<5; i--,n++) {
    pop[i].p = cross(pop[0].p,cost);
    pop[i].k = score(pop[i].p,cost);
  }
  pop.sort( (a,b) => a.k - b.k );
  return pop;
}

function salesman(path, cost, show) {
  let qq = {};
  let qcost = (a,b) => {
    if (qq[a] && qq[a][b]) return qq[a][b];
    let c = cost(a,b);
    if (!qq[a]) qq[a] = {};
    qq[a][b] = c;
    return c;
  }
  let base = score(path,qcost);
  // path = [abcdef], cost = { a:{b:1,c:2,d:3,e:4,f:5}, b:{c..f},..,f:{}}
  // cost is assumed symmetrical, a to anywhere, f from all
  let population = makeWalk(path,qcost,100);   // 100 random
  // the path is assumed to be larger than 5
  // otherwise just brute force a solution (120 or less possible)
  population.sort( (a,b) => a.k - b.k );
  let better = population[0];
  
  function step() {
    for (let i=0; i < 25; i++) {
      // evolve for 25 generations
      population = evolve(population,qcost);
      if (population[0].k < better.k) {
        better = population[0];
        console.log("better=",better.k);
        //show(population[0].p);
      }
      //console.log(population[0].p, population[0].k);
      //console.log(population[10].p, population[10].k);
    }
  }
 
  for(let n=0; n<10; n++) {
       step();
       window.requestAnimationFrame(() => show(better.p));
  }
  population.sort( (a,b) => a.k - b.k );
  //let best = population[0];
  if (better.k < base) {
    console.log(better.k,base);
    show(better.p);
    return better;
  } else {
    show(path);
    return { p:path, k:base};
  }
  
}


/*
let lookup = {
    a:{b:1,c:2,d:3,e:4,f:5,g:6}
  , b:{c:3,d:4,e:5,f:6,g:7}
  , c:{d:3,e:4,f:5,g:6}
  , d:{e:5,f:1,g:6}
  , e:{f:2,g:3}
  , f:{g:1}
  , g:{}
}

let distance = (a,b) => {
  let [m,n] = [a,b].sort();
  return lookup[m][n];
}

salesman("abcdefg".split(''),distance);
*/
