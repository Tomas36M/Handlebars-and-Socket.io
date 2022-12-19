import { Router } from "express";
import ProductManager  from "../managers/product-manager.js";

const manager = new ProductManager('./src/data/products.json')

const route = Router();

route.get("/", async (req, res) => {

    const products = await manager.getProducts();

    res.render("home", {
        products,
    });
});

route.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default route;