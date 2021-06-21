<template>
  <div class="orders-container">
    <div class="orders-option_items">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="isModalVisible = true"> Add order</el-button>
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
          label="Date"
          min-width="150">
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
    <Modal :model="isModalVisible" :title="modalType === 0 ? 'Add new order' : 'Edit order'" @close="closeModal">
      <el-form :rules="rules" ref="order" :model="order" label-width="120px">
        <el-form-item label="Product number" prop="PRODUCT_ID">
          <el-input type="number" v-model="order.PRODUCT_ID"></el-input>
        </el-form-item>
        <el-form-item label="Client" prop="CLIENT_ID">
          <el-select v-model="order.CLIENT_ID" placeholder="select user">
            <el-option v-for="(client ,key) in clients"
                       :key="key"
                       :value="client.ID"
                       :label="client.NAME"
                       :selected=" client.ID === order.CLIENT_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Count" prop="COUNT">
          <el-input v-model="order.COUNT"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modalType === 0 ? insertOrder(): saveEditOrder()">{{
              modalType === 0 ? 'Add' : 'Save'
            }}
          </el-button>
          <el-button @click="closeModal">Cancel</el-button>
        </el-form-item>
      </el-form>
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
        PRODUCT_ID: 0,
        CLIENT_ID: 0,
        COUNT: 0
      },
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
      search: '',
      rules: {
        PRODUCT_ID: [
          {required: true, message: 'Please input Product name'},
          {type: 'number', message: 'Count must be a number'}
        ],
        CLIENT_ID: [
          {required: true, message: 'Please select client'},
          {type: 'number', message: 'Count must be a number'}
        ],
        COUNT: [
          {required: true, message: 'Count is required'},
          {type: 'number', message: 'Count must be a number'}
        ],
      }
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
      this.selected = selected.map((select) => select.ID);
    },
    closeModal() {
      this.modalType = 0;
      this.isModalVisible = false;
      this.$refs['order'].resetFields();
    },
    insertOrder() {
      this.$refs['order'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('NEW_ORDER', this.order);
          this.isModalVisible = false;
          this.$refs['order'].resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
      this.order.COUNT = order.COUNT;
    },
    saveEditOrder() {
      this.$refs['order'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('EDIT_ORDER', this.order);
          this.isModalVisible = false;
          this.$refs['order'].resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
