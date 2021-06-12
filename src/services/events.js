import {ipcMain} from "electron";
import {deleteClient, editClient, getAllUsers, insertClient} from "./users";
import {deleteProduct, editProduct, getAllProducts, insertProduct} from "./products";
import {deleteOrder, editOrder, getAllOrders, insertOrder} from "./orders";


// USER

ipcMain.on('get-user-data', async (data) => {
	await getAllUsers(data);
});
ipcMain.on('insert-new-client', async (event, data) => {
	await insertClient(event, data);
});
ipcMain.on('delete-client', async (event, id) => {
	await deleteClient(event, id);
});
ipcMain.on('edit-client', async (event, data) => {
	console.log(data);
	await editClient(event, data);
});


// PRODUCT

ipcMain.on('get-products', async (data) => {
	await getAllProducts(data);
});
ipcMain.on('insert-product', async (event, data) => {
	await insertProduct(event, data);
});
ipcMain.on('delete-product', async (event, id) => {
	await deleteProduct(event, id);
});
ipcMain.on('edit-product', async (event, data) => {
	console.log(data);
	await editProduct(event, data);
});

// ORDERS

ipcMain.on('get-orders', async (data) => {
	await getAllOrders(data);
});
ipcMain.on('insert-order', async (event, data) => {
	await insertOrder(event, data);
});
ipcMain.on('delete-order', async (event, id) => {
	await deleteOrder(event, id);
});
ipcMain.on('edit-order', async (event, data) => {
	console.log(data);
	await editOrder(event, data);
});


