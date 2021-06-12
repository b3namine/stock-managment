import {knex} from '../db/knex';

export const getAllUsers = async (event) => {
	try {
		event.returnValue = await knex("USER")
			.select("ID")
			.select("NAME")
			.select("PHONE")
			.select("EMAIL")
			.select("BIRTHDAY")
			.select("CREATED_AT");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertClient = async (event, data) => {
	try {
		const user = JSON.parse(data);
		const a = await knex.insert(
			{
				NAME: user.name,
				PHONE: user.telephone,
				EMAIL: user.email,
				BIRTHDAY: user.birthday,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('USER')

		event.returnValue = await knex('USER')
			.where('ID', a[0])
			.select("ID")
			.select("NAME")
			.select("PHONE")
			.select("EMAIL")
			.select("BIRTHDAY")
			.select("CREATED_AT");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const deleteClient = async (event, id) => {
	try {
		await knex("USER").where("ID", id).del();
		event.returnValue = id;
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const editClient = async (event, data) => {
	try {
		const user = JSON.parse(data);
		event.returnValue = await knex("USER")
			.where("ID", user.id).update({
				NAME: user.name,
				PHONE: user.telephone,
				EMAIL: user.email,
				BIRTHDAY: user.birthday
			});
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}
