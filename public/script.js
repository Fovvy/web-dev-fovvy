
document.addEventListener('DOMContentLoaded', () => {
    const rateForm = document.getElementById('rateForm');
    const occupantsInput = document.getElementById('occupants');
    const agesContainer = document.getElementById('agesContainer');
    const apiResponsePre = document.getElementById('apiResponse');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formattedResultsDiv = document.getElementById('formattedResults');
    const toggleJsonResponseBtn = document.getElementById('toggleJsonResponseBtn');


    formattedResultsDiv.style.display = 'none';
    apiResponsePre.style.display = 'none';

    function updateAgeInputFields() {
        const numOccupants = parseInt(occupantsInput.value, 10) || 0;
        agesContainer.innerHTML = '';

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
    updateAgeInputFields();

    if (toggleJsonResponseBtn) {
        toggleJsonResponseBtn.style.display = 'none'; 
        toggleJsonResponseBtn.addEventListener('click', () => {
            const isHidden = apiResponsePre.style.display === 'none';
            apiResponsePre.style.display = isHidden ? 'block' : 'none';
        });
    }


    function formatDateToDDMMYYYY(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateString;
    }

    rateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loadingIndicator.style.display = 'block';
        apiResponsePre.textContent = '';
        formattedResultsDiv.style.display = 'none';
        
        apiResponsePre.style.display = 'none'; 
        if(toggleJsonResponseBtn) {
            toggleJsonResponseBtn.style.display = 'none';
        }

        const formData = new FormData(rateForm);
        const ages = [];
        for (let i = 0; i < parseInt(formData.get('occupants'), 10); i++) {
            ages.push(parseInt(formData.get(`age${i}`), 10));
        }

        const arrivalDateRaw = formData.get('arrivalDate');
        const departureDateRaw = formData.get('departureDate');

        const payload = {
            "Unit Name": formData.get('unitName'),
            "Arrival": formatDateToDDMMYYYY(arrivalDateRaw),
            "Departure": formatDateToDDMMYYYY(departureDateRaw),
            "Occupants": parseInt(formData.get('occupants'), 10),
            "Ages": ages
        };

        try {
            const response = await fetch('api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            loadingIndicator.style.display = 'none';
            const responseData = await response.json();

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                if (responseData && responseData.error) {
                    errorMessage = responseData.error; // Error from our PHP script
                } else if (responseData && responseData.ratesData && responseData.ratesData.Legs && responseData.ratesData.Legs.length > 0 && responseData.ratesData.Legs[0]['Error Message']) {
                    errorMessage = responseData.ratesData.Legs[0]['Error Message']; // Error from external Gondwana API
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData; // Error might be a plain string
                }
                throw new Error(errorMessage);
            }
            
            apiResponsePre.textContent = JSON.stringify(responseData, null, 2);

            const unitNameDropdown = document.getElementById('unitName');
            const selectedUnitOption = unitNameDropdown.options[unitNameDropdown.selectedIndex];
            document.getElementById('resultUnitName').textContent = selectedUnitOption ? selectedUnitOption.text : payload["Unit Name"];
            document.getElementById('resultDateRange').textContent = `${payload.Arrival} - ${payload.Departure}`; // Display dates as submitted
            
            let rate = 'N/A';
            let availabilityHTML = 'N/A';

            if (responseData && responseData.ratesData) {
                const ratesInfo = responseData.ratesData;
                if (ratesInfo['Total Charge'] !== undefined) {
                    rate = ratesInfo['Total Charge']; 
                } else {
                    rate = 'N/A';
                }

                if (ratesInfo.Legs && ratesInfo.Legs.length > 0) { // Availability check based on Error Code
                    const leg = ratesInfo.Legs[0];
                    if (leg['Error Code'] === 0) {
                        availabilityHTML = '<span class="availability-icon">✔️</span> Available';
                    } else {
                        availabilityHTML = `<span class="availability-icon">❌</span> Not Available (Error: ${leg['Error Code']}${leg['Error Message'] ? ' - ' + leg['Error Message'] : ''})`;
                    }
                } else {
                    availabilityHTML = 'Availability data missing.';
                }
            } else if (responseData && responseData.error) {
                availabilityHTML = `<span class="availability-icon">⚠️</span> Error: ${responseData.error}`; // Handle error from our API
            } else {
                rate = 'N/A';
                availabilityHTML = 'Could not determine rate or availability.';
            }

            document.getElementById('resultRate').textContent = rate;
            document.getElementById('resultAvailability').innerHTML = availabilityHTML;
            formattedResultsDiv.style.display = 'block';

            apiResponsePre.textContent = JSON.stringify(responseData, null, 2);
            if(toggleJsonResponseBtn) toggleJsonResponseBtn.style.display = 'block';



        } catch (error) {
            loadingIndicator.style.display = 'none';
            const errorDisplay = `Error: ${error.message}`;
            apiResponsePre.textContent = errorDisplay;
            apiResponsePre.style.display = 'block';
            document.getElementById('resultAvailability').innerHTML = `<span class="availability-icon">⚠️</span> ${errorDisplay}`;
            formattedResultsDiv.style.display = 'block';
            if(toggleJsonResponseBtn) toggleJsonResponseBtn.style.display = 'block';
        }
    });

    if (toggleJsonResponseBtn) toggleJsonResponseBtn.style.display = 'none';
});
