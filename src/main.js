import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Unicon from 'vue-unicons/dist/vue-unicons-vue2.umd'
import {
	uniEstate, uniUsersAlt,
	uniTimes, uniTrashAlt, uniUserPlus, uniEditAlt,
	uniGrid, uniShoppingBag, uniPlus, uniSearch, uniGraphBar, uniBox
} from 'vue-unicons/dist/icons'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {locale});
Unicon.add([uniEstate, uniUsersAlt, uniTimes, uniTrashAlt,
	uniUserPlus, uniEditAlt, uniGrid, uniShoppingBag, uniPlus, uniSearch, uniGraphBar, uniBox]);
Vue.config.productionTip = false;
Vue.use(Unicon);

new Vue({
	router,
	store,
	created() {
		this.$router.push("/home").catch(() => {
		});
	},
	render: h => h(App)
}).$mount("#app");
