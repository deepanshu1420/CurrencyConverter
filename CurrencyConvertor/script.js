document.addEventListener("DOMContentLoaded", function() {
    const convertButton = document.getElementById("convertButton");
    convertButton.addEventListener("click",convertCurrency);
});

function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;

    const conversionRates = {
        USD: { EUR: 0.85, JPY: 110.64, INR: 74.91 },
        EUR: { USD: 1.18, JPY: 130.67, INR: 88.77 },
        JPY: { USD: 0.009, EUR: 0.0076, INR: 0.67 },
        INR: { USD: 0.013, EUR: 0.011, JPY: 1.49 }
    };

    if(conversionRates[fromCurrency] && conversionRates[fromCurrency][toCurrency]) {
        const convertedAmount = amount*conversionRates[fromCurrency][toCurrency];

        document.getElementById("result").textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        document.getElementById("result").textContent = "Conversion is not available";
    }
}