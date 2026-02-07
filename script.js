(function () {
  const billInput = document.getElementById('bill');
  const tipInput = document.getElementById('tipPercent');
  const peopleInput = document.getElementById('people');
  const tipPerPersonEl = document.getElementById('tipPerPerson');
  const totalPerPersonEl = document.getElementById('totalPerPerson');
  const billHint = document.getElementById('bill-hint');
  const tipHint = document.getElementById('tip-hint');
  const peopleHint = document.getElementById('people-hint');
  const presetBtns = document.querySelectorAll('.btn-preset');
  const resetBtn = document.getElementById('resetBtn');
  const copyBtn = document.getElementById('copyBtn');

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  function parseDecimal(value) {
    const cleaned = String(value).replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return null;
    if (parts.length === 2 && parts[1].length > 2) return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  function restrictNumeric(inputEl, allowDecimal) {
    inputEl.addEventListener('keydown', function (e) {
      const key = e.key;
      if (key === 'Backspace' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Enter') return;
      if (key === '.' && allowDecimal) {
        if (inputEl.value.includes('.')) e.preventDefault();
        return;
      }
      if (!/^\d$/.test(key)) e.preventDefault();
    });
  }

  restrictNumeric(billInput, true);
  restrictNumeric(tipInput, true);
  restrictNumeric(peopleInput, false);

  function validateAndCalculate() {
    const billRaw = billInput.value.trim();
    const tipRaw = tipInput.value.trim();
    const peopleRaw = peopleInput.value.trim() || '1';

    let bill = parseDecimal(billRaw);
    let tipPercent = tipRaw === '' ? null : parseDecimal(tipRaw);
    let people = parseInt(peopleRaw, 10);

    // Reset hints
    [billHint, tipHint, peopleHint].forEach(h => {
      h.textContent = '';
      h.classList.remove('error');
    });

    let isValid = true;

    if (billRaw !== '' && (bill === null || bill < 0)) {
      billHint.textContent = 'Enter a valid positive amount';
      billHint.classList.add('error');
      isValid = false;
    }
    if (tipRaw !== '' && (tipPercent === null || tipPercent < 0 || tipPercent > 100)) {
      tipHint.textContent = 'Enter 0-100';
      tipHint.classList.add('error');
      isValid = false;
    }
    if (peopleRaw !== '' && (isNaN(people) || people <= 0)) {
      peopleHint.textContent = 'Must be at least 1';
      peopleHint.classList.add('error');
      isValid = false;
    }

    if (isValid && bill !== null) {
      const percent = tipPercent !== null ? tipPercent : 0;
      const numPeople = people > 0 ? people : 1;
      
      const totalTip = bill * (percent / 100);
      const totalBill = bill + totalTip;
      
      const tipPerPerson = totalTip / numPeople;
      const totalPerPerson = totalBill / numPeople;

      tipPerPersonEl.textContent = '$' + tipPerPerson.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      totalPerPersonEl.textContent = '$' + totalPerPerson.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
      tipPerPersonEl.textContent = '$0.00';
      totalPerPersonEl.textContent = '$0.00';
    }
  }

  // Preset Handlers
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tipInput.value = btn.dataset.pct;
      validateAndCalculate();
    });
  });

  tipInput.addEventListener('input', () => {
    presetBtns.forEach(b => b.classList.remove('active'));
    validateAndCalculate();
  });

  billInput.addEventListener('input', validateAndCalculate);
  peopleInput.addEventListener('input', validateAndCalculate);

  // Action Buttons
  resetBtn.addEventListener('click', () => {
    billInput.value = '';
    tipInput.value = '';
    peopleInput.value = '';
    presetBtns.forEach(b => b.classList.remove('active'));
    validateAndCalculate();
  });

  copyBtn.addEventListener('click', async () => {
    const text = `Bill Split Details:
- Bill: $${billInput.value || '0.00'}
- Tip: ${tipInput.value || '0'}%
- People: ${peopleInput.value || '1'}
- Tip/Person: ${tipPerPersonEl.textContent}
- Total/Person: ${totalPerPersonEl.textContent}`;

    try {
      await navigator.clipboard.writeText(text);
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i data-lucide="check" size="18"></i> Copied!';
      lucide.createIcons();
      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        lucide.createIcons();
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });

  validateAndCalculate();
})();

