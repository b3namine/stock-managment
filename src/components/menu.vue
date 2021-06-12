<template>
  <div class="menu">
    <router-link v-for="(item,key) in items" :key="key" :to="{ path: item.path }">
      <unicon :name="item.icon" fill="white"/>
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

.menu a div {
  padding: 10px 13px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.64);
  margin: 5px 2px;
}

.menu a.router-link-exact-active.router-link-active div {
  background-color: rgba(0, 0, 0, 1);
}

.menu a:hover div {
  background-color: rgba(0, 0, 0, 1);
}
</style>
