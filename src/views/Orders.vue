<template>
  <div class="orders-container">
    <div class="orders-option-list">
      <div class="orders-option-list_item" @click="isModalVisible = true">
        <unicon name="plus" fill="white"/>
      </div>
      <div :class="selected.length === 0?'orders-option-list_item button_disabled' : 'orders-option-list_item'"
           @click="deleteOrders">
        <unicon name="trash-alt" fill="white" width="16" height="20"/>
        ({{ selected.length }})
      </div>
      <div class="orders-option-list_input">
        <unicon name="search" fill="black" width="16" height="16"/>
        <input type="text" v-model="search" placeholder="Search..."/>
      </div>
    </div>
    <table class="orders">
      <thead>
      <tr class="orders-header">
        <th><input type="checkbox" @click="selectAll" v-model="allSelected"/></th>
        <th>Product name</th>
        <th>Client name</th>
        <th>Count</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      </thead>
      <tbody>
      <tr class="orders-list" v-for="(row, idx) in orderSearch" :key="idx">
        <td><input type="checkbox" v-model="selected" :value="row.ID"/></td>
        <td class="orders-list_item">{{ row.PRODUCT.NAME }}</td>
        <td class="orders-list_item">{{ row.CLIENT.NAME }}</td>
        <td class="orders-list_item">{{ row.COUNT }}</td>
        <td class="orders-list_item">{{ row.CREATED_AT }}</td>
        <td class="orders-list_item">
          <div class="orders-option-list_item" @click="editOrder(row.ID)">
            <unicon name="edit-alt" fill="white" width="16" height="16"/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;order = {}">
      <select v-model="order.CLIENT_ID">
        <option v-for="(client ,key) in clients"
                :key="key"
                :value="client.ID"
                :selected=" client.ID === order.CLIENT_ID">
          {{ client.NAME }}
        </option>
      </select>
      <input type="number" placeholder="Product id..." v-model="order.PRODUCT_ID"/>
      <button @click="modalType === 0 ? insertOrder(): saveEditOrder()">
        {{ modalType === 0 ? 'add' : 'save' }}
      </button>
    </Modal>
  </div>

</template>

<script>
import Modal from "../components/modal";
import {mapGetters} from "vuex";

export default {
  name: "orders",
  components: {Modal},
  data() {
    return {
      order: {},
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
      search: '',
    };
  },
  computed: {
    ...mapGetters(['orders', 'clients']),
    orderSearch() {
      return this.orders.filter(order => {
        return order.CLIENT.NAME.toLowerCase().includes(this.search.toLowerCase())
            || order.PRODUCT.NAME.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  },
  methods: {
    insertOrder() {
      this.$store.dispatch('NEW_ORDER', this.order);
      this.isModalVisible = false;
      this.order = {};
    },
    selectAll() {
      this.selected = [];
      if (!this.allSelected) {
        this.orders.map((product) => {
          this.selected.push(product.ID);
        });
      }
    },
    deleteOrders() {
      this.$store.dispatch('DELETE_ORDER', this.selected);
      this.selected = [];
    },
    editOrder(id) {
      this.modalType = 1;
      this.isModalVisible = true;
      const order = this.orders.filter((order) => order.ID === id)[0];
      this.order.ID = order.ID;
      this.order.CLIENT_ID = order.CLIENT.ID;
      this.order.PRODUCT_ID = order.PRODUCT.ID;
    },
    saveEditOrder() {
      this.$store.dispatch('EDIT_ORDER', this.order);
      this.isModalVisible = false;
      this.order = {};
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
  align-items: center;
  align-content: center;

}

.orders-option-list .orders-option-list_item {
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

.orders-option-list_input {
  width: fit-content;
  align-content: center;
  align-items: center;
  font-size: 16px;
  display: flex;
  border: 1px solid black;
  line-height: 11px;
  border-radius: 6px;
}

.orders-option-list_input .unicon {
  margin: 0 5px;
}

.orders-option-list_input input {
  padding: 13px 0;
  outline: none;
  border: none;
  margin-right: 5px;
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
