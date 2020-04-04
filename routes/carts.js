const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// receive a post request to add and item to a cart
router.post('/cart/products', async (req, res) => {
	// Figure out hte cart!
	let cart;
	if (!req.session.cartId) {
		// we dont have a cart, we need to create one,
		// and store the cart id on the req.session.cartId prop
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		// we have a cart. Lests get it from the repo
		cart = await cartsRepo.getOne(req.session.cartId);
	}

	// EIther increment qty for existing product or add a new product

	const existingItem = cart.items.find(
		(item) => item.id === req.body.productId
	);
	if (existingItem) {
		// inc qty and save cart
		existingItem.quantity++;
	} else {
		// add new product id to items array
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}

	await cartsRepo.update(cart.id, {
		items: cart.items,
	});

	res.send('Product added to cart');
});

// receive a get request to show all items in cart
router.get('/cart', async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}

	const cart = await cartsRepo.getOne(req.session.cartId);

	for (let item of cart.items) {
		// item === {id, quantity}
		const product = await productsRepo.getOne(item.id);
		item.product = product;
	}

	res.send(cartShowTemplate({ items: cart.items }));
});

// receive a post request to delete and item from a cart

module.exports = router;
