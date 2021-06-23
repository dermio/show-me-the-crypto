function fetchCryptoData() {
  let API_URL = "https://api.coingecko.com/api/v3/coins/markets";

  /* Change the object with the API string parameters into
  a URLSearchParams object. The URL object has utility methods that work
  with the query string of a URL. */
  let params = new URLSearchParams({
    vs_currency: "USD",
    per_page: 100
  });

  // Change the URL parameter object into a URL query string.
  let QUERY_PARAMS = params.toString();

  fetch(API_URL + "?" + QUERY_PARAMS)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log("Error", err));
}

function displayFooterInfo() {
  let footer = document.getElementsByTagName("footer")[0];
  let year = `© ${new Date().getFullYear()}`;
  let link = "<a href='#top'>Show Me the Crypto</a>";
  footer.innerHTML = `${year} ${link}`;
}

function startApp() {
  // code
  displayFooterInfo();
  fetchCryptoData();
}

function ready(fn) {
  if (document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(startApp);
