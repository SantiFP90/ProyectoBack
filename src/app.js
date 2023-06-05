const path = require("path");
const express = require("express");
const app = express();
const routerProducts = require("../routes/routerProducts");
const routerCart = require("../routes/routerCart");
const exphbs = require("express-handlebars").create({});
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

//Express
app.use(express.json());
const PORT = 8080;

//Socket
// const io = socketIO(server);

//Handlebars
app.engine("handlebars", exphbs.engine);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

const ProductManager = require("../utilities/productManager");
const productManager = new ProductManager(
  path.join(__dirname, "../data/productos.json")
);

app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Internal server error");
  }
});

app.use("/api/products", routerProducts);

app.use("/api/carts", routerCart);

app.use(
  "/socket.io",
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);

// app.listen(PORT, () => {
//   console.log(`Servidor Express escuchando en el puerto ${PORT}`);
// });

//Real Time
// Ruta para renderizar la vista realTimeProducts.handlebars
app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Internal server error");
  }
});

// ...

io.on("connection", (socket) => {
  console.log("New client connected");

  // Escuchar eventos de cambio en la lista de productos
  productManager.on("change", (products) => {
    // Emitir evento 'update' con la lista actualizada de productos
    socket.emit("update", products);
  });

  // Manejar evento 'createProduct' para crear un nuevo producto
  socket.on("createProduct", async (product) => {
    try {
      await productManager.addProduct(product);

      // Emitir evento 'update' con la lista actualizada de productos a todos los clientes
      io.emit("update", await productManager.getProducts());

      console.log(`Product created with ID: ${product}`);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  });

  // Manejar evento 'deleteProduct' para eliminar un producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProductById(productId);

      // Emitir evento 'update' con la lista actualizada de productos a todos los clientes
      io.emit("update", await productManager.getProducts());

      console.log(`Product deleted with ID: ${productId.id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ...

server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
