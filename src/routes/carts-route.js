import { Router } from "express";
import CartManager from "../managers/cart-manager.js";

const route = Router();
const manager = new CartManager('./src/data/carts.json')

route.post('/', async (req, res) => {
    try {
        await manager.addCart()
        res.status(200).send({ status: 200, message: 'Se ha agregado el carrito' })
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

route.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await manager.getCartProducts(id)
        if (result.status == 400) {
            return res.status(400).send({ status: 400, message: result.message })
        }
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

route.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await manager.addProductToCart(cid, pid);
        if (result && result.status == 400) {
            return res.status(400).send({ status: 400, message: result.message })
        }
        res.status(200).send({ status: 'sucsess', message: 'El producto se ha agregado a la lista.' })
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

export default route