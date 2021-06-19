<template>
  <div class="menu">
    <router-link v-for="(item,key) in items" :key="key" :to="{ path: item.path }" tag="div">
      <el-button :icon="item.icon" circle></el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: ['items']
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.menu div {
  margin: 5px 2px;
}

.menu div.router-link-exact-active.router-link-active button.el-button--default {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #FFF;
}

</style>
