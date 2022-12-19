import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path
    }

    writeFile = async (title, description, price, thumbnails, code, status, category, stock) => {

        const newProduct = {
            id: 1,
            title,
            description,
            price,
            thumbnails: thumbnails ? [...thumbnails] : [],
            code,
            status: true,
            category,
            stock
        }
        await fs.promises.writeFile(this.path, JSON.stringify([newProduct], null, 2))
    }

    getProducts = async (limit) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) {
                return { status: 400, message: 'No hay nada en el archivo, agregar un producto nuevo.' }
            }

            const products = JSON.parse(content);

            if (products.length == 0) return { status: 400, message: 'No hay productos en la lista, agregar un producto nuevo.' }

            return products.slice(0, limit)

        } else {
            return { status: 400, message: 'El archivo no existe' }
        }
    }

    getProductById = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return { status: 400, message: 'No hay nada en el archivo, agregar un producto nuevo.' }

            const products = JSON.parse(content);

            if (products.length == 0) return { status: 400, message: 'No hay productos en la lista, agregar un producto nuevo.' }

            const idCheck = products.find(el => el.id == id);

            if (idCheck) {
                return idCheck;
            } else {
                return { status: 400, message: `El id: ${id} no existe` };
            }

        } else {
            return { status: 400, message: 'El archivo no existe' }
        }
    }

    addProduct = async (title, description, price, thumbnails, code, category, stock) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return this.writeFile(title, description, price, thumbnails, code, category, stock);

            const products = JSON.parse(content);

            const codeCheck = products.find(el => el.code == code);

            if (codeCheck) return { status: 400, message: `El codigo: ${code} con nombre ${title} ya existe, cmabairlo por uno no existente` }

            products.push({
                id: products.length !== 0 ? products[products.length - 1].id + 1 : 1,
                title,
                description,
                price,
                thumbnails: thumbnails ? [...thumbnails] : [],
                code,
                status: true,
                category,
                stock
            });

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        } else {
            this.writeFile(title, description, price, thumbnails, code, category, stock);
        }
    }

    updateProduct = async (id, updateValues) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return { status: 400, message: 'No hay nada en el archivo, agregar un producto nuevo.' };

            const products = JSON.parse(content);

            if (products.length == 0) return { status: 400, message: 'No hay productos en la lista, agregar un producto nuevo.' };

            const changingObj = products.find(el => el.id == id)

            if (changingObj) {
                const updatedObj = { ...changingObj, ...updateValues }
                products.splice(id - 1, 1, updatedObj);
            } else {
                return { status: 400, message: 'El id no existe' }
            }

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
        } else {
            return { status: 400, message: 'El archivo no existe' }
        }
    }

    deleteProduct = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return { status: 400, message: 'No hay nada en el archivo, agregar un producto nuevo.' };

            const products = JSON.parse(content);

            if (products.length == 0) return { status: 400, message: 'No hay productos en la lista, agregar un producto nuevo.' };

            const deletedObj = products.find(el => el.id == id)

            if (deletedObj) {
                products.splice(id - 1, 1)
            } else {
                return { status: 400, message: 'El id no existe' }
            }

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))

        } else {
            return { status: 400, message: 'El archivo no existe' }
        }
    }
}

export default ProductManager