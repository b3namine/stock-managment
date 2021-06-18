import {knex} from '../db/knex';

export const getAllUsers = async (event) => {
	try {
		event.returnValue = await knex("USER")
			.select("*");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertClient = async (event, data) => {
	try {
		const user = JSON.parse(data);
		const newUserID = await knex.insert(
			{
				...user,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('USER');

		event.returnValue = await knex('USER')
			.where('ID', newUserID[0])
			.select("*");
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
			.where("ID", user.ID).update(user);
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}
