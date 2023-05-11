function extractData() {
  var urlInput = document.getElementById("url-input");
  var url = urlInput.value.trim();

  // Validar que la URL tenga el formato correcto
  var urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/.*)?$/;
  if (!urlPattern.test(url)) {
    alert("Ingresa una URL válida en el formato http://www.ejemplo.com");
    return;
  }

  // Realizar una solicitud HTTP para obtener el HTML de la página
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var html = this.responseText;

      // Extraer URLs y subdominios
      var urls = extractUrls(html);
      var subdomains = extractSubdomains(urls);

      // Mostrar resultados
      displayResults(urls, subdomains);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function extractUrls(html) {
  var urlRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
  var urls = html.match(urlRegex) || [];
  return urls;
}

function extractSubdomains(urls) {
  var subdomains = [];
  var subdomainRegex = /^(https?:\/\/)?([^\/]+)\./i;

  for (var i = 0; i < urls.length; i++) {
    var match = urls[i].match(subdomainRegex);
    if (match && match[2]) {
      subdomains.push(match[2]);
    }
  }

  return subdomains;
}

function displayResults(urls, subdomains) {
  var linksList = document.getElementById("links-list");
  var subdomainsList = document.getElementById("subdomains-list");

  // Limpiar resultados anteriores
  linksList.innerHTML = "";
  subdomainsList.innerHTML = "";

  // Mostrar URLs
  for (var i = 0; i < urls.length; i++) {
    var linkItem = document.createElement("li");
    linkItem.textContent = urls[i];
    linksList.appendChild(linkItem);
  }

  // Mostrar subdominios
  for (var j = 0; j < subdomains.length; j++) {
    var subdomainItem = document.createElement("li");
    subdomainItem.textContent = subdomains[j];
    subdomainsList.appendChild(subdomainItem);
  }
}
