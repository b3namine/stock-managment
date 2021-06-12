<template>
  <div class="products-container">
    <div class="products-option-list">
      <div class="products-option-list_item" @click="isModalVisible = true">
        <unicon name="user-plus" fill="white"/>
      </div>
      <div :class="selected.length === 0?'products-option-list_item button_disabled' : 'products-option-list_item'"
           @click="deleteProducts">
        <unicon name="trash-alt" fill="white" width="16" height="20"/>
        ({{ selected.length }})
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
      <tr class="products-list" v-for="(row, idx) in data" :key="idx">
        <td><input type="checkbox" v-model="selected" :value="row.ID"/></td>
        <td class="products-list_item">{{ row.NAME }}</td>
        <td class="products-list_item">{{ row.PRICE_BASE }}</td>
        <td class="products-list_item">{{ row.PRICE_GRAU }}</td>
        <td class="products-list_item">{{ row.PRICE }}</td>
        <td class="products-list_item">{{ row.UNIT }}</td>
        <td class="products-list_item">{{ row.STOCK }}</td>
        <td class="products-list_item">{{ row.PRODUCT_NUMBER }}</td>
        <td class="products-list_item">{{ dateFormat(row.CREATED_AT) }}</td>
        <td class="products-list_item">
          <div class="products-option-list_item" @click="editProduct(row.ID)">
            <unicon name="edit-alt" fill="white" width="16" height="16"/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;clearProductInfo()">
      <input type="text" placeholder="name..." v-model="product.name"/>
      <input type="tel" placeholder="Price..." v-model="product.price"/>
      <input type="text" placeholder="Price base ..." v-model="product.priceBase"/>
      <input type="text" placeholder="Price gros..." v-model="product.priceGrau"/>
      <input type="text" placeholder="Unit..." v-model="product.unit"/>
      <input type="text" placeholder="Stock..." v-model="product.stock"/>
      <input type="text" placeholder="Product number..." v-model="product.productNumber"/>
      <button @click="modalType === 0 ? insertProduct(): saveEditProduct()">
        {{ modalType === 0 ? 'add' : 'save' }}
      </button>
    </Modal>
  </div>

</template>

<script>
import Modal from "../components/modal";

export default {
  name: "products",
  components: {Modal},
  data() {
    return {
      data: [{
        ID: 0,
        NAME: "dummy",
        PRICE: "none",
        PRICE_BASE: "none",
        PRICE_GRAU: "none",
        PRODUCT_NUMBER: "none",
        UNIT: "none",
        STOCK: "none",
        CREATED_AT: 'qsd'
      }],
      product: {
        id: 0,
        name: '',
        price: '',
        priceBase: '',
        priceGrau: '',
        productNumber: '',
        unit: '',
        stock: 0
      },
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.data = window.ipcRenderer.sendSync("get-products", null).sort((a, b) => b.ID - a.ID);
    },
    insertProduct() {
      const newProduct = window.ipcRenderer.sendSync('insert-product', JSON.stringify(this.product))[0];
      this.data.unshift(newProduct);
      this.isModalVisible = false;
      this.clearProductInfo();
    },
    selectAll() {
      this.selected = [];

      if (!this.allSelected) {
        this.data.map((product) => {
          this.selected.push(product.ID);
        });
      }
    },
    deleteProducts() {
      this.selected.map((productId) => {
        const response = window.ipcRenderer.sendSync('delete-product', productId);
        this.data = [...this.data.filter((product) => product.ID !== response)];
        this.selected = [...this.selected.filter((id) => id !== productId)];
      });
    },
    editProduct(id) {
      this.modalType = 1;
      this.isModalVisible = true;
      const product = this.data.filter((product) => product.ID === id)[0];
      this.product.id = product.ID;
      this.product.name = product.NAME;
      this.product.price = product.PRICE;
      this.product.priceBase = product.PRICE_BASE;
      this.product.priceGrau = product.PRICE_GRAU;
      this.product.productNumber = product.PRODUCT_NUMBER;
      this.product.unit = product.UNIT;
      this.product.stock = product.STOCK;
    },
    dateFormat(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`
    },
    saveEditProduct() {
      const response = window.ipcRenderer.sendSync('edit-product', JSON.stringify(this.product));
      if (response === 1) {
        this.data = [...this.data.map(product => this.product.id === product.ID
            ? {
              ID: this.product.id,
              NAME: this.product.name,
              PRICE: this.product.price,
              PRICE_BASE: this.product.priceBase,
              PRICE_GRAU: this.product.priceGrau,
              PRODUCT_NUMBER: this.product.productNumber,
              UNIT: this.product.unit,
              STOCK: this.product.stock,
              CREATED_AT: product.CREATED_AT
            }
            : product)];
      }
      this.isModalVisible = false;
      this.clearProductInfo();
    },
    clearProductInfo() {
      this.product.name = '';
      this.product.price = '';
      this.product.priceBase = '';
      this.product.priceGrau = '';
      this.product.productNumber = '';
      this.product.stock = '';
      this.product.unit = '';
      this.product.id = '';
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

}
.products-option-list .products-option-list_item{
  margin: 0 10px;
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
