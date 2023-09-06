let lang;

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

window.addEventListener('load', function () {
  document.getElementById('search').addEventListener('submit', openWiktionary);
  document.getElementById("word").placeholder = chrome.i18n.getMessage("popup");
  document.getElementById('word').focus();
});

function openWiktionary(e) {
  e.preventDefault();
  const word = encodeURIComponent(document.getElementById('word').value);
  const wiktionaryURL = `https://${lang}.wiktionary.org/wiki/${word}`;
  for (const languageEntry of languageMap) {
    if (languageEntry.range.test(word)) {
      chrome.tabs.create({url: `${wiktionaryURL}#${languageEntry.tag}`});
      return;
    }
  }
  chrome.tabs.create({url: `${wiktionaryURL}`});
}