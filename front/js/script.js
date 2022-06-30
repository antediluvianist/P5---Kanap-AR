// Constante qui stocke l'url de l'API //

const SERVER_URL = "http://localhost:3000/api/products/";

// Recuperation des donnees de l'API (fetch) //

fetch(SERVER_URL)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (data) {
    buildContent(data);
  })
  .catch(function (err) {
    console.log(err);
  });

// Fonction construction de contenu (buildContent)

function buildContent(item) {
  // Constante pour injection d'objets //
  const queryItems = document.getElementById("items");
  for (let i = 0; i < item.length; i++) {
    const productItem =
      // Injection du code HTML
      `<a href="./product.html?id=${item[i]._id}">
      <article>
          <img src="${item[i].imageUrl}" alt="${item[i].altTxt}">
          <h3 class="productName">${item[i].name}</h3>
          <p class="productDescription">${item[i].description}</p>  
      </article>
  </a>`;
    queryItems.insertAdjacentHTML("beforeend", productItem);
  }
}
