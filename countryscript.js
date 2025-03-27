document.addEventListener('DOMContentLoaded', () => {
    const countriesSelect = document.getElementById('countries');
    const countryDetails = document.getElementById('country-details');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countriesSelect.appendChild(option);
            });
        })
        .catch(error => {
            showError('Failed to load countries list');
        });

    countriesSelect.addEventListener('change', async (e) => {
        const selectedCountry = e.target.value;
        if (!selectedCountry) {
            countryDetails.classList.remove('active');
            return;
        }

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(selectedCountry)}`);
            const data = await response.json();
            const country = data[0];

            countryDetails.innerHTML = `
                <h2>${country.name.official}</h2>
                <img src="${country.flags.png}" alt="${country.name.common} Flag" class="flag-img">
                <div class="detail-item">
                    <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
                </div>
                <div class="detail-item">
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                </div>
                <div class="detail-item">
                    <p><strong>Region:</strong> ${country.region}</p>
                </div>
                <div class="detail-item">
                    <p><strong>Subregion:</strong> ${country.subregion || 'N/A'}</p>
                </div>
                <div class="detail-item">
                    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ') || 'N/A'}</p>
                </div>
            `;
            
            countryDetails.classList.add('active');
        } catch (error) {
            showError('Failed to load country details');
        }
    });

    function showError(message) {
        countryDetails.innerHTML = `
            <div class="error-message" style="color: #e74c3c; padding: 1rem; background: #f8d7da; border-radius: 6px;">
                ${message}
            </div>
        `;
        countryDetails.classList.add('active');
    }
});