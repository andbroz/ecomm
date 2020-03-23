const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) => {
	return layout({
		content: `
  <div>
  Your id is: ${req.session.userId}
    <form  method="POST">
      <input type="text" name="email" id="" placeholder="email" />
      ${getError(errors, 'email')}
      <input type="password" name="password" id="" placeholder="password" />
      ${getError(errors, 'password')}
      <input type="password" name="passwordConfirmation" id="" placeholder="password confirmation" />
      ${getError(errors, 'passwordConfirmation')}
      <button>Sign up</button>
    </form>
  </div>
`,
		title: 'Sign up'
	});
};
