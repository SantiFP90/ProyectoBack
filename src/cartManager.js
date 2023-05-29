const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
  }

  async loadCartsFromFile() {
    try {
      const fileData = await fs.promises.readFile(this.filePath, 'utf-8');
      this.carts = JSON.parse(fileData);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCartsToFile() {
    try {
      const fileData = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.filePath, fileData, 'utf-8');
    } catch (error) {
      throw new Error('Error saving carts to file');
    }
  }

  async createCart() {
    await this.loadCartsFromFile();

    const newCartId = this.generateCartId();
    const newCart = {
      id: newCartId,
      products: []
    };

    this.carts.push(newCart);
    await this.saveCartsToFile();

    return newCartId;
  }

  async getCartById(id) {
    await this.loadCartsFromFile();

    const cartId = parseInt(id);
    const cart = this.carts.find((c) => c.id === cartId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    return cart;
  }

  async addProductToCart(cartId, productId) {
    await this.loadCartsFromFile();

    const cart = await this.getCartById(cartId);
    const products = cart.products;

    const productIndex = products.findIndex((p) => p.product === productId);

    if (productIndex !== -1) {
      products[productIndex].quantity++;
    } else {
      products.push({ product: productId, quantity: 1 });
    }

    await this.saveCartsToFile();
  }

  generateCartId() {
    const existingIds = this.carts.map((cart) => cart.id);
    const maxId = Math.max(...existingIds);
    return maxId + 1;
  }
}

module.exports = CartManager;



