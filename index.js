const STATE = {
  COINS: [],
  storedTheme: localStorage.getItem("theme")
};

/* Check if the dark theme was previously enabled by the user. If true enable
the dark theme */
if (STATE.storedTheme === "dark") { document.body.classList.add("dark"); }

function darkModeToggle() {
  if (STATE.storedTheme === "dark") {
    STATE.storedTheme = "";
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "");
  } else {
    STATE.storedTheme = "dark";
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

function formatNumber(number) {
  let num;

  switch (true) {
    case number < 1000:
      return number;
    case number < 10 ** 6:
      num = number / 10 ** 3;
      return `${num.toFixed(1)}K`;
    case number < 10 ** 9:
      num = number / 10 ** 6;
      return `${num.toFixed(1)}M`;
    case number < 10 ** 12:
      num = number / 10 ** 9;
      return `${num.toFixed(1)}B`;
    case number < 10 ** 15:
      num = number / 10 ** 12;
      return `${num.toFixed(1)}T`;
    default:
      return "Rico Suave";
  }
}

function fractionDigits(price) {
  // A price greater than or equal to 0.10 displays to two decimal places.
  if (price >= 0.1) { return 2; }

  /* Convert a number that's less than 0.10 to a string.
  Whole numbers and tenths place values are zeros, i.e. 0.0X. */
  let priceStr = price.toString();
  /* Start the count at the hundredths place, `0.0X`, in the string.
  This is index 3. */
  let index = 3;

  /* As soon as the first non-zero number is encountered, return the index
  to stop the loop and exit the function. The non-zero number at the index,
  and the next number at index + 1 will be included as significant digits
  in the fraction price. */
  while (index < priceStr.length) {
    if (priceStr[index] !== "0") {
      return index;
    }
    index++;
  }

  /* NOTE: The `minimumFractionDigits` is the number of digits to display
  after the decimal point in the formatPrice function. By chance the string
  index count and the `minimumFractionDigits` have the same value.

  Example:
  The number is 0.068, the string is `0.068`.
  The `6` is the 4th character in the string, found at index 3, and
  the number 6 is at the hundredths place in the number.
  The `8` is the 5th character in the string, found at index 4, and
  the number 8 is at the thousandths place in the humber.
  The return of index 3, that is the number 6, happens to be
  the thousandths decimal place of the number 8 at index 4.

  Thus the `minimumFractionDigits` and index values are the same.
  */
}

function formatPrice(price) {
  let options = {
    style: "currency",
    currency: "USD",
    /* A price greater than or equal to 0.10 displays to two decimal places.
    A price less than 0.10 will display the first non-zero digit to the right
    of the decimal point, and the digit that follows it. */
    minimumFractionDigits: fractionDigits(price)
  };

  return new Intl.NumberFormat("en-US", options).format(price);
}

function displayFilteredCoinsList(event) {
  let text = event.target.value.toLowerCase();
  let { COINS } = STATE;
  let coinsContainer = document.getElementsByClassName("coin-list")[0];

  let coinsList = COINS
    .filter(coin => (
      coin.name.toLowerCase().includes(text) ||
      coin.symbol.toLowerCase().includes(text)
    ))
    .map(coin => displayCoin(coin))
    .join("");

  coinsContainer.innerHTML = coinsList;
}

function updateCoinsList() {
  let inputText = document.getElementsByTagName("input")[0];
  let coinsContainer = document.getElementsByClassName("coin-list")[0];

  // Remove any search coin text in input.
  inputText.value = "";
  coinsContainer.innerHTML = "<h2 class='loading'>Loading...</h2>";

  displayCoinsList();
}

function displayCoin(coin) {
  let {
    name, id, symbol, image,
    current_price: price,
    price_change_percentage_24h: change,
    total_volume: volume,
    market_cap: marketcap,
    circulating_supply: supply
  } = coin;

  return `
    <div id="${id}" class="coin-container">
      <div class="coin">
        <img src="${image}" alt="${id}">
        <div class="coin-name">
          <p>${name}</p>
          <p>${symbol}</p>
        </div>
      </div>
      <div class="price-change">
        <p>${formatPrice(price)}</p>
        ${
          change === null
            ? `<p class="change-pct">&#128123; &#128123; &#128123;</p>`
            : change < 0
            ? `<p class="change-pct red">${change.toFixed(2)}%</p>`
            : `<p class="change-pct green">+${change.toFixed(2)}%</p>`
        }
      </div>
      <div class="volume-cap-supply">
        <div>
          <p>Vol 24h:</p>
          <p>$${formatNumber(volume)}</p>
        </div>
        <div>
          <p>Cap:</p>
          <p>$${formatNumber(marketcap)}</p>
        </div>
        <div>
          <p>Supply:</p>
          <p>${formatNumber(supply)}</p>
        </div>
      </div>
    </div>
  `;
}

async function displayCoinsList() {
  /* After getting the returned promise object and resulting value
  from fetchCryptoData, in the then method callback use the STATE coins array
  to create the coins list in HTML. */
  try {
    await fetchCryptoData();
    let { COINS } = STATE;
    let coinsContainer = document.getElementsByClassName("coin-list")[0];
    console.log("[[[ displayCoinsList ]]]", COINS);

    let coinsList = COINS.map(coin => displayCoin(coin)).join("");
    coinsContainer.innerHTML = coinsList;
  } catch (err) {
    console.log("Error", err);
    return err;
  }
}

async function fetchCryptoData() {
  let API_URL = "https://api.coingecko.com/api/v3/coins/markets";

  /* Change the object with the API string parameters into
  a URLSearchParams object. The URL object has utility methods that work
  with the query string of a URL. */
  let params = new URLSearchParams({
    vs_currency: "usd",
    per_page: 100
  });

  // Change the URL parameter object into a URL query string.
  let QUERY_PARAMS = params.toString();

  try {
    let response = await fetch(API_URL + "?" + QUERY_PARAMS);
    let data = await response.json();
    /* After making the API call, set the COINS array to the response data.
    The successful completion of the async operation returns the promise
    object and the resulting value. In this case `undefined` is returned.
    However the updated STATE object can also be returned. */

    STATE.COINS = data;
  } catch (err) {
    console.log("Error", err);
    return err;
  }
}

function displayFooterInfo() {
  let footer = document.getElementsByTagName("footer")[0];
  let year = `© ${new Date().getFullYear()}`;
  let link = "<a href='#top'>Show Me the Crypto</a>";
  footer.innerHTML = `${year} ${link}`;
}

function startApp() {
  /* First runs on load. */
  displayFooterInfo();
  displayCoinsList();

  /* Runs on user input. */
  /* User clicks button to update coins list info. */
  let coinUpdateBtn = document.getElementsByClassName("coin-update-button")[0];
  coinUpdateBtn.addEventListener("click", updateCoinsList);
  /* User clicks h1 to update coins list info. */
  let h1 = document.getElementsByTagName("h1")[0];
  h1.addEventListener("click", updateCoinsList);
  /* User inputs text to filter for coin name or ticker. */
  let inputText = document.getElementsByTagName("input")[0];
  inputText.addEventListener("input", displayFilteredCoinsList);
  /* User clicks dark mode button to toggle between light and dark mode. */
  let darkModeBtn = document.getElementsByClassName("dark-mode-toggle")[0];
  darkModeBtn.addEventListener("click", darkModeToggle);
}

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(startApp);
