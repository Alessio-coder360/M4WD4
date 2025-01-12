const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw";

// Mappa categorie ai container HTML
const containerMap = {
    snow: "theCards_snow",
    skate: "theCard_skate",
    surf: "theCard_surf",
};

// Mostra/Nasconde il loader
function showLoader() {
    document.querySelector('.loading').style.visibility = 'visible';
}

function hideLoader() {
    document.querySelector('.loading').style.visibility = 'hidden';
}

// Carica le card, indispensabile anche quando si elimnano o modificano
function loadCards() {
    showLoader();
    fetch(API_URL, { headers: { Authorization: TOKEN } })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento dei prodotti.");
            }
            return response.json();
        })
        .then((products) => {
            clearContainers();
            products.forEach((product) => assignProductToCategory(product));
        })
        .catch((error) => console.error("Errore caricamento prodotti:", error))
        .finally(hideLoader);
}

// Svuota i container per evitare sovrascizioni
function clearContainers() {
    Object.values(containerMap).forEach((id) => {
        document.getElementById(id).innerHTML = '';
    });
}

// Assegna i prodotti alla categoria appropriata, presa la description come elemento marker, affinché la card viene inserita nel container adatto
function assignProductToCategory(product) {
    const { description } = product;

    const keywords = {
        snow: ["snowboard", "neve", "snow"],
        skate: ["skateboard", "skate", "strada"],
        surf: ["surf", "onda", "mare"],
    };

    let categoryMatched = null;

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some((word) => description.toLowerCase().includes(word))) {
            categoryMatched = category;
            break;
        }
    }

    if (categoryMatched) {
        addProductCard(document.getElementById(containerMap[categoryMatched]), product);
    } else {
        Object.values(containerMap).forEach((containerId) => {
            addProductCard(document.getElementById(containerId), product);
        });
    }
}

// Aggiunge la card prodotto
function addProductCard(container, product) {
    const cardHTML = `
        <div class="col-lg-3 col-md-6 col-sm-6 mb-3" data-product-id="${product._id}">
    <div class="card border rounded-3 d-flex flex-column w-100 h-100">
        <img src="${product.imageUrl}" class="card-img-top img-fluid rounded-top" alt="${product.name}">
        <div class="card-body p-2">
            <ul class="list-group list-group-flush flex-grow-1">

            <li class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                    <h5 class="mb-0">${product.brand}</h5>
                    <button class="btn btn-primary btn-sm btnInfo" onclick="editProduct('${product._id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </li>

                <li class="list-group-item border-bottom mt-2">
                    <h6>${product.name}</h6>
                </li>
                
                
                <li class="list-group-item border-bottom testoM">
                     <p class="card-text">${product.description}</p>
                </li>


                <li class="list-group-item border-bottom mt-2">
                    <span class="fw-bold">${product.price}€</span>
                </li>
            </ul>
            
            
            <div class="d-flex mt-3 gap-2 justify-content-between">
                <button class="btn btn-danger btn-sm btnIcon" onclick="deleteProduct('${product._id}', event)">
                    <i class="bi bi-trash3"></i>
                </button>
                <button class="btn btn-primary btn-sm btnIcon bg-success" onclick="addToCart('${product._id}')">
                    <i class="bi bi-cart"></i>
                </button>
                <a href="dett.html?id=${product._id}" class="btn btn-secondary btn-sm bg-info d-flex align-items-center ms-auto"><i class="bi bi-info-circle"></i></a>
            </div>
        </div>
    </div>
</div>`;
    container.innerHTML += cardHTML;
}

// Crea un nuovo prodotto
function createNewProduct() {
    const nameInp = prompt("Inserisci il nome:");
    const descriptionInp = prompt("Inserisci la descrizione:");
    const brandInp = prompt("Inserisci il brand:");
    const imageInp = prompt("Inserisci l'immagine URL:");
    const priceInp = parseFloat(prompt("Inserisci il prezzo:"));

    if (!nameInp || !descriptionInp || !brandInp || !imageInp || isNaN(priceInp)) {
        alert("Tutti i campi sono obbligatori!");
        return;
    }

    const newProduct = {
        name: nameInp,
        description: descriptionInp,
        brand: brandInp,
        imageUrl: imageInp,
        price: priceInp,
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: TOKEN,
        },
        body: JSON.stringify(newProduct),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore durante la creazione del prodotto.");
            }
            return response.json();
        })
        .then((createdProduct) => {
            alert("Prodotto creato con successo!");
            assignProductToCategory(createdProduct);
        })
        .catch((error) => console.error("Errore creazione prodotto:", error));
}

// Modifica prodotto
function editProduct(productId) {
    fetch(`${API_URL}${productId}`, { headers: { Authorization: TOKEN } })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore nel recupero del prodotto.");
            }
            return response.json();
        })
        .then((product) => {
            const validCategories = ["snow", "skate", "surf"]; 
            
            // Prompt per i nuovi valori, nell'ordine che volevo, cioè gli elementi della card 
            const updatedImageUrl = prompt("Modifica l'immagine URL:", product.imageUrl) || product.imageUrl;
            const updatedBrand = prompt("Modifica il brand:", product.brand) || product.brand;
            const updatedName = prompt("Modifica il nome:", product.name) || product.name;
            const updatedDescription = prompt("Modifica la descrizione:", product.description);

            // Verifica che la descrizione contenga almeno una parola chiave valida
            if (!validCategories.some((keyword) => updatedDescription && updatedDescription.toLowerCase().includes(keyword))) {
                alert("Errore: La descrizione deve contenere almeno una delle seguenti categorie: 'snow', 'skate', 'surf'.");
                return; // sennò al click annulla del prompt aggiornava con tutta 
            }

            const updatedPrice = parseFloat(prompt("Modifica il prezzo:", product.price)) || product.price;

            const updatedProduct = {
                name: updatedName,
                description: updatedDescription,
                brand: updatedBrand,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
            };

            // Log per debug, per capire se avveniva o meno 
            console.log("Dati inviati per l'aggiornamento:", updatedProduct);

            // Effettuo la richiesta PUT per aggiornare il prodotto
            return fetch(`${API_URL}${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: TOKEN,
                },
                body: JSON.stringify(updatedProduct),
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore durante l'aggiornamento del prodotto.");
            }
            alert("Prodotto aggiornato con successo!");
            loadCards(); 
        })
        .catch((error) => {
            console.error("Errore durante la modifica del prodotto:", error);
            alert("Errore durante la modifica del prodotto. Controlla i log per i dettagli.");
        });
}

// Elimina prodotto
function deleteProduct(productId, event) {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;

    fetch(`${API_URL}${productId}`, {
        method: "DELETE",
        headers: { Authorization: TOKEN },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore durante l'eliminazione del prodotto.");
            }
            event.target.closest(`[data-product-id="${productId}"]`).remove();
        })
        .catch((error) => console.error("Errore eliminazione prodotto:", error));
}

// Inizializza
document.addEventListener("DOMContentLoaded", loadCards);






// Quando il menu viene aperto (toggle di collapse), per il responsive 
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav.classList.contains('collapse')) {
        navbarNav.classList.remove('mt-2'); 
    } else {
        navbarNav.classList.add('mt-2'); 
    }
})






//funzioni per carrello e modali 





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

    // Se l'istanza del modale non esiste, creala e mostralo, per evitare che lo show del modale ogni volta oscurasse tutto il body
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






// // 677bbefac88f0b00153d147c	

// Tavola Surf Torq Tec Rusty 6’0	
// Torq
// 829 €	
// La Dwart di Torq è realizzata in collaborazione con Rusty Surfboards. Famosa per velocità e facilità di utilizzo, è adatta a tutti i livelli. Usabile con onde piccole e fino a sopra la testa, performa bene su tutti i tipi di break: beach break, reef e point. Un classico del brand americano.	
// asset/tavolaSurf1.png




// // 677bbf30c88f0b00153d147e
// Tavola da Surf Bear Cosmic
// Bear
// 1375 €
// La tavola da surf Cosmic di Bear è un modello iconico e un longboard perfetto per noseriding e manovre classiche. Reattiva, affidabile e con uno stile unico, è un must per il tuo quiver. Ideale per chi cerca prestazioni e design senza compromessi.
// asset/tavolaSurf2.png	



// // 677d18c47c1e0b00151721d1	
// Tavole Surf Channel Island
// Channel Island
// 785 €	
// Creata da Britt Merrick da quello che inizialmente era il modello di shortboard performante Two Happy, la nuova Happy Everyday soddisfa ogni esigenza di ogni surfista: per un surf quotidiano.
// asset/tavolaSurf4.png


// // 677d1f027c1e0b00151721d3
// Tavola da Surf Softboard Malibu	
// Cbc	
// 329 €
// Questa tavola soft è uno dei modelli più venduti di CBC Surfboards, ha 3 longheroni in legno, che la rendono resistente e reattiva, adatta per bambini e adulti che vogliono una tavola per imparare facilmente. Comprende: Pinne, Leash, Tool
// asset/tavolaSurf3.png




// Tavola Da Snowboard Lib Tech
// Lib Tec
// 569 €
// Lo snowboard Libtech Skate Banana è adatta ai rider di ogni livello, ti permette di divertirti in park, fare belle curve anche su fondo ghiacciato e in fresca mantiene una grande stabilità ed un galleggiamento tipico di questo brand.
// asset/skateDefault4.jpg	
// // 677d7a307c1e0b001517222b
		
// // 677dd7f77c1e0b0015172258
// 	Tavola Snowboard Mercury
//     Capita	
//     629 €
//     La tavola Capita Mercury è perfetta in ogni situazione! Non controllare più le previsioni meteo: questa incredibile tavola è pronta per tutto. Dotata di un Hover Core in paulownia e pioppo, Amplite V-Tech Amplifiers e altre funzionalità, il Mercury è eccezionale in usura e forza. La forma all-terrain innovativa è un mix di camber rialzato con inserti, punti di contatto alti per la neve fresca e Flat Kick per transizioni più rapide.
//     asset/snowCapita.png	