const apiUrl = "http://localhost:3000/api/products";

// Handle form submission and add product
document.getElementById("product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const productData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        contact: document.getElementById("contact").value,
        date: document.getElementById("date").value
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });
        const newProduct = await response.json();
        alert("Product added successfully!");
        document.getElementById("product-form").reset(); // Clear the form
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
    }
});

// Show products
document.getElementById("show-products-btn").addEventListener("click", async () => {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});

// Function to display products
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear existing products

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <p>Category: ${product.category}</p>
            <p>Contact: ${product.contact}</p>
            <p>Date: ${product.date}</p>
        `;
        productList.appendChild(productCard);
    });
}
