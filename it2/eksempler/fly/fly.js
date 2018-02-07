
function setup() {
   // merk at lydfilen er uendra og varer ~ 20s
   var sound = new Howl({
    urls:["jetpass.mp3"],
  })
  sound.play(); // begynner å spille med det samme
  
  setTimeout( () => sound.fadeOut(0,2200, () => sound.stop()) , 4000);
  // spiller i 4s, fader i 2.2s, totalt 6.2s
  
  zz("stopp").addEventListener("click", (event) => sound.stop() );
  
}