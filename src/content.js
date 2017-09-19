document.addEventListener("keydown", function(event) {
  if (event.keyCode == 37) {
    var subtitle = document.getElementsByClassName("captions-text")[0];
    var video = document.getElementsByTagName("video")[0];
    subtitle.addEventListener("mouseenter", function() {
      video.pause();
      var subtitleArray = subtitle.firstChild.textContent.split(" ");
      subtitle.firstChild.innerHTML = "";
      subtitleArray.map(word => {
        var button = document.createElement("BUTTON");
        var textnode = document.createTextNode(word);
        button.appendChild(textnode);
        subtitle.appendChild(button);
        button.className += "subtitle-button";
        button.addEventListener("click", function() {
          var url = "https://glosbe.com/gapi/translate?from=eng&dest=tr&format=json&phrase="+word+"&pretty=true";
          fetch(url).then(res => res.json())
          .then((json) => {
            console.log(json.tuc[0].phrase.text);
          });
        });
      });
    });
    subtitle.addEventListener("mouseleave", function() {
      video.play();
    });
  }
});
