<template>
  <div class="products-container">
    <div class="products-option_items">
      <div><el-button type="primary" icon="el-icon-plus"  @click="isModalVisible = true"> Add product</el-button></div>
      <div v-if="selected.length > 0"><el-button type="danger" icon="el-icon-delete" @click="deleteProducts">({{ selected.length }})</el-button></div>
      <div><el-input
          placeholder="Search..."
          prefix-icon="el-icon-search"
          v-model="search">
      </el-input></div>
    </div>

    <el-table
        :data="productSearch"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="NAME"
          label="Name">
      </el-table-column>
      <el-table-column
          prop="PRICE_BASE"
          label="Price base">
      </el-table-column>
      <el-table-column
          prop="PRICE_GRAU"
          label="Price grou">
      </el-table-column>
      <el-table-column
          prop="PRICE"
          label="Price">
      </el-table-column>
      <el-table-column
          prop="UNIT"
          label="Unit">
      </el-table-column>
      <el-table-column
          prop="STOCK"
          label="Stock">
      </el-table-column>
      <el-table-column
          prop="PRODUCT_NUMBER"
          label="Product number">
      </el-table-column>
      <el-table-column
          prop="CREATED_AT"
          label="Date">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="Operations">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="editProduct(scope.row.ID,productSearch)"
              type="text"
              size="small">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;product = {}">
      <div class="products-option-list_input">
        <input type="text" v-model="product.NAME" placeholder="name..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.PRICE" placeholder="Price..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.PRICE_BASE" placeholder="Price base..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.PRICE_GRAU" placeholder="Price gros..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.UNIT" placeholder="Unit..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.STOCK" placeholder="Stock..."/>
      </div>
      <div class="products-option-list_input">
        <input type="text" v-model="product.PRODUCT_NUMBER" placeholder="Product number..."/>
      </div>
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
    handleSelectionChange(selected) {
      this.selected = selected.map((select)=> select.ID);
    },
    insertProduct() {
      this.$store.dispatch('NEW_PRODUCT', this.product);
      this.isModalVisible = false;
      this.product = {};
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
.products-option_items{
  display: flex;
}
.products-option_items,
.products-list_item {
  text-align: center;
  align-items: center;
  align-content: center;
}
.products-option_items > div{
  margin-right: 10px;
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
  padding: 13px 0px;
  outline: none;
  border: none;
  margin: 0 5px;
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
