const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/singup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({}));
});

router.post(
	'/signup',
	[requireEmail, requirePassword, requirePasswordConfirmation],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		// create a user in our user repo to represent this person
		const user = await usersRepo.create({ email, password });
		// store the id of that user inside the users cookie
		req.session.userId = user.id; // Added by cookie session lib

		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({})); // signin template
});

router.post(
	'/signin',
	[requireEmailExists, requireValidPasswordForUser],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;
		const user = await usersRepo.getOneBy({ email });
		req.session.userId = user.id;

		res.redirect('/admin/products');
	}
);

module.exports = router;
