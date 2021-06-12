<template>
  <div class="orders-container">
    <div class="orders-option-list">
      <div class="orders-option-list_item" @click="isModalVisible = true">
        <unicon name="user-plus" fill="white"/>
      </div>
      <div :class="selected.length === 0?'orders-option-list_item button_disabled' : 'orders-option-list_item'"
           @click="deleteOrders">
        <unicon name="trash-alt" fill="white" width="16" height="20"/>
        ({{ selected.length }})
      </div>
    </div>
    <table class="orders">
      <thead>
      <tr class="orders-header">
        <th><input type="checkbox" @click="selectAll" v-model="allSelected"/></th>
        <th>Name</th>
        <th>prix de base</th>
        <th>prix de gros</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      </thead>
      <tbody>
      <tr class="orders-list" v-for="(row, idx) in data" :key="idx">
        <td><input type="checkbox" v-model="selected" :value="row.ID"/></td>
        <td class="orders-list_item">{{ JSON.stringify(row.CLIENT) }}</td>
        <td class="orders-list_item">{{ JSON.stringify(row.PRODUCT) }}</td>
        <td class="orders-list_item">{{ row.COUNT }}</td>
        <td class="orders-list_item">{{ dateFormat(row.CREATED_AT) }}</td>
        <td class="orders-list_item">
          <div class="orders-option-list_item" @click="editOrder(row.ID)">
            <unicon name="edit-alt" fill="white" width="16" height="16"/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;clearOrderInfo()">
      <input type="text" placeholder="name..." v-model="order.clientId"/>
      <input type="tel" placeholder="Price..." v-model="order.productId"/>
      <button @click="modalType === 0 ? insertOrder(): saveEditOrder()">
        {{ modalType === 0 ? 'add' : 'save' }}
      </button>
    </Modal>
  </div>

</template>

<script>
import Modal from "../components/modal";

export default {
  name: "orders",
  components: {Modal},
  data() {
    return {
      data: [{
        ID: 0,
        CLIENT: {},
        PRODUCT: {},
        COUNT: 0,
        CREATED_AT: 'qsd'
      }],
      order: {
        id: 0,
        productId: '',
        clientId: '',
        count: 0,
      },
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
    };
  },
  mounted() {
    this.getOrderData();
  },
  methods: {
    getOrderData() {
      this.data = window.ipcRenderer.sendSync("get-orders", null).sort((a, b) => b.ID - a.ID);
    },
    insertOrder() {
      const newOrder = window.ipcRenderer.sendSync('insert-order', JSON.stringify(this.order))[0];
      this.data.unshift(newOrder);
      this.isModalVisible = false;
      this.clearOrderInfo();
    },
    selectAll() {
      this.selected = [];
      if (!this.allSelected) {
        this.data.map((product) => {
          this.selected.push(product.ID);
        });
      }
    },
    deleteOrders() {
      this.selected.map((productId) => {
        const response = window.ipcRenderer.sendSync('delete-order', productId);
        this.data = [...this.data.filter((product) => product.ID !== response)];
        this.selected = [...this.selected.filter((id) => id !== productId)];
      });
    },
    editOrder(id) {
      this.modalType = 1;
      this.isModalVisible = true;
      const order = this.data.filter((order) => order.ID === id)[0];
      this.order.id = order.ID;
      this.order.clientId = order.CLIENT_ID;
      this.order.productId = order.PRODUCT_ID;
      this.order.count = order.COUNT;
    },
    dateFormat(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`
    },
    saveEditOrder() {
      const response = window.ipcRenderer.sendSync('edit-order', JSON.stringify(this.order));
      if (response === 1) {
        this.data = [...this.data.map(order => this.order.id === order.ID
            ? {
              ID: this.order.id,
              CLIENT_ID: this.order.name,
              PRODUCT_ID: this.order.price,
              CREATED_AT: order.CREATED_AT
            }
            : order)];
      }
      this.isModalVisible = false;
      this.clearOrderInfo();
    },
    clearOrderInfo() {
      this.order.count = '';
      this.order.productId = '';
      this.order.clientId = '';
      this.order.id = '';
    }

  }
}
</script>

<style scoped>
.orders-container {
  padding: 20px 0;
  width: calc(100% - 90px);
}

.orders-list_item {
  text-align: center;
  align-items: center;
  align-content: center;
}


.orders {
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

.orders thead tr {
  background-color: #000;
  color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.orders th,
.orders td {
  padding: 12px 15px;
}

.orders tbody tr {
  border-bottom: 1px solid #dddddd;
}

.orders tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.orders tbody tr:last-of-type {
  border-bottom: 2px solid #000;
}

.orders tbody tr.active-row {
  font-weight: bold;
  color: #000;
}

.orders-option-list {
  display: flex;
  flex-direction: row;

}
.orders-option-list .orders-option-list_item{
  margin: 0 10px;
}

.orders-option-list_item {
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

.orders-option-list_item:hover {
  background-color: rgba(0, 0, 0, 0.64);
}

.orders-option-list_item:active {
  background-color: rgba(0, 0, 0, 0.84);
  transform: scale(0.96);
}

.orders-option-list_item.button_disabled {
  display: none;
}
</style>
