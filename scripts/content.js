const list = document.querySelector("#mw-content-text .mw-parser-output");

const currentURL = window.location.href;
const championName = currentURL.split("/")[4];

console.log("championName", championName);

let jsonData = [];

if (list) {
  let currentType = "";
  let currentTypeCategory = "";

  for (let i = 0; i < list.children.length; i++) {
    const child = list.children[i];

    if (child.tagName === "H2") {
      currentType = child.innerText;
    }

    if (child.tagName === "H3") {
      currentTypeCategory = child.innerText;
    }

    if (child.tagName === "UL") {
      let span = child.querySelector("span");
      let quote = child.querySelector("i");

      let quoteAudioSrc = "";
      let quoteText = "";

      if (span) {
        let audioTag = span.querySelector("audio");
        let sourceTag = audioTag.querySelector("source");

        quoteAudioSrc = sourceTag.getAttribute("src");
      }

      if (quote) {
        quoteText = quote.innerText;
      }

      const data = {
        type: currentType,
        category: currentTypeCategory,
        audio: quoteAudioSrc,
        quote: quoteText,
      };

      jsonData.push(data);
    }
  }

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
