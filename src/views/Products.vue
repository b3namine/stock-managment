<template>

  <div class="products-container">
    <div class="products-option_items">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="isModalVisible = true"> Add product</el-button>
      </div>
      <div v-if="selected.length > 0">
        <el-button type="danger" icon="el-icon-delete" @click="deleteProducts">({{ selected.length }})</el-button>
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
          :filters="[{ text: '< 3', value: '3' }, { text: '< 5', value: '5' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          label="Stock">
      </el-table-column>
      <el-table-column
          min-width="150"
          prop="PRODUCT_NUMBER"
          label="Product number">
      </el-table-column>
      <el-table-column
          min-width="150"
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
    <Modal :model="isModalVisible"
           :title="modalType === 0 ? 'Add new product' : 'Edit product'"
           @close="closeModal">
      <div v-if="errors.length > 0">
        <div v-for="(error,key) in errors" :key="key">{{ error }}</div>
      </div>
      <el-form ref="product" :model="product" label-width="120px">
        <el-form-item label="Product name">
          <el-input v-model="product.NAME"></el-input>
        </el-form-item>
        <el-form-item label="Product price">
          <el-input v-model="product.PRICE"></el-input>
        </el-form-item>
        <el-form-item label="Product price base">
          <el-input v-model="product.PRICE_BASE"></el-input>
        </el-form-item>
        <el-form-item label="Product price grou">
          <el-input v-model="product.PRICE_GRAU"></el-input>
        </el-form-item>
        <el-form-item label="Product unit">
          <el-input v-model="product.UNIT"></el-input>
        </el-form-item>
        <el-form-item label="Product stock">
          <el-input v-model="product.STOCK"></el-input>
        </el-form-item>
        <el-form-item label="Product number">
          <el-input v-model="product.PRODUCT_NUMBER"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="modalType === 0 ? insertProduct(): saveEditProduct()">
            {{ modalType === 0 ? 'Add' : 'Save' }}
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
  name: "products",
  components: {Modal},
  data() {
    return {
      product: {
        NAME: '',
        PRICE: '',
        PRICE_GRAU: '',
        PRICE_BASE: '',
        STOCK: '',
        UNIT: '',
        PRODUCT_NUMBER: '',
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
    ...mapGetters(['products']),
    productSearch() {
      return this.products.filter(product => {
        return product.NAME.toLowerCase().includes(this.search.toLowerCase())
            || product.PRODUCT_NUMBER.toLowerCase().includes(this.search.toLowerCase());
      })
    },
  },
  methods: {
    filterTag(value, row) {
      return row.STOCK < value;
    },
    closeModal() {
      this.modalType = 0;
      this.isModalVisible = false;
      this.product = {}
    },
    handleSelectionChange(selected) {
      this.selected = selected.map((select) => select.ID);
    },
    insertProduct() {
      if (!this.checkForm()) {
        return;
      }
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
      if (!this.checkForm()) {
        return;
      }
      this.$store.dispatch('EDIT_PRODUCT', this.product);
      this.isModalVisible = false;
      this.product = {};
    },
    checkForm() {
      this.errors = [];
      const requireText = {
        NAME: 'Name field empty',
        PRICE: 'Price field empty',
        PRICE_GRAU: 'Price grou field empty',
        PRICE_BASE: 'Price base field empty',
        STOCK: 'Stock field empty',
        UNIT: 'Unit field empty',
        PRODUCT_NUMBER: 'Product number field empty',
      }
      if (!this.product.NAME || !this.product.PRICE || !this.product.PRICE_GRAU
          || this.product.PRICE_BASE || !this.product.STOCK || !this.product.PRODUCT_NUMBER) {
        const keys = Object.keys(this.product).filter((key) => this.product[key] === '');
        this.errors = keys.map((require) => requireText[require]);
      }
      return !this.errors.length > 0;
    }
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px 0;
  width: calc(100% - 90px);
}

.products-option_items {
  display: flex;
}

.products-option_items,
.products-list_item {
  text-align: center;
  align-items: center;
  align-content: center;
}

.products-option_items > div {
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
