const express = require('express');
const router = express.Router();
const CartManager = require('../src/cartManager');
const path = require('path');
const cartManager = new CartManager(path.join(__dirname, '../src/carts.json'));

// Ruta raíz POST /api/carts
router.post('/', async (req, res) => {
  try {
    const newCartId = await cartManager.createCart();
    res.status(201).json({ message: 'Cart created successfully', cartId: newCartId });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = +req.params.cid; // Lee el ID del carrito como número entero
    const productId = +req.params.pid; // Lee el ID del producto como número entero

    await cartManager.addProductToCart(cartId, productId); // Agrega el producto al carrito

    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
