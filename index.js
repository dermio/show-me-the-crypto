const STATE = {
  COINS: []
};

function displayCoin(coin) {
  let { name } = coin;

  return `<div>${name}</div>`;
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

  /* Runs on user input.
  1. User clicks button to update coin list info.
  2. User inputs text to filter for coin name or ticker.
  */

}

function ready(fn) {
  if (document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(startApp);
