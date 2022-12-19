import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './dirname.js'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

import productRoute from './routes/products-route.js'
import cartRoute from './routes/carts-route.js'
import viewsRoute from './routes/views-route.js'

import ProductManager from './managers/product-manager.js'
const manager = new ProductManager('src/data/products.json')

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.set("io", io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs'
}))

app.use(express.static("public"))

app.set("view engine", "hbs")
app.set("views", `${__dirname}/views`)

app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/', viewsRoute);

httpServer.listen(8080, () => {
    console.log('Server running on port 8080');
});

io.on('connection', async socket => {
    console.log(`New client connected, id: ${socket.id}`);

    const products = await manager.getProducts();

    console.log(products);

    io.sockets.emit("products", products);

    socket.on("addProduct", async (product) => {
        try {
            await manager.addProduct(product);
            io.sockets.emit("products", await manager.getProducts());
        } catch (error) {
            console.log(error);
        }
    });
})