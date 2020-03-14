const express = require('express');
const bodyParser = require('body-parser');

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

app.post('/', (req, res) => {
	console.log(req.body);
	res.send('Account created');
});

app.listen(3000, () => {
	console.log('listening');
});
