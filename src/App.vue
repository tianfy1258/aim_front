<script setup>

import {reactive} from "vue";
import {useStore} from './pinia'

let VUE_STORE = JSON.parse(localStorage.getItem("VUE_STORE"));
if (VUE_STORE) {
  VUE_STORE = reactive(VUE_STORE);
} else {
  VUE_STORE = reactive({});
}
const store = useStore();
store.$state = VUE_STORE;
// 每当它发生变化时，将整个状态持久化到本地存储
window.addEventListener("beforeunload", () => {
  localStorage.setItem("VUE_STORE", JSON.stringify(store.$state))
})
</script>

<template>
  <router-view></router-view>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;

}

body {
  margin: 0;
  padding: 0;
  /*border: 1px solid red;*/
  overflow-y: overlay;

}

</style>
