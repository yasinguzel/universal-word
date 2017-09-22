var subtitleButton = document.getElementsByClassName(
  "ytp-subtitles-button ytp-button"
)[0];

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

async function fetchTranslateResult(from, dest, phrase) {
  const response = await fetch(
    "https://glosbe.com/gapi/translate?from=" +
      from +
      "&dest=" +
      dest +
      "&format=json&phrase=" +
      phrase +
      "&pretty=true"
  );

  const data = await response.json();

  var threeResult = "";

  if (data.tuc[0]) {
    threeResult = " 1. " + data.tuc[0].phrase.text;
    threeResult += data.tuc[1].phrase ? " 2. " + data.tuc[1].phrase.text : "";
    threeResult += data.tuc[2].phrase ? " 3. " + data.tuc[2].phrase.text : "";
  } else {
    threeResult = "no result";
  }

  return threeResult;
}

subtitleButton.addEventListener("click", function() {
  if (subtitleButton.getAttribute("aria-pressed")) {
    setTimeout(function() {
      const subtitleWrapper = document.getElementById("caption-window-1");
      const subtitle = document.getElementsByClassName("captions-text")[0];
      const video = document.getElementsByTagName("video")[0];

      subtitleWrapper.addEventListener("mouseenter", function() {
        video.pause();
        const subtitleArray = subtitle.firstChild.textContent.trim().split(" ");
        const inSubtitle = subtitle.firstChild,
          style = window.getComputedStyle(inSubtitle),
          firstFontSize = style.getPropertyValue("font-size");

        inSubtitle.innerHTML = "";

        subtitleArray.map((word, index) => {
          const span = document.createElement("SPAN");

          if (hasWhiteSpace(word)) {
            word.split(/\s+/).map((element, index) => {
              const textnode = document.createTextNode(" " + element);
              if (index === 1) {
                const br = document.createElement("br");
                inSubtitle.appendChild(br);
              }
              span.appendChild(textnode);
              inSubtitle.appendChild(span);
              span.setAttribute("data-tooltip", "Loading...");
            });
          } else {
            const textnode = document.createTextNode(" " + word);
            span.appendChild(textnode);
            inSubtitle.appendChild(span);
            span.setAttribute("data-tooltip", "Loading...");
          }

          span.addEventListener("mouseenter", function() {
            const howMuchPxGrow = 5;
            let newFontSize = parseInt(firstFontSize) + howMuchPxGrow;

            newFontSize += "px";
            span.style.fontSize = newFontSize;

            const result = fetchTranslateResult("eng", "tr", word);

            result.then(translatedWords =>
              span.setAttribute("data-tooltip", translatedWords)
            );
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
