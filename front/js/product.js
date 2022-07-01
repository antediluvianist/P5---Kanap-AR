//////////////////////////////////////////// Page ////////////////////////////////////////////

// Constante qui stocke l'url de l'API //

const SERVER_URL = "http://localhost:3000/api/products/";

// Retourne l'url de la page

let string = window.location.href;

let url = new URL(string);
let idProduct = url.searchParams.get("id");
console.log(string);

// Création des variables de sélection ( couleurs & qté )

let choiceColor = document.querySelector("#colors");
let choiceQuantity = document.querySelector("#quantity");

getProduct();

// Fonction de récupération des articles de l'API

function getProduct() {
  fetch(SERVER_URL + idProduct)
    .then((response) => {
      return response.json();
    })

    // Répartition des données de l'API dans le DOM
    .then(async function (resultatAPI) {
      article = await resultatAPI;
      if (article) {
        buildPage(article);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

// Fonction de construction de la page

function buildPage(article) {
  // Photo
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Titre
  let productName = document.getElementById('title');
  productName.innerHTML = article.name;

  // Prix
  let productPrice = document.getElementById('price');
  productPrice.innerHTML = article.price;

  // Description
  let productDescription = document.getElementById('description');
  productDescription.innerHTML = article.description;

  // Choix des couleurs
  for (let colors of article.colors) {
    let productColors = document.createElement("option");
    document.querySelector("#colors").appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
}

//////////////////////////////////////////// BOUTON CMD ////////////////////////////////////////////