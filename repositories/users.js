const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	/** read users array data from fs */
	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			})
		);
	}

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

	/** WRITE ALL */
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	/** RANDOM ID */
	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	/** GET ONE */

	async getOne(id) {
		const records = await this.getAll();

		return records.find(record => record.id === id);
	}

	/** DELETE */

	async delete(id) {
		const records = await this.getAll();

		const filteredRecords = records.filter(record => record.id !== id);

		await this.writeAll(filteredRecords);
	}

	/** UPDATE */

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find(record => record.id === id);

		if (!record) {
			throw new Error(`Record with id ${id} not found!`);
		}

		//update
		Object.assign(record, attrs);

		await this.writeAll(records);
	}

	/** GET ONE BY - filter */

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) {
				return record;
			}
		}
	}
}

module.exports = new UsersRepository('users.json');
