function playTheGame(stage, tanks, player) {

  // en veldig enkel måte å animere ting på
  // vi gjør det med et fast intervall på ~ 30ms
  window.setInterval(animate, 45);
  const keys = [];

  const myself = player.navn;
  let justStarted = true;

  document.onkeyup = function (e) {                                                                                                           
    keys[e.code] = 0;
  };

  document.onkeydown = function (e) {
    keys[e.code] = 1;
  };

  // lag en map for alle tanks
  // gitt navnet på en player, da kan du finne tilsvarende tanks
  let tankList = new Map();
  for (let t of tanks) {
    tankList.set(t.owner, t);
  }

  // lag en liste over ting mine skudd kan treffe
  let shootables = tanks.filter( t => t.owner !== myself);
  
  
  // lag 20 skudd
  let skudd = [];
  let skuddIdx = 0;  // neste ledige skudd
  for (let i=0; i<20; i++) {
    let s = new Skudd("s" + i,"");
    skudd.push(s);
    stage.appendChild(s.div);
  }
  
  let keysT1 = "ArrowLeft,ArrowRight,ArrowUp,ArrowDown,KeyZ".split(",");
  

  function animate(e) {
    flyttSkudd();
    let t1 = tanks[0];             // min egen tank
    steerTank(t1, keysT1);         // styres med piltaster
    moveTank(t1);
    for (let gamer of Object.keys(world)) {
      if (gamer !== myself && world[gamer].body) {
        let posVecRot = world[gamer].body;
        // world er verden slik serveren ser den, alle tanks er lagra her
        // for hver spiller sendes x,y,r(rot),v
        let tank = tankList.get(gamer);
        tank.body.x = posVecRot.x;
        tank.body.y = posVecRot.y;
        tank.body.v = posVecRot.v;
        tank.body.rot = posVecRot.r;
        // nå er vår lokale kopi av andre spillers tank oppdatert
        // dermed kan den flyttes
        moveTank(tank);
      }
    }
  }
  
  function flyttSkudd() {
    for (let s of skudd) {
      if (s.alive) {
        s.move(5);
        if (s.owner === myself) {
          // check own shots for collitions
          collide(s, shootables);
        }
      }
    }
  }

  function collide(me, others) {
    // sjekk om me kolliderer med others
    for (let other of others) {
      if (me.body.overlap(other.body)) {
        me.strike(other);  
        // strike will change state to not alive 
        // or back of if collision 
        socket.emit("hit",{ ident  : me.is ,
                            owner  : me.owner,
                            idnum  : me.idnum}, 
                          { ident  : other.is,
                            owner  : other.owner, 
                            idnum  : other.idnum
                          }
                    );
        break;
      }
    }
  }

  function steerTank(tank, [left,right,up,down,fire]) {
    // styring av tanks 1
    let change = false || justStarted;
    justStarted = false;
    if (keys[left]) {
      tank.turn(-tank.turnrate);
      change = true;
    }
    if (keys[right]) {
      tank.turn(tank.turnrate);
      change = true;
    }
    if (keys[up]) {
      tank.body.v = Math.min(tank.speed, tank.body.v + tank.a);
      change = true;
    }
    if (keys[down]) {
      tank.body.v = Math.max(-tank.speed * 0.3, tank.body.v - tank.a);
      change = true;
    }
    if (keys[fire]) {
      if (tank.delay < 1) {
        if (skudd[skuddIdx].alive === false) {
          let s = skudd[skuddIdx];
          let idnum = Skudd.idnum;
          s.fire(myself,idnum, tank.body.x, tank.body.y, tank.body.rot);
          s.idnum = Skudd.idnum;  // playername + idnum will be uiniq for live shots 
          tank.delay = 22;
          socket.emit("fire",{player:myself, idnum:s.idnum, 
                   x:tank.body.x, y:tank.body.y, rot:tank.body.rot});
        }
        skuddIdx = (skuddIdx + 1) % skudd.length;
      } 
    }
    
    tank.delay = Math.max(0,tank.delay - 1);

    // gi beskjed til serveren om våres nye posisjon
    // fart + rot sendes også
    // bare send dersom tanks beveger seg eller snur
    if (Math.abs(tank.body.v) > 0.05 || change) {
      let posVelRot = { 
        x:tank.body.x, 
        y:tank.body.y, 
        v:tank.body.v, 
        r:tank.body.rot 
        };
      socket.emit('newpos',  {myself, posVelRot}); 
    }
  }

  function moveTank(tank) {
    // oppdater posisjon, retning og fart for tanks
    tank.move(tank.body.v);
    tank.direction(tank.body.rot);
    tank.body.v *= 0.98;   // rullemotstand
  }
  
  // serveren sender 'update' meldinger som fanges opp her
  // data inneholder verden slik serveren ser den
  // overskriver world med serverens syn på verden
  socket.on('update', function(data) {
      world = data;  // serveren er BOSS
    }); 

  socket.on('hit', function(actor,target) {
    // actor hit target
    if (actor.ident === 'Skudd') {
      skudd.forEach( skudd => {
        if (skudd.idnum === actor.idnum && skudd.owner === actor.owner) {
          if (target.ident === 'Tank') {
            let tank = tankList.get(target.owner);
            tank.takeDamage(skudd.hit('Tank'));
          }
          skudd.die();
        }
      });
    }
    if (actor.ident === 'Tank') {
      // a tank has collided with something
    }

  });
  
  
  socket.on('fire', function ({player, idnum, x, y, rot}) {
    if (player !== myself) {
      for (let s of skudd) {
        if (!s.alive) {
          s.fire(player,idnum,x, y, rot);
          break;
        }
      }
    }

  });

}