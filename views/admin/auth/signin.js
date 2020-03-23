const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors } = {}) => {
	return layout({
		content: `
    <div>
      <form  method="POST">
        <input type="text" name="email" id="" placeholder="email" />
        ${getError(errors, 'email')}
        <input type="password" name="password" id="" placeholder="password" />
        ${getError(errors, 'password')}
        <button>Sign In</button>
      </form>
    </div>
    `,
		title: 'Sign in'
	});
};
