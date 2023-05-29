const path = require('path');
const express = require('express');
const app = express();
const routerProductos = require('../routes/routerProducts');
const cartRouter = require('../routes/routerCart');


const ProductManager = require('./productManager');
const productManager = new ProductManager(path.join(__dirname, './productos.json'));

const CartManager = require('./cartManager');
const cartManager = new CartManager(path.join(__dirname, './carts.json'));

app.use(express.json());

const PORT = 8080;

app.use('/api/products', routerProductos);

app.use('/api/carts', cartRouter);


app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});












  






