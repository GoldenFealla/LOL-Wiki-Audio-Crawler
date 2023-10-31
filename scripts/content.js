const list = document.querySelector("#mw-content-text .mw-parser-output");

const currentURL = window.location.href;
const championName = currentURL.split("/")[4];

console.log("championName", championName);

let jsonData = [];
let currentType = "";
let currentTypeCategory = "";

/**
 *
 * @param {HTMLHeadingElement} element
 */
function handleH2(element) {
  const span = element.querySelector(".mw-headline");

  if (span) {
    currentType = span.innerText;
  }
}

/**
 *
 * @param {HTMLHeadingElement} element
 */
function handleH3(element) {
  const span = element.querySelector(".mw-headline");

  if (span) {
    currentTypeCategory = span.innerText;
  }
}

/**
 *
 * @param {HTMLUListElement} element
 */
function handleUL(element) {
  let source = element.querySelectorAll("span audio source");
  let quote = element.querySelector("i");

  let quoteAudioSrc = "";
  let quoteText = "";

  if (quote) {
    quoteText = quote.innerText;
  }

  source.forEach((sourceChild) => {
    if (sourceChild) {
      quoteAudioSrc = sourceChild.getAttribute("src");
    }

    const data = {
      type: currentType,
      category: currentTypeCategory,
      audio: quoteAudioSrc,
      quote: quoteText,
    };

    jsonData.push(data);
  });
}

/**
 *
 * @param {HTMLDivElement} element
 */
function handleDiv(element) {
  if (element.classList.contains("ad-slot-placeholder")) {
    return;
  }

  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    const tagName = child.tagName;

    if (functionCallMap[tagName]) {
      let result = functionCallMap[tagName](child);
    }

    if (currentType === "Trivia") {
      break;
    }
  }
}

const functionCallMap = {
  H2: handleH2,
  H3: handleH3,
  UL: handleUL,
  DIV: handleDiv,
};

if (list) {
  for (let i = 0; i < list.children.length; i++) {
    const child = list.children[i];
    const tagName = child.tagName;

    if (functionCallMap[tagName]) {
      functionCallMap[tagName](child);
    }
  }

  console.log(jsonData);

  jsonData = jsonData.filter((data) => {
    return !(
      data.type === "" ||
      data.category === "" ||
      data.audio === "" ||
      data.quote === ""
    );
  });

  const handleDownload = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(jsonData));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${championName}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const DownloadButton = document.createElement("button");
  DownloadButton.innerText = `Download ${championName} JSON`;
  DownloadButton.addEventListener("click", handleDownload);

  const DownloadButtonContainer = document.createElement("div");
  DownloadButtonContainer.style.display = "flex";
  DownloadButtonContainer.style.justifyContent = "center";
  DownloadButtonContainer.style.marginTop = "20px";
  DownloadButtonContainer.appendChild(DownloadButton);

  list.appendChild(DownloadButtonContainer);
}
