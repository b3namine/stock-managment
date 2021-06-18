const state = {
	clients: []
};

const getters = {
	clients: state => {
		return state.clients;
	}
};

const mutations = {
	SET_CLIENTS: (state, payload) => {
		state.clients = payload;
	},
	NEW_CLIENT: (state, payload) => {
		state.clients.unshift(payload);
	},
	EDIT_CLIENT: (state, payload) => {
		state.clients = [...state.clients.map((client) => payload.ID === client.ID
			? payload
			: client)];
	},
	DELETE_CLIENT: (state, payload) => {
		state.clients = [...state.clients.filter((client) => client.ID !== payload)];
	}
};

const actions = {
	GET_CLIENTS: (context) => {
		const clients = window.ipcRenderer.sendSync("get-user-data", null).sort((a, b) => b.ID - a.ID);
		context.commit('SET_CLIENTS', clients);
	},
	NEW_CLIENT: (context, payload) => {
		const clients = window.ipcRenderer.sendSync('insert-new-client', JSON.stringify(payload))[0]
		context.commit('NEW_CLIENT', clients);
	},
	EDIT_CLIENT: (context, payload) => {
		window.ipcRenderer.sendSync('edit-client', JSON.stringify(payload));
		context.commit('EDIT_CLIENT', payload);
	},
	DELETE_CLIENT: (context, payload) => {
		payload.map((clientId) => {
			window.ipcRenderer.sendSync('delete-client', clientId);
			context.commit('DELETE_CLIENT', clientId);
		});
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};
