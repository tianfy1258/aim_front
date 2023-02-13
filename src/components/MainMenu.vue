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

      <el-sub-menu v-if="setVersionVisible(VERSION_MEASURE)" index="2" v-show="isValid(['guest','manager'])">
        <template #title>
          <el-icon>
            <list/>
          </el-icon>
          模型质量度量
        </template>
        <el-menu-item index="/main/modelTaskCreate">发起任务</el-menu-item>
        <el-menu-item index="/main/modelTaskList">任务查看</el-menu-item>
        <el-menu-item index="/main/modelTaskConfig" v-if="false">任务配置</el-menu-item>
      </el-sub-menu>

      <el-sub-menu v-if="setVersionVisible(VERSION_MEASURE)" index="3" v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <odometer/>
          </el-icon>
          数据质量度量
        </template>
        <el-menu-item index="/main/datasetTaskCreate">发起任务</el-menu-item>
        <el-menu-item index="/main/datasetTaskList">任务查看</el-menu-item>
        <el-menu-item index="/main/datasetTaskConfig" v-if="false">任务配置</el-menu-item>
      </el-sub-menu>

      <el-sub-menu v-if="setVersionVisible(VERSION_MEASURE)" index="4" v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <odometer/>
          </el-icon>
          模型分析
        </template>
        <el-menu-item index="/main/interpreter">可解释分析</el-menu-item>
      </el-sub-menu>

      <el-sub-menu v-if="setVersionVisible(VERSION_PLATFORM)" index="5" v-show="isValid(['manager'])">
        <template #title>
          <el-icon>
            <odometer/>
          </el-icon>
          模型分析
        </template>
        <el-menu-item index="/main/coverage">覆盖测试</el-menu-item>
        <el-menu-item index="/main/tensorSpace">可视化展示</el-menu-item>
      </el-sub-menu>


    </el-menu>
  </el-aside>
</template>

<script setup>
import {Menu as IconMenu, Odometer, Setting,List} from '@element-plus/icons-vue'
import MainToolbar from "./MainToolbar";
import {isValid} from "../utils/valid";
import {VERSION,VERSION_MEASURE,VERSION_PLATFORM,setVersionVisible} from "../utils/version"

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
