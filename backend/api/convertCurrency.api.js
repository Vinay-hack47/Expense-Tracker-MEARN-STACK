import axios from "axios";

// const API_KEY = "your-api-key"; // Replace with your API key
const BASE_URL =" https://v6.exchangerate-api.com/v6/f284b4e225130900a2c21a5a/latest"

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const res = await axios.get(`${BASE_URL}/${fromCurrency}`);

    // const rate = res.data.rates[toCurrency];
    const rate = res.data.conversion_rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    return amount * rate;
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw new Error("Failed to convert currency");
  }
};