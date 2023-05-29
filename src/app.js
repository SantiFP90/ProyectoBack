const path = require("path");
const express = require("express");
const app = express();
const routerProducts = require("../routes/routerProducts");
const routerCart = require("../routes/routerCart");

app.use(express.json());

const PORT = 8080;

app.use("/api/products", routerProducts);

app.use("/api/carts", routerCart);

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
