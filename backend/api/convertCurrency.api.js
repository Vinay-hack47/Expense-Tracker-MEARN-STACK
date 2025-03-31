import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =` https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest`

console.log(BASE_URL);


export const convertCurrency = async (amount, fromCurrency, toCurrency ) => {
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