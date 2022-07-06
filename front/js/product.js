// Page produit //

let str = window.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");
console.log(idProduct);
let article = "";

const COLOR_PICKED = document.querySelector("#colors");
const QUANTITY_PICKED = document.querySelector("#quantity");

getProduct();

// Fonction de récupération des détails du produit (fetch) //

function getProduct() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((response) => {
      return response.json();
    })

    .then(async function (resultatAPI) {
      article = await resultatAPI;
      console.table(article);
      if (article) {
        buildPage(article);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}
// Fonction de construction de la page produit //

function buildPage(article) {

  // Image //
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);

  // Image src & alt //
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Titre //
  let productName = document.getElementById('title');
  productName.innerHTML = article.name;

  // Prix //
  let productPrice = document.getElementById('price');
  productPrice.innerHTML = article.price;

  // Description //
  let productDescription = document.getElementById('description');
  productDescription.innerHTML = article.description;

  // Choix des couleurs //
  for (let colors of article.colors) {
    console.table(colors);
    let productColors = document.createElement("option");
    document.querySelector("#colors").appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
}