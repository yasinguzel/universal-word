let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let subtitleButton = document.getElementsByClassName(
  "ytp-subtitles-button ytp-button"
)[0];

let fullScreenButton = document.getElementsByClassName(
  "ytp-fullscreen-button ytp-button"
)[0];

let player = document.getElementById("movie_player");

let arrayButton = [subtitleButton, fullScreenButton];

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

  let threeResult = "";

  for (let index = 0; index < 3; index++) {
    if (
      data.tuc[index] &&
      data.tuc[index].phrase &&
      data.tuc[index].phrase.text
    ) {
      threeResult += " " + (index + 1) + ". " + data.tuc[index].phrase.text;
    } else if (index === 0) {
      threeResult = "no result";
    }
  }

  return threeResult;
}

function main() {
  const subtitleWrapper = document.getElementById("caption-window-1");
  const subtitle = document.getElementsByClassName("captions-text")[0];
  const video = document.getElementsByTagName("video")[0];

  subtitleWrapper.addEventListener("mouseenter", () => {
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

      span.addEventListener("mouseenter", () => {
        const howMuchPxGrow = 5;
        let newFontSize = parseInt(firstFontSize) + howMuchPxGrow;

        newFontSize += "px";
        span.style.fontSize = newFontSize;

        const result = fetchTranslateResult("eng", "tr", word);

        result.then(translatedWords =>
          span.setAttribute("data-tooltip", translatedWords)
        );
      });

      span.addEventListener("mouseleave", () => {
        span.style.fontSize = firstFontSize;
      });
    });
  });

  subtitleWrapper.addEventListener("mouseleave", () => {
    video.play();
  });
}

function runObserver() {
  let observer = new MutationObserver(mutations => {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes[0].id === "caption-window-1") {
        main();
      }
    });
  });
  observer.observe(player, {
    attributes: true,
    childList: true,
    characterData: true
  });
}

function listenForSubtitleCase(object) {
  object.addEventListener("click", () => {
    if (subtitleButton.getAttribute("aria-pressed")) {
      runObserver();
    }
  });
}

arrayButton.map(object => {
  listenForSubtitleCase(object);
});
