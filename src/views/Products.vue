<template>
  <div class="products-container">
    <div class="products-option-list">
      <div class="products-option-list_item" @click="isModalVisible = true">
        <unicon name="plus" fill="white"/>
      </div>
      <div :class="selected.length === 0?'products-option-list_item button_disabled' : 'products-option-list_item'"
           @click="deleteProducts">
        <unicon name="trash-alt" fill="white" width="16" height="20"/>
        ({{ selected.length }})
      </div>
      <div class="products-option-list_input">
        <unicon name="search" fill="black" width="16" height="16"/>
        <input type="text" v-model="search" placeholder="Search..."/>
      </div>
    </div>
    <table class="products">
      <thead>
      <tr class="products-header">
        <th><input type="checkbox" @click="selectAll" v-model="allSelected"/></th>
        <th>Name</th>
        <th>prix de base</th>
        <th>prix de gros</th>
        <th>Prix de detail</th>
        <th>Unit</th>
        <th>Stock</th>
        <th>Product number</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      </thead>
      <tbody>
      <tr class="products-list" v-for="(row, idx) in productSearch" :key="idx">
        <td><input type="checkbox" v-model="selected" :value="row.ID"/></td>
        <td class="products-list_item">{{ row.NAME }}</td>
        <td class="products-list_item">{{ row.PRICE_BASE }}</td>
        <td class="products-list_item">{{ row.PRICE_GRAU }}</td>
        <td class="products-list_item">{{ row.PRICE }}</td>
        <td class="products-list_item">{{ row.UNIT }}</td>
        <td class="products-list_item">{{ row.STOCK }}</td>
        <td class="products-list_item">{{ row.PRODUCT_NUMBER }}</td>
        <td class="products-list_item">{{ row.CREATED_AT }}</td>
        <td class="products-list_item">
          <div class="products-option-list_item" @click="editProduct(row.ID)">
            <unicon name="edit-alt" fill="white" width="16" height="16"/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;product = {}">
      <input type="text" placeholder="name..." v-model="product.NAME"/>
      <input type="tel" placeholder="Price..." v-model="product.PRICE"/>
      <input type="text" placeholder="Price base ..." v-model="product.PRICE_BASE"/>
      <input type="text" placeholder="Price gros..." v-model="product.PRICE_GRAU"/>
      <input type="text" placeholder="Unit..." v-model="product.UNIT"/>
      <input type="text" placeholder="Stock..." v-model="product.STOCK"/>
      <input type="text" placeholder="Product number..." v-model="product.PRODUCT_NUMBER"/>
      <button @click="modalType === 0 ? insertProduct(): saveEditProduct()">
        {{ modalType === 0 ? 'add' : 'save' }}
      </button>
    </Modal>
  </div>

</template>

<script>
import Modal from "../components/modal";
import {mapGetters} from "vuex";

export default {
  name: "products",
  components: {Modal},
  data() {
    return {
      product: {},
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
      search: ''
    };
  },
  computed: {
    ...mapGetters(['products']),
    productSearch() {
      return this.products.filter(product => {
        return product.NAME.toLowerCase().includes(this.search.toLowerCase())
            || product.PRODUCT_NUMBER.toLowerCase().includes(this.search.toLowerCase());
      })
    },
  },
  methods: {
    insertProduct() {
      this.$store.dispatch('NEW_PRODUCT', this.product);
      this.isModalVisible = false;
      this.product = {};
    },
    selectAll() {
      this.selected = [];
      if (!this.allSelected) {
        this.products.map((product) => {
          this.selected.push(product.ID);
        });
      }
    },
    deleteProducts() {
      this.$store.dispatch('DELETE_PRODUCT', this.selected);
      this.selected = [];
    },
    editProduct(id) {
      this.modalType = 1;
      this.isModalVisible = true;
      const product = this.products.filter((product) => product.ID === id)[0]
      Object.keys(product).map(key => this.product[key] = product[key]);
    },
    saveEditProduct() {
      this.$store.dispatch('EDIT_PRODUCT', this.product);
      this.isModalVisible = false;
      this.product = {};
    }
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px 0;
  width: calc(100% - 90px);
}

.products-list_item {
  text-align: center;
  align-items: center;
  align-content: center;
}


.products {
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.products thead tr {
  background-color: #000;
  color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.products th,
.products td {
  padding: 12px 15px;
}

.products tbody tr {
  border-bottom: 1px solid #dddddd;
}

.products tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.products tbody tr:last-of-type {
  border-bottom: 2px solid #000;
}

.products tbody tr.active-row {
  font-weight: bold;
  color: #000;
}

.products-option-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.products-option-list .products-option-list_item {
  margin: 0 10px;
}

.products-option-list_input {
  width: fit-content;
  align-content: center;
  align-items: center;
  font-size: 16px;
  display: flex;
  border: 1px solid black;
  line-height: 11px;
  border-radius: 6px;
}

.products-option-list_input .unicon {
  margin: 0 5px;
}

.products-option-list_input input {
  padding: 13px 0;
  outline: none;
  border: none;
  margin-right: 5px;
}

.products-option-list_item {
  padding: 10px 15px;
  width: fit-content;
  align-content: center;
  align-items: center;
  background-color: black;
  color: white;
  font-size: 16px;
  display: flex;
  line-height: 11px;
  border-radius: 6px;
  margin: 0 auto;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.products-option-list_item:hover {
  background-color: rgba(0, 0, 0, 0.64);
}

.products-option-list_item:active {
  background-color: rgba(0, 0, 0, 0.84);
  transform: scale(0.96);
}

.products-option-list_item.button_disabled {
  display: none;
}
</style>
