var subtitleButton = document.getElementsByClassName(
  "ytp-subtitles-button ytp-button"
)[0];
subtitleButton.addEventListener("click", function() {
  if (subtitleButton.getAttribute("aria-pressed")) {
    setTimeout(function() {
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

            var url =
              "https://glosbe.com/gapi/translate?from=eng&dest=tr&format=json&phrase=" +
              word +
              "&pretty=true";

            fetch(url)
              .then(res => res.json())
              .then(json => {
                var threeResult =
                  " 1. " +
                  json.tuc[0].phrase.text +
                  " 2. " +
                  json.tuc[1].phrase.text +
                  " 3. " +
                  json.tuc[2].phrase.text;

                span.setAttribute("data-tooltip", threeResult);
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
    }, 3000);
  }
});
