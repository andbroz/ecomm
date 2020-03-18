const layout = require('../layout');

module.exports = () => {
	return layout({
		content: `
    <div>
      <form  method="POST">
        <input type="email" name="email" id="" placeholder="email" />
        <input type="password" name="password" id="" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
    `,
		title: 'Sign in'
	});
};
