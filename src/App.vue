<template>
  <div id="app">
    <Menu :items="menu"/>
    <router-view/>
  </div>
</template>

<script>
import Menu from './components/menu';
import {menuItems} from './services/menu';
export default {
  components: {
    Menu
  },
  data(){
    return{
      menu: menuItems
    }
  },
  created() {

  }
};
</script>
<style scoped>
#app {
  display: flex;
  flex-direction: row;
}
</style>
