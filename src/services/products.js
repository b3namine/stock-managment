import {knex} from '../db/knex';

export const getAllProducts = async (event) => {
	try {
		event.returnValue = await knex("PRODUCTS")
			.select("ID")
			.select("NAME")
			.select("PRICE")
			.select("PRICE_BASE")
			.select("PRICE_GRAU")
			.select("PRODUCT_NUMBER")
			.select("UNIT")
			.select("STOCK")
			.select("CREATED_AT");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertProduct = async (event, data) => {
	try {
		const user = JSON.parse(data);
		const a = await knex.insert(
			{
				NAME: user.name,
				PRICE: user.price,
				PRICE_BASE: user.priceBase,
				PRICE_GRAU: user.priceGrau,
				PRODUCT_NUMBER: user.productNumber,
				UNIT: user.unit,
				STOCK: user.stock,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('PRODUCTS')

		event.returnValue = await knex('PRODUCTS')
			.where('ID', a[0])
			.select("ID")
			.select("NAME")
			.select("PRICE")
			.select("PRICE_BASE")
			.select("PRICE_GRAU")
			.select("PRODUCT_NUMBER")
			.select("UNIT")
			.select("STOCK")
			.select("CREATED_AT");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const deleteProduct = async (event, id) => {
	try {
		await knex("PRODUCTS").where("ID", id).del();
		event.returnValue = id;
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

export const editProduct = async (event, data) => {
	try {
		const user = JSON.parse(data);
		event.returnValue = await knex("PRODUCTS")
			.where("ID", user.id).update({
				NAME: user.name,
				PRICE: user.price,
				PRICE_BASE: user.priceBase,
				PRICE_GRAU: user.priceGrau,
				PRODUCT_NUMBER: user.productNumber,
				UNIT: user.unit,
				STOCK: user.stock
			});
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}
