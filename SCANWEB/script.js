function extractData() {
    var urlInput = document.getElementById('url-input').value.trim();
    var linksList = document.getElementById('links-list');
    var subdomainsList = document.getElementById('subdomains-list');
  
    // Reiniciar resultados anteriores
    linksList.innerHTML = '';
    subdomainsList.innerHTML = '';
  
    // Expresión regular para extraer enlaces
    var linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    var matches;
  
    while ((matches = linkRegex.exec(urlInput)) !== null) {
      var link = matches[2].trim();
      var listItem = document.createElement('li');
      listItem.textContent = link;
      linksList.appendChild(listItem);
    }
  
    // Expresión regular para extraer subdominios
    var subdomainRegex = /^(?:https?:\/\/)?([^\/\s]+)\./gi;
    var subdomains = new Set();
  
    while ((matches = subdomainRegex.exec(urlInput)) !== null) {
      var subdomain = matches[1].trim().toLowerCase();
      subdomains.add(subdomain);
    }
  
    subdomains.forEach(function(subdomain) {
      var listItem = document.createElement('li');
      listItem.textContent = subdomain;
      subdomainsList.appendChild(listItem);
    });
  
    // Mostrar resultados
    var resultSection = document.getElementById('result-section');
    resultSection.style.display = 'block';
  }
  
