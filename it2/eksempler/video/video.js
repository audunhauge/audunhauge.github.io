function setup() {
  var vid = zz("vid")
  var btn = zz("stopp");
  
  // skift til false dersom du ikke har med autoplay
  var playing = true;
  
  // viser controls for avspiller
  vid.setAttribute("controls","controls")   
  
  
  btn.addEventListener("click", (e) =>{
      if (playing) { 
        vid.pause();
        btn.innerHTML = "play";
        playing = false;
      } else {
        vid.play();
        btn.innerHTML = "stop";
        playing = true;
      }
   } );
}