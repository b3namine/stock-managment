<template>
  <div class="orders-container">
    <div class="orders-option_items">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="isModalVisible = true;errors = [];"> Add order</el-button>
      </div>
      <div v-if="selected.length > 0">
        <el-button type="danger" icon="el-icon-delete" @click="deleteOrders">({{ selected.length }})</el-button>
      </div>
      <div>
        <el-input
            placeholder="Search..."
            prefix-icon="el-icon-search"
            v-model="search">
        </el-input>
      </div>
    </div>
    <el-table
        :data="orderSearch"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="CREATED_AT"
          label="Date">
      </el-table-column>
      <el-table-column
          prop="PRODUCT.NAME"
          label="Product name">
      </el-table-column>
      <el-table-column
          prop="CLIENT.NAME"
          label="Client name">
      </el-table-column>
      <el-table-column
          prop="COUNT"
          label="Count">
      </el-table-column>

      <el-table-column
          fixed="right"
          label="Operations">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="editOrder(scope.row.ID,orderSearch)"
              type="text"
              size="small">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;order = {}">
      <div v-if="errors.length > 0">
        <div v-for="(error,key) in errors" :key="key">{{ error }}</div>
      </div>
      <select v-model="order.CLIENT_ID">
        <option v-for="(client ,key) in clients"
                :key="key"
                :value="client.ID"
                :selected=" client.ID === order.CLIENT_ID">
          {{ client.NAME }}
        </option>
      </select>
      <input type="number" placeholder="Product id..." v-model="order.PRODUCT_ID"/>
      <input type="number" placeholder="Count..." v-model="order.COUNT"/>
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
      order: {
        PRODUCT_ID: '',
        CLIENT_ID: '',
        COUNT: ''
      },
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
      search: '',
      errors: []
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
    handleSelectionChange(selected) {
      this.selected = selected.map((select)=> select.ID);
    },
    insertOrder() {
      if (!this.checkForm()) {
        return;
      }
      this.$store.dispatch('NEW_ORDER', this.order);
      this.isModalVisible = false;
      this.order = {};
    },
    deleteOrders() {
      this.$store.dispatch('DELETE_ORDER', this.selected);
      this.selected = [];
    },
    editOrder(id) {
      console.log(id);
      this.modalType = 1;
      this.isModalVisible = true;
      this.errors = [];
      const order = this.orders.filter((order) => order.ID === id)[0];
      this.order.ID = order.ID;
      this.order.CLIENT_ID = order.CLIENT.ID;
      this.order.PRODUCT_ID = order.PRODUCT.ID;
      this.order.COUNT = order.COUNT;
    },
    saveEditOrder() {
      if (!this.checkForm()) {
        return;
      }
      this.$store.dispatch('EDIT_ORDER', this.order);
      this.isModalVisible = false;
      this.order = {};
    },
    checkForm() {
      this.errors = [];
      const requireText = {
        PRODUCT_ID: 'Product id field required',
        CLIENT_ID: 'Client id field required',
        COUNT: 'Count field required'
      }
      if (!this.order.CLIENT_ID || !this.order.PRODUCT_ID || !this.order.COUNT) {
        const keys = Object.keys(this.order).filter((key) => this.order[key] === '');
        this.errors = keys.map((require) => requireText[require]);
      }
      return !this.errors.length > 0;
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


.orders-option_items,
.orders-option-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;

}

.orders-option_items div {
  margin-right: 10px;
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
