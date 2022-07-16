/////////////////////////////////////// C A R T ///////////////////////////////////////

// Constante qui stocke l'url de l'API //
const SERVER_URL = "http://localhost:3000/api/products/";

// Appel de fonction : récupération du panier
let storage = getLocalStorage();

// Variables qui stockent les sélecteurs (#) //
let cartItems = document.getElementById("cart__items");
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let order = document.getElementById("order");

// Variables qui stockent les sélecteurs (#) des formulaires //
let formFirstName = document.getElementById("firstName");
let formLastName = document.getElementById("lastName");
let formAddress = document.getElementById("address");
let formCity = document.getElementById("city");
let formEmail = document.getElementById("email");
// Sélecteur pour vérification Regex //
let formFields = document.querySelectorAll(
    'input[type="text"],input[type="email"]'
);

// Récupération des données de l'API (fetch) //
let data;
fetch(SERVER_URL)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (value) {
        data = value;
        getLocalStorage();
        createCartElement(storage, data);
        calculateTotal(storage, data);
        modifyProducts();
        checkForm();
        passOrder();
    })
    .catch(function (err) {
        console.log(err);
    });

/////////////////////////////////////// R E G E X ///////////////////////////////////////

const NAME_REGEX = new RegExp("^[a-zA-Z àâäéèêëïîôöùûüç'-,.]+$");
const ADDRESS_REGEX = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç'-]+)+"
);
const CITY_REGEX = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç'-]+$");
const EMAIL_REGEX = new RegExp(
    "^[a-zA-Z0-9-._]+[@]{1}[a-zA-Z0-9-_]+[.]{1}[a-zA-Z]{2,}$"
);
// Tableau(array) regex //
const REGEX_LIST = [NAME_REGEX, NAME_REGEX, ADDRESS_REGEX, CITY_REGEX, EMAIL_REGEX];
// Tableau(array) des messages d'erreurs du aux formulaires //
const ERROR_MSG = [
    "Le prénom ne doit pas contenir de chiffres ou de caractères spéciaux.",
    "Le nom de famille ne doit pas contenir de chiffres ou de caractères spéciaux.",
    "L'adresse entrée doit être valide.",
    "La ville ne doit pas contenir de chiffres ou de caractères spéciaux.",
    "L'addresse email doit être valide.",
];

/////////////////////////////////////// F O N C T I O N S ///////////////////////////////////////

//// Fonction de récupération datas depuis le localStorage ////

function getLocalStorage() {
    let existingStorage = JSON.parse(window.localStorage.getItem("allCouches"));
    if (existingStorage == null) {
        existingStorage = [];
    }
    return existingStorage;
}

//// Fonction de construction des éléments du panier ////

function createCartElement(localStored, apiData) {
    class HtmlElement {
        constructor(type, text, append, className, attribute) {
            (this.type = type),
                (this.text = text),
                (this.append = append),
                (this.class = className),
                (this.attribute = attribute),
                (this.createHtml = function () {
                    let element = document.createElement(this.type);
                    element.innerHTML = this.text;
                    if (this.class) {
                        element.classList.add(this.class);
                    }
                    if (this.attribute) {
                        if (
                            Object.keys(this.attribute).includes("id") &&
                            Object.keys(this.attribute).includes("color")
                        ) {
                            element.dataset.id = this.attribute.id;
                            element.dataset.color = this.attribute.color;
                        } else {
                            let attributes = Object.entries(this.attribute);
                            for (let i = 0; i < attributes.length; i++) {
                                element.setAttribute(attributes[i][0], attributes[i][1]);
                            }
                        }
                    }
                    this.append.append(element);
                });
            this.createHtml();
        }
    }

    // Construction du panier //
    for (let i = 0; i < localStored.length; i++) {
        let apiElement = [...apiData].find(
            (element) => element._id === localStored[i].id
        );
        // Construction html des articles //
        new HtmlElement("article", "", cartItems, "cart__item", {
            id: localStored[i].id,
            color: localStored[i].color,
        });
        let articles = cartItems.children[i];
        // Construction div & img de l'article //
        new HtmlElement("div", "", articles, "cart__item__img");
        new HtmlElement("img", "", articles.firstElementChild, "", {
            src: apiElement.imageUrl,
            alt: apiElement.altTxt,
        });
        new HtmlElement("div", "", articles, "cart__item__content");
        const description = articles.lastElementChild;
        // Construction des éléments (prix, nom, couleur(s)) //
        new HtmlElement("div", "", description, "cart__item__content__description");
        new HtmlElement("h2", apiElement.name, description.firstElementChild);
        new HtmlElement("p", localStored[i].color, description.firstElementChild);
        new HtmlElement(
            "p",
            `${apiElement.price} €`,
            description.firstElementChild
        );
        // Construction des options de la ligne (rajout/suprresion d'article(s)) //
        new HtmlElement("div", "", description, "cart__item__content__settings");
        const settings = description.lastElementChild;
        new HtmlElement(
            "div",
            "",
            settings,
            "cart__item__content__settings__quantity"
        );
        // Construction des éléments restants //
        new HtmlElement(
            "p",
            `Qté : ${localStored[i].quantity}`,
            settings.firstElementChild
        );
        new HtmlElement("input", "", settings.firstElementChild, "itemQuantity", {
            type: "number",
            name: "itemQuantity",
            min: 1,
            max: 100,
            value: localStored[i].quantity,
        });
        // Construction élément vide//
        new HtmlElement(
            "div",
            "",
            settings,
            "cart__item__content__settings__delete"
        );
        new HtmlElement("p", "Supprimer", settings.lastElementChild, "deleteItem");
    }
}

//// Fonction pour calculer les totaux (nb + prix) ////

function calculateTotal(storage, apiData) {
    // Calcul du nb d'item
    let itemTotal;
    if (storage.length === 0) {
        itemTotal = 0;
        totalQuantity.innerHTML = itemTotal;
    } else {
        itemTotal = [...storage]
            .map((item) => item.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue);
        totalQuantity.innerHTML = itemTotal;
    }
    // Calcul du prix total //
    let arrayPrice = [];
    for (let i = 0; i < storage.length; i++) {
        let apiElement = [...apiData].find(
            (element) => element._id === storage[i].id
        );

        // Ajout des prix aux tableau(array) //
        arrayPrice.push(apiElement.price * storage[i].quantity);
    }
    if (arrayPrice.length === 0) {
        totalPrice.innerHTML = 0;
    } else {
        // Somme de tout les prix contenu dans le tableau (array) //
        let priceTotal = arrayPrice.reduce(
            (previousValue, currentValue) => previousValue + currentValue
        );
        totalPrice.innerHTML = priceTotal;
    }
}

//// (macro)Fonction de modification du panier (ensemble des produits) ////

function modifyProducts() {
    let itemQuantityInput = document.getElementsByClassName("itemQuantity");
    let suppressButton = document.getElementsByClassName("deleteItem");
    // (micro)Fonction de mise è jour du panier //
    function updateStorage() {
        window.localStorage.setItem("allCouches", JSON.stringify(storage));
        location.reload();
    }
    // Boucle el supprimés //
    [...suppressButton].forEach((item) => {
        let articleItem = item.parentNode.parentNode.parentNode.parentNode;
        let articleItemIdAttr = articleItem.getAttribute("data-id");
        let articleItemColorAttr = articleItem.getAttribute("data-color");

        // EventListener sur chaque boutons //
        item.addEventListener("click", () => {
            for (let i = 0; i < storage.length; i++) {
                // Vérification des attributs
                if (
                    storage[i].id === articleItemIdAttr &&
                    storage[i].color === articleItemColorAttr
                ) {
                    // Suppression des objet depuis le DOM et le Storage //
                    storage = storage.filter((item) => {
                        if (
                            item.id == articleItemIdAttr &&
                            item.color == articleItemColorAttr
                        ) {
                            return false;
                        }
                        return true;
                    });
                    updateStorage();
                }
            }
        });
    });

    // Boucle avec tout les items qui ont la classe "itemQuantity" //
    [...itemQuantityInput].forEach((item) => {
        let articleItem = item.parentNode.parentNode.parentNode.parentNode;
        let articleItemIdAttr = articleItem.getAttribute("data-id");
        let articleItemColorAttr = articleItem.getAttribute("data-color");

        // eventListener (input) //
        item.addEventListener("change", (event) => {
            event.preventDefault();
            for (let i = 0; i < storage.length; i++) {
                if (
                    storage[i].id === articleItemIdAttr &&
                    storage[i].color === articleItemColorAttr
                ) {
                    if (item.value <= 0 || item.value > 100) {
                        alert("Le nombre de produits doit être compris entre 1 et 100");
                    } else {
                        let parsedValue = parseInt(item.value);
                        storage[i].quantity = parsedValue;
                        updateStorage();
                    }
                }
            }
        });
    });
}

//// Fonction pour vérifier les formulaires ////

function checkForm() {
    class FormChecker {
        constructor(formField, regex, message) {
            (this.formField = formField),
                (this.regex = regex),
                (this.message = message);
        }
    }
    for (let i = 0; i < formFields.length; i++) {
        let formElement = new FormChecker(
            formFields[i],
            REGEX_LIST[i],
            ERROR_MSG[i]
        );
        let sibling = formElement.formField.nextElementSibling;
        formElement.formField.addEventListener("input", (e) => {
            if (
                e.target.value === null ||
                e.target.value === "" ||
                formElement.regex.test(e.target.value) === true
            ) {
                sibling.innerHTML = "";
                return true;
            } else {
                sibling.innerHTML = formElement.message;
                return false;
            }
        });
    }
}

//// Fonction de vérification des formulaires (Regex) ////

function passOrder() {
    order.addEventListener("click", (event) => {
        if (storage.length === 0) {
            event.preventDefault();
            alert("Veuillez ajouter un ou plusieurs objets dans votre panier");
        } else if (
            !NAME_REGEX.test(formFirstName.value) ||
            !NAME_REGEX.test(formLastName.value) ||
            !ADDRESS_REGEX.test(formAddress.value) ||
            !CITY_REGEX.test(formCity.value) ||
            !EMAIL_REGEX.test(formEmail.value)
        ) {
            event.preventDefault();
            alert("Veuillez renseigner le formulaire correctement");
        } else {
            event.preventDefault();
            let productId = [];
            for (let i = 0; i < storage.length; i++) {
                productId.push(storage[i].id);
            }
            let order = {
                contact: {
                    firstName: formFirstName.value,
                    lastName: formLastName.value,
                    address: formAddress.value,
                    city: formCity.value,
                    email: formEmail.value,
                },
                products: productId,
            };
            // Envoi du formulaire //
            const orderJson = JSON.stringify(order);

            // POST method for order & contact //
            fetch(SERVER_URL + "order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: orderJson,
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    window.location.href = "confirmation.html?orderId=" + data.orderId;
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
}