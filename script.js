document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('country-select');
  const nameInput = document.getElementById('name-input');
  const distanceInput = document.getElementById('distance-input');
  const convertButton = document.getElementById('convert-button');
  const milsResult = document.getElementById('mils-result');
  const historyBody = document.getElementById('history-body');

  // Conversion equations
  const conversionEquations = {
    'US': (x) => ((1600 - x) * 0.237333) + 622,
    'RUS': (x) => ((1600 - x) * 0.213333) + 800,
    'UK': (x) => ((1600 - x) * 0.177333) + 267
  };

  // Function to convert distance to mils
  function convertToMils(country, distance) {
    const equation = conversionEquations[country];
    if (equation) {
      return equation(distance);
    }
    return NaN;
  }

  // Function to update the mils result
  function updateMilsResult() {
    const country = countrySelect.value;
    const distance = parseFloat(distanceInput.value);
    if (country && !isNaN(distance)) {
      const mils = convertToMils(country, distance);
      if (!isNaN(mils)) {
        milsResult.textContent = mils.toFixed(2);
        return;
      }
    }
    milsResult.textContent = '';
  }

  // Function to add a new history entry
  function addHistoryEntry() {
    const country = countrySelect.value;
    const name = nameInput.value.trim();
    const distance = parseFloat(distanceInput.value);
    const mils = parseFloat(milsResult.textContent);

    if (country && name && !isNaN(distance) && !isNaN(mils)) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="lock-checkbox"></td>
        <td>${country}</td>
        <td>${name}</td>
        <td>${distance}</td>
        <td>${mils}</td>
      `;
      historyBody.insertBefore(row, historyBody.firstChild);

      // Clear input fields
      nameInput.value = '';
      distanceInput.value = '';

      // Limit history to 10 entries
      if (historyBody.children.length > 10) {
        const nonLockedRows = Array.from(historyBody.children).filter(row => !row.querySelector('.lock-checkbox').checked);
        if (nonLockedRows.length > 10) {
          historyBody.removeChild(nonLockedRows[nonLockedRows.length - 1]);
        }
      }
    }
  }

  // Event listener for convert button
  convertButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    updateMilsResult();
    addHistoryEntry();
  });

  // Event listener for lock checkboxes
  historyBody.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('lock-checkbox')) {
      const row = target.closest('tr');
      row.classList.toggle('locked');
      checkHistoryLimit(); // Update history limit when locking/unlocking rows
    }
  });

  // Function to check and enforce history limit
  function checkHistoryLimit() {
    const rows = historyBody.getElementsByTagName('tr');
    const nonLockedRows = Array.from(rows).filter(row => !row.querySelector('.lock-checkbox').checked);
    if (nonLockedRows.length > 10) {
      historyBody.removeChild(nonLockedRows[nonLockedRows.length - 1]);
    }
  }

  // Initial history limit check
  checkHistoryLimit();
});
