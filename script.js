document.addEventListener("DOMContentLoaded", function() {
    const fromWrapper = document.getElementById("from-currency-wrapper");
    const toWrapper = document.getElementById("to-currency-wrapper");
    const convertButton = document.getElementById("convertButton");
    const resultEl = document.getElementById("result");
    const amountInput = document.getElementById("amount");
    const refreshButton = document.getElementById("refreshButton");

    // --- SET INITIAL STATE ON PAGE LOAD ---
    amountInput.value = ""; // Clear amount field on startup
    resultEl.textContent = "Enter amount 💰 and click convert 🔄"; // Set initial message
    resultEl.className = 'placeholder'; // Ensure correct initial styling

    // --- Custom Dropdown Logic ---
    function createCustomDropdown(wrapper) {
        const selectedOption = wrapper.querySelector(".selected-option");
        const selectedText = selectedOption.querySelector(".selected-text");
        const optionsContainer = wrapper.querySelector(".options-container");
        const searchInput = wrapper.querySelector(".search-box input");
        const optionsList = wrapper.querySelector(".options-list");
        let selectedValue = null;

        // 1. Populate the dropdown
        for (const currency_code in country_list) {
            const countryName = country_list[currency_code];
            const optionEl = document.createElement("li");
            optionEl.textContent = `${countryName} (${currency_code})`;
            optionEl.dataset.value = currency_code;
            optionsList.appendChild(optionEl);
        }

        // 2. Reset function to set initial and refreshed state
        function reset() {
            selectedValue = null;
            selectedText.textContent = "Select Currency";
            searchInput.value = "";
            // Un-hide all options in case they were filtered
            optionsList.querySelectorAll("li").forEach(opt => opt.classList.remove("hidden"));
        }

        // 3. Toggle dropdown visibility
        selectedOption.addEventListener("click", () => {
            wrapper.classList.toggle("open");
        });

        // 4. Handle option selection
        optionsList.addEventListener("click", (e) => {
            if (e.target.tagName === "LI") {
                selectedValue = e.target.dataset.value;
                selectedText.textContent = e.target.textContent;
                wrapper.classList.remove("open");
            }
        });

        // 5. Handle search/filtering
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const options = optionsList.querySelectorAll("li");
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.classList.toggle("hidden", !text.includes(searchTerm));
            });
        });
        
        // Initialize to default state
        reset();

        return {
            getSelectedValue: () => selectedValue,
            reset: reset // Expose the reset function
        };
    }

    const fromDropdown = createCustomDropdown(fromWrapper);
    const toDropdown = createCustomDropdown(toWrapper);
    
    // --- Close dropdown when clicking outside ---
    document.addEventListener('click', (e) => {
        if (!fromWrapper.contains(e.target)) {
            fromWrapper.classList.remove('open');
        }
        if (!toWrapper.contains(e.target)) {
            toWrapper.classList.remove('open');
        }
    });

    // --- REFRESH BUTTON LOGIC ---
    refreshButton.addEventListener("click", () => {
        amountInput.value = "";
        fromDropdown.reset();
        toDropdown.reset();
        resultEl.textContent = "Enter amount 💰 and click convert 🔄";
        resultEl.className = 'placeholder'; // Reset classes to default
    });

    // --- Currency Conversion Logic ---
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromDropdown.getSelectedValue();
        const to = toDropdown.getSelectedValue();

        // Remove any previous error/success styling
        resultEl.className = '';

        if (!from || !to) {
            resultEl.textContent = "Please select both currencies.";
            resultEl.classList.add("error");
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            resultEl.textContent = "Please enter a valid amount.";
            resultEl.classList.add("error");
            return;
        }
        
        resultEl.textContent = "Converting...";

        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await response.json();

            if (data.result === "error") {
                resultEl.textContent = "API Error. Please try again later.";
                resultEl.classList.add("error");
                return;
            }

            const rate = data.rates[to];
            const convertedAmount = (amount * rate).toFixed(2);

            resultEl.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
            resultEl.classList.add("converted");

        } catch (error) {
            resultEl.textContent = "Network error. Check your connection.";
            resultEl.classList.add("error");
            console.error("Fetch Error:", error);
        }
    }
    
    convertButton.addEventListener("click", convertCurrency);
    amountInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            convertCurrency();
        }
    });
});

