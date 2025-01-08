console.log("Script back.js caricato correttamente");


let post = document.getElementById("post");




post.addEventListener("click", (event) => {
    event.preventDefault(); 
    addProduct(); 
   


});



//aggiungi prodotto con POST


function addProduct() {
    const url = "https://striveschool-api.herokuapp.com/api/product/"


    const Product = async function() {

        let nameInp = document.getElementById("name");
        let descriptionInp = document.getElementById("description");
        let brandInp = document.getElementById("brand");
        let imageInp = document.getElementById("image");
        let priceInp = document.getElementById("price");




        try {
            const risultato = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
                },

                body: JSON.stringify({
                    name: nameInp.value,
                    description:  descriptionInp.value.replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                    brand: brandInp.value,
                    imageUrl: imageInp.value,
                    price: parseFloat(priceInp.value)
                })
            });
            const newProduct = await risultato.json();
            console.log(`ID del prodotto aggiunto: ${newProduct._id}`);
            alert("il prodotto è stato creato")
            alert(`ID del prodotto creato: ${newProduct._id}`)


// Resetta i campi del form
nameInp.value = "";
descriptionInp.value = "";
brandInp.value = "";
imageInp.value = "";
priceInp.value = "";

        } catch (errore) {
            alert("Si è verificato un errore:", errore);
        }


    }
    Product()
}

// bottone per Put

document.getElementById("buttonP").addEventListener("click", (event) => {
    event.preventDefault();
    
    const productId = document.getElementById("productId").value.trim();
    
    
    if (!productId) {
        alert("L'ID del prodotto è mancante!");
        console.error("ID del prodotto non fornito.");
        return;
    }
    
    console.log("ID del prodotto:", productId);
    
    
    editProduct(productId);
});

function editProduct(productId) {
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;

    // Recupera i valori dagli input
    const nameP = document.getElementById("nameP").value.trim();
    const descriptionP = document.getElementById("descriptionP").value.trim();
    const brandP = document.getElementById("brandP").value.trim();
    const imageP = document.getElementById("imageP").value.trim();
    const priceP = parseFloat(document.getElementById("priceP").value.trim());

    // Validazione dei campi
    if (!nameP || !descriptionP || !brandP || !imageP || isNaN(priceP)) {
        alert("Tutti i campi sono obbligatori e devono essere compilati correttamente!");
        console.error("Campi non validi:", { nameP, descriptionP, brandP, imageP, priceP });
        return;
    }

    console.log("Dati inviati nel body:", { nameP, descriptionP, brandP, imageP, priceP });


    // Effettua la richiesta PUT
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
        },
        body: JSON.stringify({
            name: nameP,
            description: descriptionP,
            brand: brandP,
            imageUrl: imageP,
            price: priceP
        })
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

            // Resetta i campi del form
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
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
    };

    try {
        const response = await fetch(url, { headers: headers });
        const products = await response.json();

        // Eliminazione parallela con Promise.all
        const deletePromises = products.map(product => deleteProduct(product._id));
        await Promise.all(deletePromises);

        console.log("Tutti i prodotti sono stati eliminati.");
    } catch (error) {
        console.error("Si è verificato un errore durante il recupero dei prodotti:", error);
    }
}





//elimina solo un prodotto in base al suo Id
let deletedOne = document.getElementById("deletedOne");
deletedOne.addEventListener("click", (event) => {
    event.preventDefault();

    const delId = document.getElementById("delId"); // Recupera l'ID del prodotto
    const productId = delId.value; // Ottieni il valore dell'ID

    if (productId) { // Controlla se l'ID è valido
        deleteProduct(productId); // Passa l'ID alla funzione
        delId.value = ""; 
    } else {
        console.error("ID del prodotto non valido.");
		
    }
});


//Funzione per eliminare un singolo prodotto
async function deleteProduct(productId) {
    const url = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
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

    if (window.innerWidth >= 992) { // Solo per dispositivi grandi
        if (appearTable) {
            // Nascondi la tabella
            tableContainer.innerHTML = "";
            tableContainer.style.visibility = "hidden";
        } else {
            // Mostra la tabella
            getProductsAndGenerateTable();
            tableContainer.style.visibility = "visible";
        }
        appearTable = !appearTable; // Inverti lo stato
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
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYzZhMjUzMDRhNzAwMTUxNDhiNDUiLCJpYXQiOjE3MzYyOTE4OTcsImV4cCI6MTczNzUwMTQ5N30.NYH7CHSXbzpPKpGq5lW74ohneT9JdNlbnwQd5BMTjf8"
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

    // Corpo della tabella
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
