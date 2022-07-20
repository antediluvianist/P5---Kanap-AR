// Variable pour l'id de la commande
const orderIdUrl = new URLSearchParams(window.location.search).get("orderId");

// Variable pour sélecteur
const orderId = document.getElementById("orderId");

// Insertion orderID dans le DOM
orderId.innerHTML = orderIdUrl;

// Suppression du local Storage
window.localStorage.clear();
