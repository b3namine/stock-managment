<template>
  <div class="users-container">
    <div class="users-option_items">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="isModalVisible = true"> Add user</el-button>
      </div>
      <div v-if="selected.length > 0">
        <el-button type="danger" icon="el-icon-delete" @click="deleteUsers">({{ selected.length }})</el-button>
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
        :data="userSearch"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="NAME"
          min-width="100"
          label="Name">
      </el-table-column>
      <el-table-column
          prop="PHONE"
          min-width="100"
          label="Phone">
      </el-table-column>
      <el-table-column
          prop="EMAIL"
          min-width="110"
          label="Email">
      </el-table-column>
      <el-table-column
          prop="BIRTHDAY"
          min-width="100"
          label="Birthday">
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
              @click.native.prevent="editClient(scope.row.ID,userSearch)"
              type="text"
              size="small">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Modal :model="isModalVisible" :title="modalType === 0 ? 'Add new user' : 'Edit user'" @close="closeModal">
      <el-form ref="client" :model="client" label-width="120px">
        <el-form-item label="Client name">
          <el-input v-model="client.NAME"></el-input>
        </el-form-item>
        <el-form-item label="Client phone">
          <el-input v-model="client.PHONE"></el-input>
        </el-form-item>
        <el-form-item label="Client email">
          <el-input v-model="client.EMAIL"></el-input>
        </el-form-item>
        <el-form-item label="Client birthday">
          <el-input v-model="client.BIRTHDAY"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modalType === 0 ? insertUser(): saveEditClient()">
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
  name: "users",
  components: {Modal},
  data() {
    return {
      client: {},
      allSelected: false,
      selected: [],
      isModalVisible: false,
      modalType: 0,
      search: ''
    };
  },
  computed: {
    ...mapGetters(['clients']),
    userSearch() {
      return this.clients.filter(user => {
        return user.NAME.toLowerCase().includes(this.search.toLowerCase())
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
      this.client = {}
    },
    insertUser() {
      this.$store.dispatch('NEW_CLIENT', this.client);
      this.isModalVisible = false;
      this.client = {};
    },
    deleteUsers() {
      this.$store.dispatch('DELETE_CLIENT', this.selected);
      this.selected = [];
    },
    editClient(id) {
      this.modalType = 1;
      this.isModalVisible = true;
      const client = this.clients.filter((client) => client.ID === id)[0];
      Object.keys(client).map(key => this.client[key] = client[key]);
    },
    saveEditClient() {
      this.$store.dispatch('EDIT_CLIENT', this.client);
      this.isModalVisible = false;
      this.client = {};
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 20px 0;
  width: calc(100% - 90px);
}

.users-list_item {
  text-align: center;
  align-items: center;
  align-content: center;
}

.users {
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

.users thead tr {
  background-color: #000;
  color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.users th,
.users td {
  padding: 12px 15px;
}

.users tbody tr {
  border-bottom: 1px solid #dddddd;
}

.users tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.users tbody tr:last-of-type {
  border-bottom: 2px solid #000;
}

.users tbody tr.active-row {
  font-weight: bold;
  color: #000;
}

.users-option_items,
.users-option-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.users-option_items div {
  margin-right: 10px;
}

.users-option-list .users-option-list_item {
  margin: 0 10px;
}

.users-option-list_item {
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

.users-option-list_input {
  width: fit-content;
  align-content: center;
  align-items: center;
  font-size: 16px;
  display: flex;
  border: 1px solid black;
  line-height: 11px;
  border-radius: 6px;
}

.users-option-list_input .unicon {
  margin: 0 5px;
}

.users-option-list_input input {
  padding: 13px 0;
  outline: none;
  border: none;
  margin-right: 5px;
}

.users-option-list_item:hover {
  background-color: rgba(0, 0, 0, 0.64);
}

.users-option-list_item:active {
  background-color: rgba(0, 0, 0, 0.84);
  transform: scale(0.96);
}

.users-option-list_item.button_disabled {
  display: none;
}
</style>
