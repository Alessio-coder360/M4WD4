






window.addEventListener("load", async () => {
    showLoader(); 
    try {
        await getDett(); // Assicura che tutti i prodotti siano caricati
    } catch (error) {
        console.error("Errore durante il caricamento completo della pagina:", error);
    } finally {
        hideLoader(); // Nascondi il loader solo dopo che tutto è stato caricato
    }
});




// Funzione per mostrare il loader
function showLoader() {
    console.log("Mostrando il loader...");
    const loader = document.querySelector(".loading");
    if (loader) {
        loader.style.visibility = "visible";
    } else {
        console.error("Elemento loader non trovato!");
    }
}

// e quella per nasconderlo
function hideLoader() {
    console.log("Nascondendo il loader...");
    const loader = document.querySelector(".loading");
    if (loader) {
        loader.style.visibility = "hidden";
    } else {
        console.error("Elemento loader non trovato!");
    }
}



async function getDett() {
    showLoader(); 
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        let dettagliP = document.getElementById("dettagliP");
        dettagliP.innerText = "Prodotto non trovato";
        hideLoader(); 
        return;
    }

    const url = `https://striveschool-api.herokuapp.com/api/product/${id}`;
    const headers = {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw"
    };

    try {
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
            throw new Error("Errore durante il recupero del prodotto");
        }

        const dettagli = await response.json();
        let dettagliP = document.getElementById("dettagliP");

        dettagliP.innerHTML = `
            <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative h-100" data-id="${dettagli._id}" style="max-width: 800px; margin: 0 auto;">
                <!-- Colonna Contenuto -->
                <div class="col p-4 d-flex flex-column">
                    <h3 class="mb-2">${dettagli.name}</h3>
                    <p class="card-text mb-2">${dettagli.description}</p>
                    <p class="card-text mb-2"><strong>Brand:</strong> ${dettagli.brand}</p>
                    <p class="card-text mb-2"><strong>Prezzo:</strong> €${dettagli.price.toFixed(2)}</p>
                    <button class="btn btn-success mt-auto" onclick="addToCart('${dettagli._id}')">
                        <i class="bi bi-cart"></i> Aggiungi al carrello
                    </button>
                </div>
                <!-- Colonna Immagine -->
                <div class="col-auto d-flex align-items-center">
                    <img src="${dettagli.imageUrl}" class="img-fluid rounded-1" style="height: 300px; width: auto; object-fit: cover;" alt="${dettagli.name}">
                </div>
            </div>
        `;

        console.log("Prodotto ricevuto:", dettagli);
    } catch (error) {
        console.error("Errore durante il recupero del prodotto:", error);
        document.getElementById("tableContainer").innerHTML = "<p class='text-danger'>Errore durante il caricamento del prodotto.</p>";
    } finally {
        hideLoader(); 
}
}
    
    



//Carrello anche qui con modale 
    



let cart = [];
let totalItems = 0;
    
    function addToCart(productId) {
        console.log("Aggiunta al carrello:", productId);
        const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
        const headers = {
            Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
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
                            <img src="${item.imageUrl}" alt="${item.name}" class="img-fluid">
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
                    <div class="row riga1">
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
    
    
    
    // Quando il menu della nav bar viene aperto (toggle di collapse)
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav.classList.contains('collapse')) {
        navbarNav.classList.remove('mt-3'); // Rimuovi il margine quando è chiuso
    } else {
        navbarNav.classList.add('mt-3'); // Aggiungi margine quando è aperto
    }
});
