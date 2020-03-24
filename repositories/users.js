const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	/** CREATE */
	async create(attrs) {
		// attrs = {email: 'abc@def.com', password: 'password'}

		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();

		const record = {
			...attrs,
			password: `${buf.toString('hex')}.${salt}`
		};
		records.push(record);
		// write updated records back to this.filename
		await this.writeAll(records);

		return record;
	}

	/** comaprePassword
	 *
	 * @param {String} saved - hashed password with salt
	 * @param {String} supplied - plain text password given by user
	 */
	async comparePasswords(saved, supplied) {
		const [hashed, salt] = saved.split('.');
		const buf = await scrypt(supplied, salt, 64);
		const hashSupplied = buf.toString('hex');
		return hashed === hashSupplied;
	}
}

module.exports = new UsersRepository('users.json');
