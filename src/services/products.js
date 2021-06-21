import {knex} from '../db/knex';

export const getAllProducts = async (event) => {
	try {
		event.returnValue = await knex("PRODUCTS")
			.select("*");
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertProduct = async (event, data) => {
	try {
		const product = JSON.parse(data);
		if (!product.NAME || !product.PRICE_BASE
			|| !product.PRICE_GRAU || !product.PRICE
			|| !product.UNIT || !product.STOCK
			|| !product.PRODUCT_NUMBER) {
			return;
		}
		const newProductId = await knex.insert(
			{
				...product,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('PRODUCTS');

		event.returnValue = await knex('PRODUCTS')
			.where('ID', newProductId[0])
			.select("*");
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
		const product = JSON.parse(data);
		event.returnValue = await knex("PRODUCTS")
			.where("ID", product.ID).update(product);
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}
