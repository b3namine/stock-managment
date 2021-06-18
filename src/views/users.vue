<template>
  <div class="users-container">
    <div class="users-option-list">
      <div class="users-option-list_item" @click="isModalVisible = true">
        <unicon name="user-plus" fill="white"/>
      </div>
      <div :class="selected.length === 0?'users-option-list_item button_disabled' : 'users-option-list_item'"
           @click="deleteUsers">
        <unicon name="trash-alt" fill="white" width="16" height="20"/>
        ({{ selected.length }})
      </div>
      <div class="users-option-list_input">
        <unicon name="search" fill="black" width="16" height="16"/>
        <input type="text" v-model="search" placeholder="Search..."/>
      </div>
    </div>

    <table class="users">
      <thead>
      <tr class="products-header">
        <th><input type="checkbox" @click="selectAll" v-model="allSelected"/></th>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Birthday</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      </thead>
      <tbody>
      <tr class="users-list" v-for="(row, idx) in userSearch" :key="idx">
        <td><input type="checkbox" v-model="selected" :value="row.ID"/></td>
        <td class="users-list_item">{{ row.NAME }}</td>
        <td class="users-list_item">{{ row.PHONE }}</td>
        <td class="users-list_item">{{ row.EMAIL }}</td>
        <td class="users-list_item">{{ row.BIRTHDAY }}</td>
        <td class="users-list_item">{{ row.CREATED_AT }}</td>
        <td class="users-list_item">
          <div class="users-option-list_item" @click="editClient(row.ID)">
            <unicon name="edit-alt" fill="white" width="16" height="16"/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <Modal v-show="isModalVisible" @close="modalType = 0; isModalVisible = false;client = {}">
      <input type="text" placeholder="name..." v-model="client.NAME"/>
      <input type="tel" placeholder="phone..." v-model="client.PHONE"/>
      <input type="email" placeholder="email..." v-model="client.EMAIL"/>
      <input type="date" placeholder="birthday..." v-model="client.BIRTHDAY"/>
      <button @click="modalType === 0 ? insertUser(): saveEditClient()">
        {{ modalType === 0 ? 'add' : 'save' }}
      </button>
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
    insertUser() {
      this.$store.dispatch('NEW_CLIENT', this.client);
      this.isModalVisible = false;
      this.client = {};
    },
    selectAll() {
      this.selected = [];
      if (!this.allSelected) {
        this.clients.map((client) => {
          this.selected.push(client.ID);
        });
      }
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

.users-option-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
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
