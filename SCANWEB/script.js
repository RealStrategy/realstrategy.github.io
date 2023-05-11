const extractButton = document.getElementById('extract-button');
const saveButton = document.getElementById('save-button');
const inputUrl = document.getElementById('input-url');
const resultList = document.getElementById('result-list');

let extractedUrls = [];

extractButton.addEventListener('click', () => {
  const url = inputUrl.value;
  if (url) {
    extractUrls(url);
  }
});

saveButton.addEventListener('click', () => {
  const urls = getExtractedUrls();
  saveUrls(urls);
});

function extractUrls(url) {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  fetch(proxyUrl + url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const anchors = doc.getElementsByTagName('a');
      extractedUrls = Array.from(anchors).map(anchor => anchor.href);
      displayUrls(extractedUrls);
    })
    .catch(error => {
      console.error('Error al extraer las URLs:', error);
    });
}

// Resto del código...


function displayUrls(urls) {
  resultList.innerHTML = '';

  urls.forEach((url) => {
    const listItem = document.createElement('li');
    listItem.innerText = url;
    listItem.classList.add('result-item');
    resultList.appendChild(listItem);
  });
}

function getExtractedUrls() {
  return extractedUrls;
}

function saveUrls(urls) {
  // Aquí puedes agregar tu lógica para guardar las URLs
  console.log('URLs guardadas:', urls);
}
