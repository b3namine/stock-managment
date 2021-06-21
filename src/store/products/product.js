const state = {
	products: []
};

const getters = {
	products: state => {
		return state.products;
	}
};

const mutations = {
	SET_PRODUCTS: (state, payload) => {
		state.products = payload;
	},
	NEW_PRODUCT: (state, payload) => {
		state.products.unshift(payload);
	},
	EDIT_PRODUCT: (state, payload) => {
		state.products = [...state.products.map((product) => payload.ID === product.ID
			? payload
			: product)];
	},
	DELETE_PRODUCT: (state, payload) => {
		state.products = [...state.products.filter((product) => product.ID !== payload)];
	}
};

const actions = {
	GET_PRODUCTS: (context) => {
		const products = window.ipcRenderer.sendSync("get-products", null).sort((a, b) => b.ID - a.ID);
		context.commit('SET_PRODUCTS', products);
	},
	NEW_PRODUCT: (context, payload) => {
		const products = window.ipcRenderer.sendSync('insert-product', JSON.stringify(payload))[0]
		if (!products) {
			return;
		}
		context.commit('NEW_PRODUCT', products);
	},
	EDIT_PRODUCT: (context, payload) => {
		window.ipcRenderer.sendSync('edit-product', JSON.stringify(payload));
		context.commit('EDIT_PRODUCT', payload);
	},
	DELETE_PRODUCT: (context, payload) => {
		payload.map((productId) => {
			window.ipcRenderer.sendSync('delete-product', productId);
			context.commit('DELETE_PRODUCT', productId);
		});
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};
