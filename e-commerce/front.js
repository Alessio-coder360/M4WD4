// Caricamento iniziale della pagina
window.addEventListener("load", async () => {
    showLoader();
    try {
        await getProduct();
    } catch (error) {
        console.error("Errore durante il caricamento completo della pagina:", error);
    } finally {
        hideLoader();
    }
});

// Funzione per mostrare il loader
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.visibility = "visible";
    }
}

// Funzione per nascondere il loader
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.visibility = "hidden";
    }
}

// Funzione per ottenere i prodotti
async function getProduct() {
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const headers = {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
    };

    try {
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
            throw new Error("Errore durante il recupero dei prodotti");
        }

        const products = await response.json();
        console.log("Prodotti ricevuti:", products);

        // Pulisci i contenitori delle card
        document.getElementById("theCards").innerHTML = "";
        document.getElementById("theCards1").innerHTML = "";
        document.getElementById("theCards2").innerHTML = "";

        // Array dei brand conosciuti
        const knownBrands = ["lib tech", "capita", "gnu", "nitro", "st yhaibes", "slide", "creature", "quiksilver", "torq", "bear", "cbc", "channel island"];

        // Loop sui prodotti per assegnare l'immagine corretta o di default
        products.forEach(product => {
            const isBrandKnown = knownBrands.includes(product.brand.toLowerCase().trim());

            if (!isBrandKnown) {
                console.warn(`Brand sconosciuto: "${product.brand}". Assegno immagine di default.`);
                product.imageUrl = "asset/skateDefault4.jpg"; // Immagine di default
            }

            // Aggiungi le card ai rispettivi contenitori
            if (isSnowboardBrand(product.brand)) {
                addProductCard("theCards", product);
            } else if (isSkateBrand(product.brand)) {
                addProductCard("theCards1", product);
            } else if (isSurfBrand(product.brand)) {
                addProductCard("theCards2", product);
            } else {
                console.warn("Brand non classificato:", product.brand);
                addProductCard("theCards2", product); // Metti i brand sconosciuti in una sezione generica
            }
        });

        hideLoader();
    } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
        hideLoader();
    }
}


// Funzioni per determinare i brand
function isSnowboardBrand(brand) {
    const snowboardBrands = ["lib tech", "capita", "gnu", "nitro"];
    return snowboardBrands.includes(brand.toLowerCase().trim());
}

function isSkateBrand(brand) {
    const skateBrands = ["st yhaibes", "slide", "creature", "quiksilver"];
    return skateBrands.includes(brand.toLowerCase().trim());
}

function isSurfBrand(brand) {
    const surfBrands = ["torq", "bear", "cbc", "channel island"];
    return surfBrands.includes(brand.toLowerCase().trim());
}

// Funzione per aggiungere una card prodotto
function addProductCard(containerId, product) {
    const container = document.getElementById(containerId);

    
    // Assicurati che l'immagine sia sempre valida
    let imageUrl = product.imageUrl || "asset/skateDefault4.jpg"; // Immagine di default reale


    console.log(`Immagine usata per ${product.name}: ${imageUrl}`);
    // Utilizza l'URL immagine dal prodotto se disponibile
    
    if (!imageUrl) {
        console.warn(`Immagine non trovata per il prodotto: ${product.name}. Uso immagine predefinita.`);
    
        switch (product.brand.toLowerCase().trim()) {
            case "capita":
                imageUrl = "asset/snowCapita.png";
                break;
            case "gnu":
                imageUrl = "asset/snowGnu.png";
                break;
            case "nitro":
                imageUrl = "asset/snowNitro.png";
                break;
            case "lib tech":
                imageUrl = "asset/snowLB.png";
                break;
            case "creature":
                imageUrl = "asset/skateCreature.png";
                break;
            case "slide":
                imageUrl = "asset/skateSlide.png";
                break;
            case "quiksilver":
                imageUrl = "asset/skateQuicksilver.png";
                break;
            case "st yhaibes":
                imageUrl = "asset/skateSt.png";
                break;
            case "torq":
                imageUrl = "asset/tavolaSurf1.png";
                break;
            case "bear":
                imageUrl = "asset/tavolaSurf2.png";
                break;
            case "cbc":
                imageUrl = "asset/tavolaSurf3.png";
                break;
            case "channel island":
                imageUrl = "asset/tavolaSurf4.png";
                break;
            default:
                // Assegna un'immagine di default se il brand non è riconosciuto
                imageUrl = "asset/skateDefault4.jpg"; // Percorso all'immagine di default
                console.warn(`Brand non riconosciuto (${product.brand}). Uso immagine di default.`);
                break;
        }
    }
    
    // Log dell'immagine scelta
    console.log(`Immagine usata per ${product.name}: ${imageUrl}`);

    const card = `
        <div class="col-lg-3 col-md-6 col-sm-6 mb-3" data-product-id="${product._id}">
            <div class="card border rounded-3 d-flex flex-column w-100">
                <img src="${imageUrl}" class="card-img-top img-fluid rounded-top" alt="${product.name}">
                <div class="card-body p-1">
                    <ul class="list-group list-group-flush flex-grow-1">
                        <li class="list-group-item">
                            <h5 class="card-title fw-bold fs-5">${product.brand}
                                <a href="#" onclick="editFieldWithPut('${product._id}', 'brand', '${product.brand}', event)">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            </h5>
                        </li>
                        <li class="list-group-item">
                            <h6 class="card-text fs-6">${product.name}
                                <a href="#" onclick="editFieldWithPut('${product._id}', 'name', '${product.name}', event)">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            </h6>
                        </li>
                        <li class="list-group-item">
                            <p class="card-text testoM fs-6">${product.description}
                                <a href="#" onclick="editFieldWithPut('${product._id}', 'description', '${product.description}', event)">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            </p>
                        </li>
                        <li class="list-group-item">
                            <span class="card-text">${product.price}€
                                <a href="#" onclick="editFieldWithPut('${product._id}', 'price', '${product.price}', event)">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            </span>
                        </li>
                    </ul>
                    <div class="d-flex mt-3 gap-2 justify-content-center p-1">
                        <button class="btn btn-primary btn-sm" onclick="addToCart('${product._id}')">
                            <i class="bi bi-cart"></i> Aggiungi al carrello
                        </button>
                        <a href="dett.html?id=${product._id}" class="btn btn-secondary btn-sm">Dettagli</a>
                    </div>
                </div>
            </div>
        </div>`;
    container.innerHTML += card;
}


async function editFieldWithPut(productId, key, currentValue, event) {
    event.preventDefault();

    if (key === "imageUrl") {
        alert("La modifica dell'immagine non è consentita!");
        return;
    }

    const newInput = prompt(`Inserisci il nuovo valore per ${key}:`, currentValue);
    if (!newInput || newInput.trim() === "") {
        alert("Operazione annullata o input non valido!");
        return;
    }

    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    try {
        const responseGet = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyODQ5MTksImV4cCI6MTczNzQ5NDUxOX0.lMaZecMw3XJBqKZyNiONq7YL5cGo0z_zbvdlxTJWZYs"
            }
        });

        if (!responseGet.ok) {
            throw new Error(`Errore durante il recupero del prodotto: ${responseGet.status}`);
        }

        const product = await responseGet.json();

        // Verifica se il brand è sconosciuto
        const knownBrands = ["capita", "gnu", "nitro", "lib tech", "st yhaibes", "slide", "creature", "quiksilver", "torq", "bear", "cbc", "channel island"];
        const isBrandKnown = key === "brand" && knownBrands.includes(newInput.toLowerCase().trim());

        product[key] = key === "price" ? parseFloat(newInput) : newInput;

        if (!isBrandKnown && key === "brand") {
            console.warn(`Brand sconosciuto: "${newInput}". Assegno immagine di default.`);
            product.imageUrl = "asset/skateDefault4.jpg"; // Salva l'immagine di default
        }

        const responsePut = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
            },
            body: JSON.stringify(product)
        });

        if (!responsePut.ok) {
            throw new Error(`Errore durante l'aggiornamento del prodotto: ${responsePut.status}`);
        }

        alert(`Il campo ${key} è stato aggiornato con successo!`);

        // Gestisci il refresh o l'aggiornamento diretto
        if (!isBrandKnown && key === "brand") {
            console.warn(`Aggiorno solo la card senza refresh per il brand sconosciuto: "${newInput}".`);

            // Trova e aggiorna direttamente la card
            const card = document.querySelector(`[data-product-id="${productId}"]`);
            if (card) {
                const cardTitle = card.querySelector("h5.card-title");
                const cardImage = card.querySelector("img");

                if (cardTitle) {
                    cardTitle.textContent = newInput;
                }
                if (cardImage) {
                    cardImage.src = "asset/skateDefault4.jpg"; // Immagine di default
                }
            }
        } else {
            console.log("Effettuo il refresh della lista prodotti con getProduct.");
            await getProduct(); // Refresh completo della lista
        }
    } catch (error) {
        console.error(`Errore durante l'aggiornamento della card con ID: ${productId}`, error);
        alert("Errore durante l'aggiornamento del prodotto.");
    }
}



// Aggiungi un prodotto al carrello



let cart = [];
let totalItems = 0;


function addToCart(productId) {

    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const headers = {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
    };

    fetch(url, { method: "GET", headers })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il recupero del prodotto");
            }
            return response.json();
        })
        .then(product => {
            let existingItem = cart.find(item => item.id === productId);
            totalItems++;

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1
                });
            }
            updateCartDisplay();
        })
        .catch(error => {
            console.error("Errore durante l'aggiunta al carrello:", error);
        });
}

// Aggiorna il contatore del carrello
function updateCartDisplay() {
    let cartItemCount = document.getElementById("cartItemCount");
    cartItemCount.textContent = totalItems;
}

// Mostra il carrello nel modale
function showCart() {
    let cartItems = document.getElementById("cartItems");
    let totalValue = document.getElementById("totalValue");
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {

        totalValue.textContent = "€0";
    } else {
        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            total += subtotal;
            cartItems.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h6>${item.name}</h6>
                            <img src="${item.imageUrl}" alt="${item.name}" class="img-fluid" style="width: 50px;">
                            <small>x ${item.quantity}</small>
                        </div>
                        <div>
                            <span>€${subtotal.toFixed(2)}</span>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">
                                <i class="bi bi-trash3"></i> Rimuovi
                            </button>
                        </div>
                    </div>`;
        });

        totalValue.textContent = `€${total.toFixed(2)}`;
    }

    let cartModalElement = document.getElementById("cartModal");
    let modalInstance = bootstrap.Modal.getInstance(cartModalElement);

    // Se l'istanza del modale non esiste, creala e mostralo
    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(cartModalElement);
        modalInstance.show();
    } else {
        modalInstance.show();
    }
}

// Rimuovi un prodotto dal carrello
function removeFromCart(productId) {
    let existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity--;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        totalItems--;
        if (totalItems < 0) totalItems = 0;
    }
    updateCartDisplay();
    showCart();
}

let cartModal = document.getElementById("cartModal");

cartModal.addEventListener("hidden.bs.modal", () => {
    document.activeElement.blur(); // Rimuovi il focus
});

// Funzione per aprire il modale dei dettagli di un prodotto
function descriptionProductsModal(productId) {
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const headers = {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
    };

    fetch(url, { method: "GET", headers })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il recupero del prodotto");
            }
            return response.json();
        })
        .then(product => {
            let modalTitle = document.getElementById("productLabel");
            let modalBody = document.getElementById("productModalBody");
            let footerModale = document.getElementById("footerModale");

            modalTitle.textContent = product.name;

            modalBody.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid w-100">
                        </div>
                        <div class="col-md-6">
                            <ul class="list-unstyled">
                                <li><strong>Descrizione:</strong> ${product.description}</li>
                                <li><strong>Prezzo:</strong> €${product.price}</li>
                                <li><strong>Brand:</strong> ${product.brand}</li>
                            </ul>
                        </div>
                    </div>`;

            footerModale.innerHTML = `
                    <button type="button" class="btn btn-primary" onclick="addToCart('${product._id}')">Aggiungi al carrello</button>`;

            new bootstrap.Modal(document.getElementById("productModal")).show();
        })
        .catch(error => {
            console.error("Errore durante il recupero del prodotto:", error);
        });
}






// Quando il menu viene aperto (toggle di collapse)
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav.classList.contains('collapse')) {
        navbarNav.classList.remove('mt-2'); 
    } else {
        navbarNav.classList.add('mt-2'); 
    }
})


