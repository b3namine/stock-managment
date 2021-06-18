import {knex} from '../db/knex';

export const getAllOrders = async (event) => {
	try {
		const orders = await knex('ORDERS')
			.join('PRODUCTS', 'ORDERS.PRODUCT_ID', '=', 'PRODUCTS.ID')
			.join('USER', 'ORDERS.CLIENT_ID', '=', 'USER.ID')
			.select(
				'ORDERS.ID',
				'ORDERS.CLIENT_ID',
				'ORDERS.PRODUCT_ID',
				'ORDERS.CREATED_AT as ORDER_CREATED_AT',
				'USER.NAME as CLIENT_NAME',
				'USER.PHONE',
				'USER.EMAIL',
				'USER.BIRTHDAY',
				'USER.CREATED_AT as CLIENT_CREATED_AT',
				'PRODUCTS.NAME as PRODUCT_NAME',
				'PRODUCTS.PRICE',
				'PRODUCTS.PRICE_BASE',
				'PRODUCTS.PRICE_GRAU',
				'PRODUCTS.PRODUCT_NUMBER',
				'PRODUCTS.UNIT',
				'PRODUCTS.STOCK',
				'PRODUCTS.CREATED_AT as PRODUCT_CREATED_AT');
		event.returnValue = orders.map((order) => beautyJson(order));
	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
};

export const insertOrder = async (event, data) => {
	try {
		const orderData = JSON.parse(data);
		const newOrder = await knex.insert(
			{
				...orderData,
				CREATED_AT: new Date().toLocaleString()
			}
		).into('ORDERS');

		const orders = await knex('ORDERS')
			.where('ORDERS.ID', newOrder[0])
			.join('PRODUCTS', 'ORDERS.PRODUCT_ID', '=', 'PRODUCTS.ID')
			.join('USER', 'ORDERS.CLIENT_ID', '=', 'USER.ID')
			.select(
				'ORDERS.ID',
				'ORDERS.CLIENT_ID',
				'ORDERS.PRODUCT_ID',
				'ORDERS.CREATED_AT as ORDER_CREATED_AT',
				'USER.NAME as CLIENT_NAME',
				'USER.PHONE',
				'USER.EMAIL',
				'USER.BIRTHDAY',
				'USER.CREATED_AT as CLIENT_CREATED_AT',
				'PRODUCTS.NAME as PRODUCT_NAME',
				'PRODUCTS.PRICE',
				'PRODUCTS.PRICE_BASE',
				'PRODUCTS.PRICE_GRAU',
				'PRODUCTS.PRODUCT_NUMBER',
				'PRODUCTS.UNIT',
				'PRODUCTS.STOCK',
				'PRODUCTS.CREATED_AT as PRODUCT_CREATED_AT');
		event.returnValue = orders.map((order) => beautyJson(order));

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
		const orderData = JSON.parse(data);
		await knex("ORDERS")
			.where("ID", orderData.ID)
			.update({
				CLIENT_ID: orderData.CLIENT_ID,
				PRODUCT_ID: orderData.PRODUCT_ID
			});
		const order = await knex('ORDERS')
			.where('ORDERS.ID', orderData.ID)
			.join('PRODUCTS', 'ORDERS.PRODUCT_ID', '=', 'PRODUCTS.ID')
			.join('USER', 'ORDERS.CLIENT_ID', '=', 'USER.ID')
			.select(
				'ORDERS.ID',
				'ORDERS.CLIENT_ID',
				'ORDERS.PRODUCT_ID',
				'ORDERS.CREATED_AT as ORDER_CREATED_AT',
				'USER.NAME as CLIENT_NAME',
				'USER.PHONE',
				'USER.EMAIL',
				'USER.BIRTHDAY',
				'USER.CREATED_AT as CLIENT_CREATED_AT',
				'PRODUCTS.NAME as PRODUCT_NAME',
				'PRODUCTS.PRICE',
				'PRODUCTS.PRICE_BASE',
				'PRODUCTS.PRICE_GRAU',
				'PRODUCTS.PRODUCT_NUMBER',
				'PRODUCTS.UNIT',
				'PRODUCTS.STOCK',
				'PRODUCTS.CREATED_AT as PRODUCT_CREATED_AT');
		event.returnValue = order.map((order) => beautyJson(order));

	} catch (err) {
		console.error(err);
		event.returnValue = err;
	}
}

const beautyJson = (json) => {
	return {
		ID: json.ID,
		CLIENT: {
			ID: json.CLIENT_ID,
			NAME: json.CLIENT_NAME,
			PHONE: json.PHONE,
			EMAIL: json.EMAIL,
			BIRTHDAY: json.BIRTHDAY,
			CREATED_AT: json.CLIENT_CREATED_AT
		},
		PRODUCT: {
			ID: json.PRODUCT_ID,
			NAME: json.PRODUCT_NAME,
			PRICE: json.PRICE,
			PRICE_BASE: json.PRICE_BASE,
			PRICE_GRAU: json.PRICE_GRAU,
			PRODUCT_NUMBER: json.PRODUCT_NUMBER,
			UNIT: json.UNIT,
			STOCK: json.STOCK,
			CREATED_AT: json.PRODUCT_CREATED_AT,
		},
		COUNT: json.COUNT,
		CREATED_AT: json.ORDER_CREATED_AT,
	}
}
