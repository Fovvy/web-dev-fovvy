// script.js - Frontend logic will go here
document.addEventListener('DOMContentLoaded', () => {
    const rateForm = document.getElementById('rateForm');
    const occupantsInput = document.getElementById('occupants');
    const agesContainer = document.getElementById('agesContainer');
    const apiResponsePre = document.getElementById('apiResponse');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formattedResultsDiv = document.getElementById('formattedResults');

    // Initially hide formatted results
    formattedResultsDiv.style.display = 'none';

    function updateAgeInputFields() {
        const numOccupants = parseInt(occupantsInput.value, 10) || 0;
        agesContainer.innerHTML = ''; // Clear previous age inputs

        if (numOccupants > 0) {
            const agesLabel = document.createElement('label');
            agesLabel.textContent = 'Ages of Occupants:';
            agesContainer.appendChild(agesLabel);
            for (let i = 0; i < numOccupants; i++) {
                const ageInput = document.createElement('input');
                ageInput.type = 'number';
                ageInput.name = `age${i}`;
                ageInput.placeholder = `Age of Person ${i + 1}`;
                ageInput.min = '0';
                ageInput.required = true;
                agesContainer.appendChild(ageInput);
            }
        }
    }

    occupantsInput.addEventListener('input', updateAgeInputFields);
    updateAgeInputFields(); // Initial call to set up age fields based on default occupants

    rateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loadingIndicator.style.display = 'block';
        apiResponsePre.textContent = '';
        formattedResultsDiv.style.display = 'none';

        const formData = new FormData(rateForm);
        const ages = [];
        for (let i = 0; i < parseInt(formData.get('occupants'), 10); i++) {
            ages.push(parseInt(formData.get(`age${i}`), 10));
        }

        const payload = {
            "Unit Name": formData.get('unitName'), // This will be the Unit Type ID from the select value
            "Arrival": formData.get('arrivalDate'),
            "Departure": formData.get('departureDate'),
            "Occupants": parseInt(formData.get('occupants'), 10),
            "Ages": ages
        };

        try {
            // The API endpoint is relative to the current location (public/index.html)
            // So, /api/rates should correctly hit public/api/index.php?q=rates (if .htaccess is working)
            // Or, more directly, api/ (if api/ is a directory with index.php)
            const response = await fetch('api/', { // Assuming .htaccess routes /api/ to /api/index.php
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            loadingIndicator.style.display = 'none';
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
            }
            
            // Display raw JSON response for debugging
            apiResponsePre.textContent = JSON.stringify(responseData, null, 2);

            // Display formatted results
            // This part assumes a certain structure of the response from YOUR API
            // which in turn relays the structure from the external Gondwana API.
            // You'll need to adjust these based on the actual response.
            document.getElementById('resultUnitName').textContent = payload["Unit Name"]; // Or responseData.unitName if your API adds it
            document.getElementById('resultDateRange').textContent = `${payload.Arrival} - ${payload.Departure}`;
            
            // Example: Extracting rate and availability
            // This is highly speculative and depends on the external API's response format
            let rate = 'N/A';
            let availability = 'N/A';

            if (responseData && responseData.rates && responseData.rates.length > 0) {
                // Assuming rates is an array and we take the first one
                const firstRateInfo = responseData.rates[0];
                rate = firstRateInfo.RateAmount !== undefined ? firstRateInfo.RateAmount : 'N/A';
                availability = firstRateInfo.Availability === 'AVAILABLE' ? 'Available' : 'Not Available';
            } else if (responseData && responseData.RateAmount !== undefined) {
                 rate = responseData.RateAmount;
                 availability = responseData.IsAvailable ? 'Available' : 'Not Available';
            }
            // Fallback if the structure is different or not found
            else if (responseData.ratesData) { // From previous PHP example
                if (responseData.ratesData.RateAmount) rate = responseData.ratesData.RateAmount;
                if (responseData.ratesData.IsAvailable !== undefined) availability = responseData.ratesData.IsAvailable ? 'Available' : 'Not Available';
                else if (responseData.ratesData[0] && responseData.ratesData[0].Availability) {
                    availability = responseData.ratesData[0].Availability;
                    if(responseData.ratesData[0].TotalRate) rate = responseData.ratesData[0].TotalRate;
                }
            }

            document.getElementById('resultRate').textContent = rate;
            document.getElementById('resultAvailability').textContent = availability;
            formattedResultsDiv.style.display = 'block';

        } catch (error) {
            loadingIndicator.style.display = 'none';
            apiResponsePre.textContent = 'Error: ' + error.message;
            formattedResultsDiv.style.display = 'none';
        }
    });
});
