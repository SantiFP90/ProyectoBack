const fs = require("fs").promises;
const EventEmitter = require("events");

class ProductManager extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
    this.products = [];
    this.loadProductsFromFile(); // Carga inicial de productos desde el archivo
  }

  async saveProductsToFile(products) {
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(this.path, data);
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const parsedProducts = JSON.parse(data);
      this.products = parsedProducts;
    } catch (error) {
      console.error("Error loading products from file:", error);
    }
  }

  async getProducts() {
    return this.products; // Devuelve la lista actual de productos en memoria
  }

  async getProductById(id) {
    const productId = parseInt(id);
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getProductByCode(code) {
    const product = this.products.find((p) => p.code === code);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async addProduct(product) {
    const id = this.generateProductId();
    product.id = id;
    this.products.push(product);
    await this.saveProductsToFile(this.products); // Guarda los productos en el archivo
    return id;
  }

  async updateProduct(id, updatedFields) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    Object.assign(product, updatedFields);
    await this.saveProductsToFile(this.products); // Guarda los productos en el archivo
  }

  async updateProductByCode(code, updatedFields) {
    const product = this.products.find((p) => p.code === code);
    if (!product) {
      throw new Error("Product not found");
    }
    Object.assign(product, updatedFields);
    await this.saveProductsToFile(this.products); // Guarda los productos en el archivo
  }

  async deleteProductById(id) {
    const productId = parseInt(id);
    const index = this.products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deletedProduct = this.products.splice(index, 1)[0];
    await this.saveProductsToFile(this.products); // Guarda los productos en el archivo
    return deletedProduct;
  }

  async deleteProductByCode(code) {
    const index = this.products.findIndex((p) => p.code === code);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deletedProduct = this.products.splice(index, 1)[0];
    await this.saveProductsToFile(this.products); // Guarda los productos en el archivo
    return deletedProduct;
  }

  generateProductId() {
    const lastProduct = this.products[this.products.length - 1];
    const lastId = lastProduct ? lastProduct.id : 0;
    return lastId + 1;
  }
}

module.exports = ProductManager;
