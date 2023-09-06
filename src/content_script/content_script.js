let lang;
const SELECTION_TEXT_ATTRIBUTE_NAME = "data-selectionText"

const languageMap = [
  {range: /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/, tag: "Japanese"},
  {range: /[\u0400-\u04FF]/, tag: "Russian"},
  {range: /[\uAC00-\uD7AF]/, tag: "Korean"},
  {range: /[\u0600-\u06FF\u0750-\u077F]/, tag: "Arabic"},
  {range: /[\u00F1]/, tag: "Spanish"},
  {range: /[\u00E9\u00E8]/, tag: "French"},
  {range: /[\u00DF]/, tag: "German"},
  {range: /[\u00F2\u00F9]/, tag: "Italian"},
  {range: /[\u00E3\u00E7]/, tag: "Portuguese"},
  {range: /[\u05D0-\u05EA\u0591-\u05F4]/, tag: "Hebrew"},
  {range: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/, tag: "Persian"},
  {range: /[\u0391-\u03C9\u1F00-\u1FFF]/, tag: "Greek"},
  {range: /[\u0E00-\u0E7F]/, tag: "Thai"},
  {range: /[\u0900-\u097F\u1CD0-\u1CFF\u1F00-\u1FFF]/, tag: "Sanskrit"},
];

function getUserLanguage() {
  chrome.storage.sync.get("language", function (obj) {
    lang = obj.language || chrome.i18n.getUILanguage();
  });
}

getUserLanguage();

function openWiktionary(selectionText) {
  const wiktionaryURL = `https://${lang}.wiktionary.org/wiki/${encodeURI(selectionText || '')}`;
  for (const languageEntry of languageMap) {
    if (languageEntry.range.test(selectionText)) {
      window.open(`${wiktionaryURL}#${languageEntry.tag}`);
      return;
    }
  }
  window.open(`${wiktionaryURL}`);
}

const tooltip = document.createElement("div");
tooltip.className = "selection-tooltip";
tooltip.textContent = "W";
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "lightgray";
tooltip.style.boxShadow = "0 0 .2rem black"
tooltip.style.padding = ".3rem";
tooltip.style.cursor = "pointer";
tooltip.style.zIndex = Number.MAX_SAFE_INTEGER;
tooltip.setAttribute(SELECTION_TEXT_ATTRIBUTE_NAME, "")

// Function to open example.com when the tooltip is clicked
tooltip.addEventListener("click", function () {
  openWiktionary(tooltip.getAttribute(SELECTION_TEXT_ATTRIBUTE_NAME))
  tooltip.remove();
});

function handleSelection(event) {
  const selection = window.getSelection();
  if(!selection || selection.rangeCount === 0) return;
  const selectionText = selection.toString().trim();
  if(selectionText === "") return;
  const existingTooltip = document.querySelector(".selection-tooltip");
  if (existingTooltip) {
    existingTooltip.remove();
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const fontSize = window.getComputedStyle(event.target).fontSize;
  tooltip.style.top = window.scrollY + rect.top - tooltip.offsetHeight - parseFloat(fontSize.replace(/^\D+/g, '')) - 10 + "px";
  tooltip.style.left = window.scrollX + rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.setAttribute(SELECTION_TEXT_ATTRIBUTE_NAME, selectionText);
  document.body.appendChild(tooltip);
}

document.addEventListener("mouseup", handleSelection);

document.addEventListener("mousedown", function (e) {
  const existingTooltip = document.querySelector(".selection-tooltip");
  if(e.target === existingTooltip) return;
  if (existingTooltip) {
    existingTooltip.remove();
  }
});

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (document.body.lastElementChild !== tooltip) {
      document.body.removeChild(tooltip);
      document.body.appendChild(tooltip);
    }
  });
});
observer.observe(document.body, { childList: true });