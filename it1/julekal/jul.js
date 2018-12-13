// @ts-check

function setup() {
    let divVis = document.getElementById("vis");
    let lukene = Array.from(document.querySelectorAll(".luke"));
    lukene.forEach( e => e.addEventListener("click", visLuke));

    let soundHappy = document.getElementById("happy");
    let soundSad = document.getElementById("sad");

    let videoJul = document.getElementById("juleaften");

    soundHappy.src = "media/happy.mp3";
    soundSad.src = "media/happy.mp3";
    


    
    function visLuke(e) {
      let today = new Date();
      let t = e.target;
      let nr = Number(t.innerHTML);
      /*
      if (nr > today.getDate()) {
        spill(soundSad);
        return;
      }
      */
      if (nr === 24) {
        videoJul.style.display = "block";
        videoJul.src = "media/jul.mp4";
        videoJul.play();
        setTimeout(() =>  { 
          videoJul.pause();
          videoJul.style.display = "none";
        }, 2000);
      }
      spill(soundHappy);
      divVis.style.backgroundImage = `url("media/bilde${nr}.png")`;
      divVis.style.display = "block";
      setTimeout(() =>  divVis.style.display = "none", 2000);
    }
  }


  function spill(sound) {
    sound.load();
    sound.play();
    setTimeout(() =>  sound.pause(), 2000);
  }