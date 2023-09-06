document.getElementById("desc").innerHTML = chrome.i18n.getMessage("opts_desc");


const btn = document.getElementsByName('language');
const wikiurl = 'https://*.wiktionary.org';


const save = () => {
  for (let i = 0; i < btn.length; i++) {
    if (btn[i].checked) {
      chrome.storage.sync.set(
        {language: btn[i].value},
        () => {
          const a = document.querySelector("#url a");
          a.innerHTML = '';
          a.innerHTML = wikiurl.replace('*', btn[i].value);
          a.href = wikiurl.replace('*', btn[i].value);
          const status = document.getElementById('status');
          status.textContent = 'Options saved.';
          setTimeout(() => {
            status.textContent = '';
          }, 1250);
        }
      );
      break;
    }
  }
};

function restoreOptions() {
  chrome.storage.sync.get("language", function (result) {
    if (result.language) {
      for (let i = 0; i < btn.length; i++) {
        if (btn[i].value === result.language) {
          btn[i].checked = true;
          break;
        }
      }
      const a = document.querySelector("#url a");
      a.innerHTML = wikiurl.replace('*', result.language);
      a.href = wikiurl.replace('*', result.language);
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener('click', save);
}