let lastGeneratedCards = [];

document.getElementById('generate-btn').addEventListener('click', generateCards);
document.getElementById('output-format').addEventListener('change', updateOutputFromUI);
document.getElementById('include-expiry').addEventListener('change', updateOutputFromUI);
document.getElementById('include-cvv').addEventListener('change', updateOutputFromUI);

function showNotification(message, color = 'blue') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white bg-${color}-500 border border-${color}-600 z-50`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function updateOutputFromUI() {
  const format = document.getElementById('output-format').value;
  const includeExpiry = document.getElementById('include-expiry').checked;
  const includeCVV = document.getElementById('include-cvv').checked;
  updateCardsOutput(format, includeExpiry, includeCVV);
}

function updateCardsOutput(format, includeExpiry, includeCVV) {
  if (!lastGeneratedCards.length) {
    document.getElementById('generated-cards').value = '';
    return;
  }
  let cards = [];
  for (const card of lastGeneratedCards) {
    if (format === 'plain') {
      let cardData = card.number;
      if (includeExpiry && card.expiry) cardData += `|${card.expiry}`;
      if (includeCVV && card.cvv) cardData += `|${card.cvv}`;
      cards.push(cardData);
    } else if (format === 'json') {
      const cardObj = { number: card.number };
      if (includeExpiry && card.expiry) cardObj.expiry = card.expiry;
      if (includeCVV && card.cvv) cardObj.cvv = card.cvv;
      cards.push(JSON.stringify(cardObj));
    } else if (format === 'xml') {
      cards.push(`<card>
  <number>${card.number}</number>
  ${includeExpiry && card.expiry ? `<expiry>${card.expiry}</expiry>` : ''}
  ${includeCVV && card.cvv ? `<cvv>${card.cvv}</cvv>` : ''}
</card>`);
    } else if (format === 'sql') {
      cards.push(`INSERT INTO cards (card_number, expiry_date, cvv) VALUES ('${card.number}', '${card.expiry}', '${card.cvv}');`);
    } else if (format === 'csv') {
      cards.push(`"${card.number}","${card.expiry}","${card.cvv}"`);
    }
  }
  let output = '';
  if (format === 'json') {
    output = '[\n  ' + cards.join(',\n  ') + '\n]';
  } else if (format === 'xml') {
    output = '<cards>\n' + cards.join('\n') + '\n</cards>';
  } else {
    output = cards.join('\n');
  }
  document.getElementById('generated-cards').value = output;
}

function isAmex(binPattern) {
  return /^3/.test(binPattern);
}

function generateValidCard(binPattern) {
  let targetLength = isAmex(binPattern) ? 15 : 16;
  let cardNumber = '';
  let trimmedBin = binPattern.slice(0, targetLength - 1);
  for (let i = 0; i < trimmedBin.length; i++) {
    if (trimmedBin[i].toLowerCase() === 'x') {
      cardNumber += Math.floor(Math.random() * 10);
    } else {
      cardNumber += trimmedBin[i];
    }
  }
  while (cardNumber.length < targetLength - 1) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  let sum = 0;
  for (let i = cardNumber.length - 1, alt = true; i >= 0; i--, alt = !alt) {
    let digit = parseInt(cardNumber[i]);
    if (alt) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  cardNumber += checkDigit;
  return cardNumber;
}

function generateCards() {
  let bin = document.getElementById('bin').value;
  const quantity = parseInt(document.getElementById('quantity').value) || 10;
  const format = document.getElementById('output-format').value;
  const includeExpiry = document.getElementById('include-expiry').checked;
  const includeCVV = document.getElementById('include-cvv').checked;

  if (!/^[\dx]{6,19}$/i.test(bin)) {
    showNotification('El BIN debe contener solo dígitos (ej: 654321, 654321xxxxxxx)', 'red');
    return;
  }

  if (/^\d{6,16}$/.test(bin)) {
    if (isAmex(bin)) {
      if (bin.length < 15) {
        bin = bin.padEnd(15, 'x');
        document.getElementById('bin').value = bin;
      }
    } else {
      if (bin.length < 16) {
        bin = bin.padEnd(16, 'x');
        document.getElementById('bin').value = bin;
      }
    }
  }
  if (bin.length < 6) {
    showNotification('El BIN debe tener al menos 6 caracteres', 'red');
    return;
  }

  lastGeneratedCards = [];
  let cvvInput = document.getElementById('cvv').value;
  for (let i = 0; i < quantity; i++) {
    let expiry = '';
    if (includeExpiry) {
      let month = document.getElementById('expiry-month').value;
      let year = document.getElementById('expiry-year').value;
      const now = new Date();
      if (month === "random") {
        month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      }
      if (year === "random") {
        const currentYear = now.getFullYear();
        const minYear = currentYear + 1;
        const maxYear = currentYear + 6;
        const randomYear = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
        year = String(randomYear);
      } else if (year.length === 2) {
        year = '20' + year;
      }
      expiry = `${month}|${year}`;
    }
    const cardNumber = generateValidCard(bin);
    let cvv = '';
    if (includeCVV) {
      if (cvvInput.trim() === '') {
        cvv = isAmex(bin) ? 
          Math.floor(1000 + Math.random() * 9000).toString() : 
          Math.floor(100 + Math.random() * 900).toString();
      } else {
        cvv = cvvInput;
      }
    }
    lastGeneratedCards.push({
      number: cardNumber,
      expiry: includeExpiry ? expiry : '',
      cvv: includeCVV ? cvv : ''
    });
  }
  updateCardsOutput(format, includeExpiry, includeCVV);
  showNotification(`${quantity} tarjetas generadas con éxito`, 'green');
}
