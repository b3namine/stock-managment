const state = {
	orders: []
};

const getters = {
	orders: state => {
		return state.orders;
	}
};

const mutations = {
	SET_ORDERS: (state, payload) => {
		state.orders = payload;
	},
	NEW_ORDER: (state, payload) => {
		state.orders.unshift(payload);
	},
	EDIT_ORDER: (state, payload) => {
		state.orders = [...state.orders.map((order) => payload.ID === order.ID
			? payload
			: order)];

	},
	DELETE_ORDER: (state, payload) => {
		state.orders = [...state.orders.filter((order) => order.ID !== payload)];
	}
};

const actions = {
	GET_ORDERS: (context) => {
		const orders = window.ipcRenderer.sendSync("get-orders", null).sort((a, b) => b.ID - a.ID);
		context.commit('SET_ORDERS', orders);
	},
	NEW_ORDER: (context, payload) => {
		const orders = window.ipcRenderer.sendSync('insert-order', JSON.stringify(payload))[0]
		context.commit('NEW_ORDER', orders);
	},
	EDIT_ORDER: (context, payload) => {
		const newOrder = window.ipcRenderer.sendSync('edit-order', JSON.stringify(payload));
		context.commit('EDIT_ORDER', newOrder);
	},
	DELETE_ORDER: (context, payload) => {
		payload.map((orderId) => {
			window.ipcRenderer.sendSync('delete-order', orderId);
			context.commit('DELETE_ORDER', orderId);
		});
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};
