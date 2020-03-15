const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`
		<div>
			<form  method="POST">
				<input type="email" name="email" id="" placeholder="email" />
				<input type="password" name="password" id="" placeholder="password" />
				<input type="password" name="passwordConfirmation" id="" placeholder="password confirmation" />
				<button>Sign up</button>
			</form>
		</div>
	`);
});

app.post('/', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });

	if (existingUser) {
		return res.send('Email in use');
	}

	if (password !== passwordConfirmation) {
		return res.send('Passwords must match.');
	}

	res.send('Account created');
});

app.listen(3000, () => {
	console.log('listening');
});
