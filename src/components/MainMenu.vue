<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <main-toolbar class="main-menu-toolbar"></main-toolbar>
    <el-menu :default-active="$route.path"
             router
             :default-openeds="['1','2','3']"
             :collapse="false"
    >
      <el-sub-menu index="1" v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <icon-menu/>
          </el-icon>
          文件管理
        </template>
        <el-menu-item index="/main/upload" >文件上传</el-menu-item>
        <el-menu-item index="/main/datasets">数据集列表</el-menu-item>
        <el-menu-item index="/main/models">模型列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu v-if="false" index="2"  v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <Setting/>
          </el-icon>
          配置管理
        </template>
        <el-menu-item index="/main/classifiers">待开发</el-menu-item>
      </el-sub-menu>
      <el-sub-menu v-if="false" index="3" v-show="isValid(['guest','manager'])">
        <template #title>
          <el-icon>
            <list/>
          </el-icon>
          任务管理
        </template>
        <el-menu-item index="/main/tasks">任务列表</el-menu-item>
        <el-menu-item index="/main/tasks/create"  v-show="isValid(['manager'])">任务创建</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4"  v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <odometer/>
          </el-icon>
          可解释性分析
        </template>
        <el-menu-item index="/main/dashboard">仪表盘</el-menu-item>
      </el-sub-menu>

    </el-menu>

  </el-aside>
</template>

<script setup>
import {Menu as IconMenu, Odometer, Setting,List} from '@element-plus/icons-vue'
import MainToolbar from "./MainToolbar";
import {isValid} from "../utils/valid";
</script>

<style scoped>
.main-menu-toolbar {
  border-bottom: 1px #e6e6e6 solid;
  /*background: #e2e2e2;*/
}
.el-menu-item {
  /*padding-left: 50px !important;*/
}
</style>
