const QUERY_ITEMS = document.getElementById("items");
const SERVER_URL = "http://localhost:3000/api/products/";

fetch(SERVER_URL)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    createContent(data);
  })
  .catch(function (err) {
    console.log(err);
  });
