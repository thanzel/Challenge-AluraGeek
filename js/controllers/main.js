import { servicesProducts } from "../services/product-services.js";

const producContainer = document.querySelector("[data-product]"); /*enlace con lo que está en el html cada seccion */
const form = document.querySelector("[data-form]");
const messageSpan = document.querySelector("[data-message]");

function createCard({ name, price, image, id }) { /*Crea el HTML, se coloca entre llaves para desestructurarlos, asi evito poner products.name, products.id, etc */

    const card = document.createElement("div"); /* creo un elemento div dinamicamente con mi js */
    card.classList.add("card"); /*aqui le agrego  una clase card  y la estilizo en css*/
    /*crea ahora una estructura html , el ${} escribe codigo html*/
    card.innerHTML = ` 
        <div class="card">
            <img class="card-img-product" src="${image}" alt="imagen del producto"/>
            <div class="card-container--info">
                <p>${name}</p>
                <div class="card-container--value">
                    <p>$${price}</p>
                    <button class="boton-delete" data-id="${id}">
                        <img src="./assets/delete.svg" alt="Eliminar">
                    </button>
                </div>
            </div>
        </div>
    `;

    addDeleteEvent(card, id);

    return card;
}

/*Elimina un producto */
function addDeleteEvent(card, id) {
    const deleteButton = card.querySelector(".boton-delete");
    deleteButton.addEventListener("click", async () => {
      try {
        await servicesProducts.deleteProduct(id);
        card.remove(); // Elimina el producto de la lista de productos
        showMessage("Producto eliminado!");
        console.log(`Producto con id ${id} eliminado`);
      } catch (error) {
        console.error(`Error al eliminar el producto con id ${id}:`, error);
      }
    });
  }
  
  function showMessage(message) {
    messageSpan.textContent = message; // Muestra el mensaje
    messageSpan.style.display = "block";

    setTimeout(() => {
        messageSpan.style.display = "none"; // Oculta el mensaje después de 3 segundos
    }, 3000);
}

/*Renderiza los productos, los lista*/
const renderProducts = async () => {
    try {
        const listProducts = await servicesProducts.productList(); /*aguarda a serviceProducts que tienedentro una funcion llamada listProducts */
        listProducts.forEach((product) => {
            const productCard = createCard(product);
            producContainer.appendChild(productCard); /*agrega cada producto a la seccion de productos como hijo*/
        });
        
        //  mensaje para eliminar , sea accesible después de cargar los productos
        messageSpan = document.querySelector("[data-message]");
    } catch (error) {
        console.log(error);
    }
}

/*Manejo del evento del form, los formularios se quedan escuchando eventos */
form.addEventListener("submit", async (event) => {
    event.preventDefault(); /*para que no se resetee el formulario, que es un comportamiento por defecto */

    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-image]").value;

    if (name === "" || price === "" || image === "") {
        showMessage("Todos los campos son obligatorios!");
        return;
    }

    try {        
        const newProduct = await servicesProducts.createProduct(name, price, image);
        const newCard =createCard(newProduct);
        producContainer.appendChild(newCard); /*agrega el nuevo producto al container */
        showMessage("Producto ingresado!");
    } catch (error) {
        console.log(error);
    }

    form.reset(); //para limpiar el form
})

renderProducts();
