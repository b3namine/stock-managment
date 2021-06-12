import {knex} from '../db/knex';

export const getAllOrders = async (event) => {
	try {
		const orders = await knex("ORDERS")
			.select("ID")
			.select("PRODUCT_ID")
			.select("CLIENT_ID")
			.select("COUNT")
			.select("CREATED_AT");
		const values = [];
		await orders.map(async (order) => {
			const product = await knex('PRODUCTS')
				.where('ID', order.PRODUCT_ID)
				.select("ID")
				.select("NAME")
				.select("PRICE")
				.select("PRICE_BASE")
				.select("PRICE_GRAU")
				.select("PRODUCT_NUMBER")
				.select("UNIT")
				.select("STOCK")
				.select("CREATED_AT");
			const client = await knex('USER')
				.where('ID', order.CLIENT_ID)
				.select("ID")
				.select("NAME")
				.select("PHONE")
				.select("EMAIL")
				.select("BIRTHDAY")
				.select("CREATED_AT");

			values.push({
				ID: order.ID,
				COUNT: order.COUNT,
				CREATED_AT: order.CREATED_AT,
				CLIENT: client,
				PRODUCT: product
			});
		});
		event.returnValue = await values;
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertOrder = async (event, data) => {
	try {
		const user = JSON.parse(data);
		const a = await knex.insert(
			{
				PRODUCT_ID: user.productId,
				CLIENT_ID: user.clientId,
				COUNT: user.email,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('ORDERS')
		const order = await knex('ORDERS')
			.where('ID', a[0])
			.select("ID")
			.select("PRODUCT_ID")
			.select("CLIENT_ID")
			.select("COUNT")
			.select("CREATED_AT");
		const product = await knex('PRODUCTS')
			.where('ID', order.PRODUCT_ID)
			.select("ID")
			.select("NAME")
			.select("PRICE")
			.select("PRICE_BASE")
			.select("PRICE_GRAU")
			.select("PRODUCT_NUMBER")
			.select("UNIT")
			.select("STOCK")
			.select("CREATED_AT");
		const client = await knex('USER')
			.where('ID', order.CLIENT_ID)
			.select("ID")
			.select("NAME")
			.select("PHONE")
			.select("EMAIL")
			.select("BIRTHDAY")
			.select("CREATED_AT");
		event.returnValue = {
			ID: order.ID,
			CLIENT: client,
			PRODUCT: product,
			COUNT: order.COUNT,
			CREATED_AT: order.CREATED_AT
		}
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const deleteOrder = async (event, id) => {
	try {
		await knex("ORDERS").where("ID", id).del();
		event.returnValue = id;
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const editOrder = async (event, data) => {
	try {
		const user = JSON.parse(data);
		event.returnValue = await knex("ORDERS")
			.where("ID", user.id).update({
				PRODUCT_ID: user.productId,
				CLIENT_ID: user.clientId,
				COUNT: user.count
			});
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}
