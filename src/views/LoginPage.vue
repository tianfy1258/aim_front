<template>
  <el-tabs id="loginTabs" v-loading="isLoading" @tab-click="tabClick" type="border-card" :class="{'login-tab':true, 'user':!isManager,'manager':isManager}" :stretch="true">
    <el-tab-pane label="Config" v-if="false">
      <template #label> 用户入口</template>
      <login-form @is-loading="changeLoading" class="login-form" :is-manager="isManager"></login-form>
    </el-tab-pane>
    <el-tab-pane >
      <template #label> 管理员入口</template>
      <login-form @is-loading="changeLoading" class="login-form" :is-manager="isManager"></login-form>
    </el-tab-pane>
  </el-tabs>
<!--  <div class="welcome-text">UAS环境感知模型可解释性测试</div>-->
  <div class="welcome-text2">AI应用基础平台</div>
</template>

<script lang="ts" setup>
import LoginForm from "../components/LoginForm.vue";
import {ref} from "vue";

let isManager = ref(true);
const tabClick = (pane, ev) => {
  isManager.value = pane.index === '1';
};
let isLoading = ref(false);
const changeLoading = (value) => {
  isLoading.value = value;
}
</script>
<style>
@import "../border.css";

body {
  background-image: url("open.jpg");
}
.user{
  background-image: linear-gradient(-80deg, #f6faff 10%, #ffffff 90%);
}
.manager{
  background-image: linear-gradient(80deg ,  #f6faff 10%, #ffffff 90%);
}
.login-tab {
  position: absolute;
  width: 530px;
  height: 460px;
  left: 58vw;
  top: 20vh;
}

.login-tab .el-tabs__item {
  height: 60px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.welcome-text {
  position: absolute;
  width: 880px;
  height: 460px;
  left: 8vw;
  text-align: left;
  color: #5a5a5a;
  font-size: 3em;
  top: 35vh;
  font-weight: 500;
  -webkit-text-stroke-color: #1d1d1d;
  -webkit-text-stroke-width: 1px;
  letter-spacing:9px;
}
.welcome-text2 {
  position: absolute;
  width: 660px;
  height: 460px;
  left: 19vw;
  text-align: left;
  color: #5a5a5a;
  font-size: 3em;
  top: 35vh;
  font-weight: 500;
  -webkit-text-stroke-color: #1d1d1d;
  -webkit-text-stroke-width: 1px;
  letter-spacing:9px;
}
#loginTabs .el-tabs__item:hover {
  background-color: #edf7fe;
}
#loginTabs .el-tabs__item.is-active {
  background-color: #ffffff;
}
#loginTabs .el-tabs__item {
  background-color: #efefef;
  position: relative;
  width: 90%;
}
/*#loginTabs .el-tabs__item.is-active:after {*/
/*  content: '';*/
/*  position: absolute;*/
/*  left: 65px;*/
/*  top: auto;*/
/*  bottom: 6px;*/
/*  right: auto;*/
/*  height: 2px;*/
/*  width: 130px;*/
/*  background-color: rgba(64, 158, 255, 0.75);*/
/*}*/
#loginTabs .el-tabs__item.is-active:after {
  content: '';
  position: absolute;
  left: 65px;
  top: auto;
  bottom: 6px;
  right: auto;
  height: 2px;
  width: 390px;
  background-color: rgba(64, 158, 255, 0.75);
}
</style>
