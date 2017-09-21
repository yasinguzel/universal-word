document.addEventListener("keydown", function(event) {
  if (event.keyCode == 37) {
    var subtitleWrapper = document.getElementById("caption-window-1");
    var subtitle = document.getElementsByClassName("captions-text")[0];
    var video = document.getElementsByTagName("video")[0];

    subtitleWrapper.addEventListener("mouseenter", function() {
      video.pause();
      var subtitleArray = subtitle.firstChild.textContent.trim().split(/\s+/);
      const inSubtitle = subtitle.firstChild,
        style = window.getComputedStyle(inSubtitle),
        firstFontSize = style.getPropertyValue("font-size");

      inSubtitle.innerHTML = "";

      subtitleArray.map(word => {
        var span = document.createElement("SPAN");
        var textnode = document.createTextNode(" " + word);

        span.appendChild(textnode);
        inSubtitle.appendChild(span);
        span.setAttribute("data-tooltip", "Loading...");

        span.addEventListener("mouseenter", function() {
          var howMuchPxGrow = 5;
          var newFontSize = parseInt(firstFontSize) + howMuchPxGrow;

          newFontSize += "px";
          span.style.fontSize = newFontSize;

          console.log(word);

          var url =
            "https://glosbe.com/gapi/translate?from=eng&dest=tr&format=json&phrase=" +
            word +
            "&pretty=true";

          fetch(url)
            .then(res => res.json())
            .then(json => {
              console.log(json.tuc[0].phrase.text);
              span.setAttribute("data-tooltip", json.tuc[0].phrase.text);
            });
        });

        span.addEventListener("mouseleave", function() {
          span.style.fontSize = firstFontSize;
        });
      });
    });

    subtitleWrapper.addEventListener("mouseleave", function() {
      video.play();
    });
  }
});
