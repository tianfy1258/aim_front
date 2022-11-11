<template>
  <div>
    <div class="flex-container">
      <el-button id="prevButton" @click="backToIndexZero">重新选择上传类型</el-button>
      <el-steps :active="active_index" class="flex-item" align-center finish-status="success" style="margin-bottom: 50px;margin-top: 20px;">
        <el-step title="选择上传类型"/>
        <el-step title="上传文件"/>
        <el-step title="填写信息"/>
      </el-steps>
      <div style="flex-basis: 15%;flex-grow: 0"></div>
    </div>
    <keep-alive>
      <upload-select-page v-if="active_index === 0" @finish="handleProcessPlus"></upload-select-page>
      <UploadDatasetPage @finish="handleProcessPlus"
                         v-else-if="active_index === 1 && uploadType === 'dataset'"></UploadDatasetPage>
      <UploadModelPage @finish="handleProcessPlus"
                       v-else-if="active_index === 1 && uploadType === 'model'"></UploadModelPage>
      <upload-dataset-process-page :response="response" @finish="handleProcessPlus"
                           v-else-if="active_index === 2 && uploadType === 'dataset'"></upload-dataset-process-page>
      <upload-model-process-page :response="response" @finish="handleProcessPlus" @prev="handleProcessMinor"
                                   v-else-if="active_index === 2 && uploadType === 'model'"></upload-model-process-page>
      <upload-dataset-finish-page v-else-if="active_index ===3 && uploadType === 'dataset'"></upload-dataset-finish-page>
      <upload-model-finish-page v-else-if="active_index ===3 && uploadType === 'model'"></upload-model-finish-page>
    </keep-alive>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, computed} from "vue";
import UploadDatasetPage from "./UploadDatasetPage.vue";
import UploadDatasetProcessPage from "./UploadDatasetProcessPage.vue";
import UploadModelProcessPage from "./UploadModelProcessPage.vue";
import UploadModelPage from "./UploadModelPage.vue";
import UploadSelectPage from "./UploadSelectPage";
import UploadDatasetFinishPage from "./UploadDatasetFinishPage.vue";
import UploadModelFinishPage from "./UploadModelFinishPage.vue";
const { proxy } = getCurrentInstance()

let active_index = ref(0);
let response = ref(null);
let uploadType = ref("");
// const allType = computed(() => !uploadType.value);
const handleProcessPlus = (res) => {
  active_index.value++;
  response.value = res;
  if (res === 'dataset' || res === 'model') {
    uploadType.value = res;
  }
}
const handleProcessMinor = (res) => {
  active_index.value--;
  response.value = res;
}
const backToIndexZero = () => {
  active_index.value = 0;
  response.value = null;
  proxy.$unFocus();
  uploadType.value = "";
}
</script>


<style>
.document {
  /*border: 1px solid #f13232*/
}
.upload-demo {
  width: 300px;
}
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /*border: 1px solid #f13232;*/

}
.flex-item {
  flex-basis: 70%;
  /*border: 1px solid #f13232;*/
  padding: 0 !important;
  margin: 20px 0 40px !important;

}
#prevButton {
  /*border: 1px solid #f13232;*/
  margin: 20px 0 40px auto;
  width: 200px;

}
</style>
