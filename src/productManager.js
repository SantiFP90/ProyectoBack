const fs = require('fs').promises;


class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProductsFromFile();
  }

  async saveProductsToFile(products) {
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(this.path, data);
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error loading products from file:', error);
    }
  }

  async getProducts() {
    await this.loadProductsFromFile();
    return this.products;
  }

  async getProductById(id) {
    const productId = parseInt(id); // Realizar parsing del id como entero
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
  

  async getProductByCode(code) {
    const product = this.products.find((p) => p.code === code);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
  
  

  async addProduct(product) {
    await this.loadProductsFromFile();
    const existingProductIndex = this.products.findIndex((p) => p.code === product.code);
  
    if (existingProductIndex !== -1) {
      // Actualizar el producto existente
      const existingProduct = this.products[existingProductIndex];
      existingProduct.title = product.title;
      existingProduct.description = product.description;
      existingProduct.price = product.price;
      existingProduct.stock = product.stock;
      existingProduct.category = product.category;
      existingProduct.thumbnails = product.thumbnails;
      await this.saveProductsToFile(this.products);
      return existingProduct.id;
    }
  
    // Agregar un nuevo producto
    const id = this.generateProductId();
    product.id = id;
    this.products.push(product);
    await this.saveProductsToFile(this.products);
    return id;
  }

async updateProduct(id, updatedFields) {
  await this.loadProductsFromFile();
  const product = this.products.find((p) => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  Object.assign(product, updatedFields);
  await this.saveProductsToFile(this.products);
}

async updateProductByCode(code, updatedFields) {
  await this.loadProductsFromFile();
  const productIndex = this.products.findIndex((p) => p.code === code);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  const product = this.products[productIndex];
  Object.assign(product, updatedFields);
  await this.saveProductsToFile(this.products);
}


async deleteProductById(id) {
  const productId = parseInt(id); // Parsear el id como entero
  await this.loadProductsFromFile();
  const index = this.products.findIndex((p) => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const deletedProduct = this.products.splice(index, 1);
  await this.saveProductsToFile(this.products);
  return deletedProduct;
}


  async deleteProductByCode(code) {
    await this.loadProductsFromFile();
    const index = this.products.findIndex((p) => p.code === code);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = this.products.splice(index, 1);
    await this.saveProductsToFile(this.products);
    return deletedProduct;
  }
  

  generateProductId() {
    let id = 1;
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      id = lastProduct.id + 1;
    }
    return id;
  }
}

module.exports = ProductManager;
