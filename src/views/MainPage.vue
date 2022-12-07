<template>
  <el-container class="layout-container-demo">
    <main-menu></main-menu>
    <el-container>
      <el-main class="el-main">
        <div class="el-main-content">
          <el-scrollbar ref="scrollbarRef" max-height="94vh" always>
            <bread-navigation></bread-navigation>
            <router-view v-slot="{ Component }" style="flex-grow: 1">
              <!--            <component :is="Component"/>-->
              <transition
                  appear
                  enter-active-class="inAnim"
                  leave-active-class="outAnim"
                  mode="out-in"
              >
                <keep-alive :include="['interpreter','coverage','tensorspace']">
                  <component :is="Component"/>
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import MainMenu from "../components/MainMenu.vue";
import BreadNavigation from "../components/BreadNavigation";
import {useRoute} from 'vue-router'
import {ref, watch} from 'vue';

// const includeList = ref([]);
// const route = useRoute();
// watch(() => route, (newVal, oldVal) => {
//   if (newVal.meta.keepAlive && includeList.value.indexOf(newVal.name) === -1) {
//     includeList.value.push(newVal.name);
//   }
//   console.log(includeList.value);
// }, {deep: true});


</script>


<style scoped>
.layout-container-demo {
  height: 100vh;
  width: 100vw;

  /*overflow: hidden;*/

}

.layout-container-demo .el-header {
  position: relative;
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  width: 240px;
  color: var(--el-text-color-primary);
  background: #fff !important;
  border-right: solid 1px #e6e6e6;
  box-sizing: border-box;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
  height: 100%;
}

.layout-container-demo .toolbar {
  position: absolute;
  /*border:1px solid red;*/
  display: flex;
  align-items: center;
  width: 100px;
  padding-right: 20px;
  justify-content: center;
  height: inherit;
  right: 0;
}

.layout-container-demo .el-main {
  padding: 7px;
  /*overflow: hidden;*/
  /*important overflow hidden config*/
  background: #f6f8f9;
}

.layout-container-demo .el-main-content {
  background: #fff;
  /*background: #c40808;*/
  padding: 20px;
  display: flex;
  min-height: 94vh;
  flex-direction: column;
}

/*隐藏横向滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.inAnim {
  animation: fadeIn;
  animation-duration: 0.2s;
}

.outAnim {
  animation: fadeOut;
  animation-duration: 0.1s;
}

</style>
