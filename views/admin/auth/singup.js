const layout = require('../layout');
module.exports = ({ req }) => {
	return layout({
		content: `
  <div>
  Your id is: ${req.session.userId}
    <form  method="POST">
      <input type="email" name="email" id="" placeholder="email" />
      <input type="password" name="password" id="" placeholder="password" />
      <input type="password" name="passwordConfirmation" id="" placeholder="password confirmation" />
      <button>Sign up</button>
    </form>
  </div>
`,
		title: 'Sign up'
	});
};
