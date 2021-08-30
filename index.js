const STATE = {
  COINS: []
};

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

function formatPrice(price) {
  let options = {
    style: "currency",
    currency: "USD",
    /* A price less than one dollar displays to four decimal places.
    A price greater than or equal to a dollar displays to two decimal
    places. */
    minimumFractionDigits: (price < 1) ? 4 : 2
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
        ${change < 0
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

function displayCoinsList() {
  /* After getting the returned promise object and resulting value
  from fetchCryptoData, in the then method callback use the STATE coins array
  to create the coins list in HTML. */
  return fetchCryptoData()
    .then(() => {
      let { COINS } = STATE;
      let coinsContainer = document.getElementsByClassName("coin-list")[0];
      console.log("[[[ displayCoinsList ]]]", COINS);

      let coinsList = COINS.map(coin => displayCoin(coin)).join("");

      coinsContainer.innerHTML = coinsList;
    })
    .catch(err => {
      console.log("Error", err);
      return err;
    });
}

function fetchCryptoData() {
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

  return fetch(API_URL + "?" + QUERY_PARAMS)
    .then(res => res.json())
    .then(data => {
      /* After making the API call, set the COINS array to the response data.
      The successful completion of the async operation returns the promise
      object and the resulting value. In this case `undefined` is returned.
      However the updated STATE object can also be returned. */

      STATE.COINS = data;
      // console.log("[[[ fetchCryptoData ]]]", STATE.COINS);
    })
    .catch(err => {
      console.log("Error", err);
      return err;
    });
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
  let button = document.getElementsByTagName("button")[0];
  button.addEventListener("click", updateCoinsList);
  /* User clicks h1 to update coins list info. */
  let h1 = document.getElementsByTagName("h1")[0];
  h1.addEventListener("click", updateCoinsList);
  /* User inputs text to filter for coin name or ticker. */
  let inputText = document.getElementsByTagName("input")[0];
  inputText.addEventListener("input", displayFilteredCoinsList);
}

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(startApp);
