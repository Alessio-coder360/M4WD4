console.log("Script back.js caricato correttamente");






let post = document.getElementById("post");

document.getElementById("post").addEventListener("click", (event) => {
    event.preventDefault();
    addProduct();
});

function addProduct() {
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const nameInp = document.getElementById("name").value.trim();
    const descriptionInp = document.getElementById("description").value.trim();
    const brandInp = document.getElementById("brand").value.trim();
    const imageInp = document.getElementById("image").value.trim();
    const priceInp = parseFloat(document.getElementById("price").value.trim());

    // Validazione dei campi della categoria description
    const validCategories = ["snow", "neve", "montagna","skate","park","strada","surf","onde,sabbia"];
    const normalizedDescription = descriptionInp.trim().toLowerCase();

    if (!nameInp || !descriptionInp || !brandInp || !imageInp || isNaN(priceInp) || !validCategories.some((keyword) => normalizedDescription.includes(keyword))) {
        alert("Per favore, compila tutti i campi correttamente e assicurati che la descrizione contenga una categoria valida: 'snow', 'neve', 'skate', 'surf'.");
        return;
    }

    // Log dati per debugging se ci sono eventuali errori e non si capisce il perché
    console.log("Dati inviati per la creazione del prodotto:", {
        name: nameInp,
        description: descriptionInp,
        brand: brandInp,
        imageUrl: imageInp,
        price: priceInp,
    });

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw",
        },
        body: JSON.stringify({
            name: nameInp,
            description: descriptionInp,
            brand: brandInp,
            imageUrl: imageInp,
            price: priceInp,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorDetails) => {
                    console.error("Errore dal server:", errorDetails);
                    throw new Error(`Errore durante la creazione del prodotto: ${JSON.stringify(errorDetails)}`);
                });
            }
            return response.json();
        })
        .then((newProduct) => {
            alert("Prodotto creato con successo!");
            console.log(`Nuovo prodotto creato: ${newProduct._id}`);
            document.querySelector("form").reset(); // Resetta il form
        
        
        
        
            document.getElementById("name").value = "";
            document.getElementById("description").value = "";
            document.getElementById("brand").value = "";
            document.getElementById("image").value = "";
            document.getElementById("price").value = "";
        
        })
        
      
        
        
        .catch((error) => {
            console.error("Errore creazione prodotto:", error);
            alert(`Errore durante la creazione del prodotto: ${error.message}`);
        });
}





document.getElementById("buttonP").addEventListener("click", (event) => {
    event.preventDefault();
    const productId = document.getElementById("productId").value.trim();

    if (!productId) {
        alert("L'ID del prodotto è mancante!");
        console.error("ID del prodotto non fornito.");
        return;
    }

    editProduct(productId);
});

function editProduct(productId) {
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;


    const nameP = document.getElementById("nameP").value.trim();
    const descriptionP = document.getElementById("descriptionP").value.trim();
    const brandP = document.getElementById("brandP").value.trim();
    const imageP = document.getElementById("imageP").value.trim();
    const priceP = parseFloat(document.getElementById("priceP").value.trim());

    
    const validCategories = ["snow", "neve", "montagna", "skate", "park", "strada", "surf", "onde", "sabbia"];
    const normalizedDescription = descriptionP.toLowerCase().trim();

    if (descriptionP && !validCategories.some((keyword) => normalizedDescription.includes(keyword))) {
        alert("La descrizione deve contenere almeno una delle seguenti categorie: 'snow', 'neve', 'montagna', 'skate', 'park', 'strada', 'surf', 'onde', 'sabbia'.");
        return;
    }

    const updatedProduct = {
        name: nameP || undefined, // Mantieni il valore originale se non modificato
        description: descriptionP || undefined,
        brand: brandP || undefined,
        imageUrl: imageP || undefined,
        price: isNaN(priceP) ? undefined : priceP, // Mantieni il valore originale se il prezzo non è valido
    };

    // Rimuovi i campi non modificati per evitare la creazione della card modificata 
    Object.keys(updatedProduct).forEach((key) => {
        if (updatedProduct[key] === undefined) {
            delete updatedProduct[key];
        }
    });

    if (Object.keys(updatedProduct).length === 0) {
        alert("Nessuna modifica rilevata.");
        return;
    }
    
    

    console.log("Dati inviati nel body:", updatedProduct);

   
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw",
        },
        body: JSON.stringify(updatedProduct),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((errorMessage) => {
                    console.error(`Errore ${response.status}: ${errorMessage}`);
                    throw new Error(`Errore ${response.status}: ${errorMessage}`);
                });
            }
            return response.json();
        })
        .then((updatedProduct) => {
            console.log("Prodotto aggiornato con successo:", updatedProduct);
            alert(`Prodotto aggiornato con successo: ${updatedProduct._id}`);

            document.getElementById("nameP").value = "";
            document.getElementById("descriptionP").value = "";
            document.getElementById("brandP").value = "";
            document.getElementById("imageP").value = "";
            document.getElementById("priceP").value = "";
        })
        .catch((error) => {
            console.error("Errore durante la modifica del prodotto:", error);
            alert("Errore durante la modifica del prodotto. Controlla i log per i dettagli.");
        });
}




// Bottone deletedAll PERICOLOSISSIMO



let deletedAll = document.getElementById("deleted");


deletedAll.addEventListener("click", (event) => {
    event.preventDefault();

    deleteAllProducts();
});




//Funzione per eliminare tutti i prodotti 
async function deleteAllProducts() {
    
    if (!confirm("Sei sicuro di voler eliminare tutti i prodotti? Questa azione è irreversibile!")) {
        // L'utente ha cliccato "Annulla"
        alert("Operazione annullata!");
        return; // Interrompi l'esecuzione
    }
    
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw"
    };

    try {
        const response = await fetch(url, { headers: headers });
        const products = await response.json();

        // Eliminazione parallela con Promise.all per eliminare tutti i prodotti, creato per eliminare tutti i prodotti del server durante la prova 
        const deletePromises = products.map(product => deleteProduct(product._id));
        await Promise.all(deletePromises);

        console.log("Tutti i prodotti sono stati eliminati.");
    } catch (error) {
        console.error("Si è verificato un errore durante il recupero dei prodotti:", error);
    }
}






let deletedOne = document.getElementById("deletedOne");
deletedOne.addEventListener("click", (event) => {
    event.preventDefault();

    const delId = document.getElementById("delId"); 
    const productId = delId.value;

    if (productId) { 
        deleteProduct(productId); 
        delId.value = ""; 
    } else {
        console.error("ID del prodotto non valido.");
		
    }
});



async function deleteProduct(productId) {
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw"
    };

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });



        if (!response.ok) {
            throw new Error(`Errore durante l'eliminazione del prodotto con ID ${productId}`)
        }

        console.log(`Prodotto con ID ${productId} eliminato con successo.`);
        alert(`Prodotto con ID ${productId} eliminato con successo.`)
        
    } catch (error) {
        console.error("Si è verificato un errore durante l'eliminazione:", error);
    }
}



// Gestione del clic sul pulsante "Tabella"
let appearTable = false;

document.getElementById("tabella").addEventListener("click", function () {
    const tableContainer = document.getElementById("tableContainer");

    if (window.innerWidth >= 992) { // Solo per dispositivi grandi altrimenti d-none
        if (appearTable) {
            // Nascondi la tabella
            tableContainer.innerHTML = "";
            tableContainer.style.visibility = "hidden";
        } else {
            // Mostra la tabella
            getProductsAndGenerateTable();
            tableContainer.style.visibility = "visible";
        }
        appearTable = !appearTable; // Inverti lo stato della variabile bandiera 
    }
});

// Listener per il ridimensionamento della finestra
window.addEventListener("resize", function () {
    const tableContainer = document.getElementById("tableContainer");

    if (window.innerWidth < 992) {
        // Se si passa a dispositivi medi o piccoli, nascondi la tabella
        tableContainer.innerHTML = "";
        tableContainer.style.visibility = "hidden";
        appearTable = false; // Resetta lo stato
    }
});

// Chiamata GET per richiedere i dati e generare la tabella
function getProductsAndGenerateTable() {
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzY0NDA5MTUsImV4cCI6MTczNzY1MDUxNX0.DcQ1IN9FytC8YIaXnfPt9x8C_qtS4JSOW8pg_I-Hljw"
    };

    fetch(url, { method: "GET", headers })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il recupero dei prodotti");
            }
            return response.json();
        })
        .then(products => {
            if (products.length > 0) {
                generateTable(products); 
            } else {
                document.getElementById("tableContainer").innerHTML = "<p class='text-warning'>Nessun prodotto trovato.</p>";
            }
        })
        .catch(error => {
            document.getElementById("tableContainer").innerHTML = "<p class='text-danger'>Errore durante il caricamento dei prodotti.</p>";
        });
}

// Funzione per generare la tabella
function generateTable(products) {
    const table = document.createElement("table");
    table.className = "table table-striped table-bordered w-100";

    // Creazione della riga di intestazione
    const thead = document.createElement("thead");
    const keyRow = document.createElement("tr");
    const key = ["ID", "Nome", "Brand", "Prezzo", "Descrizione", "URL Immagine", "Creato il", "Aggiornato il", "User ID"];
    key.forEach(keyText => {
        const th = document.createElement("th");
        th.textContent = keyText;
        keyRow.appendChild(th);
    });
    thead.appendChild(keyRow);
    table.appendChild(thead);

    // il body della tabella
    const tbody = document.createElement("tbody");
    products.forEach(product => {
        const row = document.createElement("tr");

        // Colonna ID
        const idCell = document.createElement("td");
        idCell.textContent = product._id;
        row.appendChild(idCell);

        // e cosi via 
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        
        const brandCell = document.createElement("td");
        brandCell.textContent = product.brand;
        row.appendChild(brandCell);

        
        const priceCell = document.createElement("td");
        priceCell.textContent = `${product.price} €`;
        row.appendChild(priceCell);

        
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = product.description;
        descriptionCell.classList.add("truncated-text"); 
        row.appendChild(descriptionCell);

        
        const imageUrlCell = document.createElement("td");
        imageUrlCell.textContent = product.imageUrl; 
        imageUrlCell.classList.add("text-truncate"); 
        row.appendChild(imageUrlCell);

        
        const createdAtCell = document.createElement("td");
        createdAtCell.textContent = new Date(product.createdAt).toLocaleString();
        row.appendChild(createdAtCell);

        
        const updatedAtCell = document.createElement("td");
        updatedAtCell.textContent = new Date(product.updatedAt).toLocaleString();
        row.appendChild(updatedAtCell);

        
        const userIdCell = document.createElement("td");
        userIdCell.textContent = product.userId;
        row.appendChild(userIdCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    
    const container = document.getElementById("tableContainer");
    container.innerHTML = ""; 
    container.appendChild(table);
    container.style.visibility = "visible"; 
}














