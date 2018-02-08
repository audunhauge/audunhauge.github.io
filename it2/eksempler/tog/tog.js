/* global Howl */


function setup() {
  var sound = new Howl({
    urls:["train.mp3"]
  })
  sound.play();
}
