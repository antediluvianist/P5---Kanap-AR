/////////////////////////////////////// P R O D U C T ///////////////////////////////////////

// Constante qui stocke l'url de l'API //
const SERVER_URL = "http://localhost:3000/api/products/";

// Variables qui stockent les sélecteurs (#) // CONST //
const itemImg = document.getElementById("image");
const itemTitle = document.getElementById("title");
const itemPrice = document.getElementById("price");
const itemDescription = document.getElementById("description");
const itemColors = document.getElementById("colors");
const itemQuantity = document.getElementById("quantity");

// Utilisation de méthode(new) pour à récupérer l'id produit //
let id = new URLSearchParams(window.location.search).get("id");

// Variable qui stocke l'endroit à écouter(addToCart) //
let eventAddToCart = document.getElementById("addToCart");

// EventListener : addToCart | déclencheur : click | appel de la fonction addToCart //
eventAddToCart.addEventListener("click", function () {
  addToCart(productData);
});

// Récupération des détails DU produit(id) de l'API (fetch) //
fetch(`${SERVER_URL}${id}`)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (data) {
    productData = data;
    // Construction du contenu //
    buildContent(data);
    itemTitle.innerHTML = data.name;
    itemPrice.innerHTML = data.price;
    itemDescription.innerHTML = data.description;
    addColors(data);
  })
  .catch(function (err) {
    console.log(err);
  });

/////////////////////////////////////// F O N C T I O N S ///////////////////////////////////////

//// Fonction de construction de contenu ////

function buildContent(datas) {
  let productImg = `<img src="${datas.imageUrl}" alt="${datas.altTxt}">`;
  itemImg.insertAdjacentHTML("beforeend", productImg);
}

//// Fonction d'ajout des couleurs ////

function addColors(data) {
  for (let color of data.colors) {
    let element = document.createElement("option");
    element.setAttribute("value", color);
    element.innerHTML = color;
    itemColors.appendChild(element);
  }
}

//// Fonction pour remplir le Local Storage (addToCart) ////

function updateStorage(cartToStore) {
  window.localStorage.setItem("allCouches", JSON.stringify(cartToStore));
}

function addToCart(data) {
  // Récupération du LocalStorage et/ou création du storage si non existant //
  let existingStorage = JSON.parse(window.localStorage.getItem("allCouches"));
  if (!existingStorage) {
    existingStorage = [];
  }

  // Création d'un objet avec les datas de l'item //


  // Vérification des champs obligatoires //
  if (itemQuantity.value < 1 || itemColors.value === "" || itemQuantity.value > 100) {
    alert(
      "( ! ) Veuillez sélectionner une couleur et/ou renseigner une quantité comprise entre 1 et 100."
    );
  } else {
    // Vérification du panier pré-existant (localStorage) //
    let object = {
      id: data._id,
      color: itemColors.value,
      quantity: itemQuantity.value,
    };

    if (
      existingStorage.find(
        (element) => element.color === object.color && element.id === object.id
      )
    ) {
      // Récupération de l'index du panier //
      let indexValue = existingStorage.findIndex(
        (element) => element.color === object.color && element.id === object.id
      );

      // Incréamentation des éléments stockés //
      existingStorage[indexValue].quantity += object.quantity;

      // Mis à jour du panier //
      updateStorage(existingStorage);
      window.location.href = "cart.html";
    } else {
      // Ajout de l'objet au localStorage //
      existingStorage.push(object);
      updateStorage(existingStorage);
      window.location.href = "cart.html";
    }
  }
}
