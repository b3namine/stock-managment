<template>
<!--  <transition name="modal-fade">-->
<!--    <div class="modal-background">-->
<!--      <div class="modal-background"></div>-->
<!--      <div class="modal-container">-->
<!--        <div class="modal-close-btn" @click="close">-->
<!--          <unicon name="times" fill="black"/>-->
<!--        </div>-->
<!--        <div class="modal-content">-->
<!--          <slot></slot>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </transition>-->
  <el-dialog
      :title="title"
      :visible.sync="model"
      width="30%"
      :before-close="close">
    <slot></slot>
  </el-dialog>

</template>

<script>
export default {
  name: "Modal",
  props:['model','title'],
  methods:{
    close() {
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
.modal-hidden {
  display: none;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.42);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 50%;
  max-width: 500px;
  width: 100%;
  z-index: 5;
  background-color: white;
  padding: 15px;
  transform: translate(-50%, -50%);
  border-radius: 6px;
}

.modal-close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.modal-content {
  padding: 10px 0;
}
</style>
