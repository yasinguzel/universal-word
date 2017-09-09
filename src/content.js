document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
      var subtitle = document.getElementsByClassName("captions-text")[0];
      var video = document.getElementsByTagName("video")[0];
      var p = document.createElement("p");

      subtitle.addEventListener("mouseenter",function(){
        video.pause();
      });
      subtitle.addEventListener("mouseleave",function(){
        video.play();
      });
      subtitle.addEventListener("click",function(){
        console.log(subtitle.firstChild.textContent);
      });
  }
});

