import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home.vue";
import Users from "../views/users.vue";
import Products from "../views/Products.vue";
import Orders from "../views/Orders";
import Analysis from "../views/Analysis";
import Stock from "../views/Stock";

Vue.use(VueRouter)

const routes = [
	{
		path: "/home",
		name: "Home",
		component: Home
	},
	{
		path: '/users',
		name: 'Users',
		component: Users
	},
	{
		path: '/products',
		name: 'Products',
		component: Products
	},
	{
		path: '/orders',
		name: 'Orders',
		component: Orders
	},
	{
		path: '/analysis',
		name: 'Analysis',
		component: Analysis
	},
	{
		path: '/stock',
		name: 'Stock',
		component: Stock
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
