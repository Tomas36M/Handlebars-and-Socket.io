

const socket = io();

const productsContainer = document.getElementById("products-table-body");
const createProductForm = document.getElementById("create-product-form");

socket.on("products", (products) => {
    const allProductsElements = products
        .map(
            (product) => `
        <tr>
            <td> ${product.title} </td>
            <td> ${product.description} </td>
            <td> ${product.price} </td>
            <td> ${product.category} </td>
            <td> ${product.stock} </td>
        </tr>
    `
        )
        .join(" ");

    productsContainer.innerHTML = allProductsElements;
});

createProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(createProductForm);

    const product = {};

    for (const field of formData.entries()) {
        product[field[0]] = field[1];
    }

    const response = await fetch("/api/products", {
        body: JSON.stringify(product),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseJson = await response.json();
    console.log(responseJson);
});

socket.on("hello", (data) => console.log(data));