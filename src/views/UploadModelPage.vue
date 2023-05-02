<template>
  <div
      style="display:flex;flex-direction: column;align-items: center;justify-content: space-between;height: 320px;">
    <el-upload
        :disabled="isLoading"
        ref="upload"
        class="upload-demo"
        drag
        :data="{'token':uploadToken}"
        :action="BASE_URL + 'upload'"
        multiple
        :auto-upload="false"
        accept=".pt,.py,.txt"
        :file-list="fileList"
        :before-upload="handleBeforeUpload"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :on-remove="handleChange"
        :on-success="handleSuccessUpload"
        :on-error="handleErrorUpload"
        :limit="fileCountLimit"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        将文件拖至此处 或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <span>
            上传 pt / py / txt 文件
          </span>
          <!--          <el-button type="text" style="font-size: 12px;margin-bottom: 1px;">上传帮助</el-button>-->
        </div>
      </template>
    </el-upload>
    <el-button type="success" @click="submitUpload" style="width: 150px;">
      确认上传
    </el-button>
  </div>
  <el-divider style="width: 60%;margin-top: 40px;"></el-divider>
  <div style="display: flex;width: 100%">
    <div style="text-align: left;padding: 0 30px;">
      <vue-component></vue-component>
    </div>
  </div>
</template>

<script setup>
import {UploadFilled} from '@element-plus/icons-vue'
import {ref} from "vue";
import {BASE_URL, request} from "../network/request";
import {ElMessage} from "element-plus";
import {VueComponent} from '@/document/upload_model_description.md'
import {validToken} from "../network/validToken.js";

const emit = defineEmits(["finish"]);
let uploadToken = ref("");
const upload = ref(null);
const fileList = ref([])
const fileCountLimit = 3;
let fileCountCurrent = 0;
const handleExceed = (files) => {
  ElMessage({
    message: "文件超过3个，重新选择文件",
    grouping: true,
    type: 'info',
  })
  upload.value?.clearFiles()
  fileCountCurrent = 0;
}
const fileContent = ["pt", "py","txt"];
let isLoading = ref(false);

let tempFileList = [];
const handleBeforeUpload = (rawFile) => {
  let filetype = rawFile.name.slice(-3)
  if (filetype.startsWith(".")) {
    filetype = filetype.slice(-2)
  }
  tempFileList.push(filetype);
  if (tempFileList.length !== fileCountCurrent) {
    return true;
  }
  for (let i = 0; i < fileContent.length; i++) {
    let item = fileContent[i];
    if (tempFileList.indexOf(item) < 0) {
      setTimeout(() => {
        ElMessage({
          type: 'error',
          message: `缺少${item}文件`,
          grouping: true,
        });
      }, 20);
      tempFileList = [];
      upload?.value?.clearFiles();
      fileCountCurrent = 0;
      return false;
    }
  }
  isLoading.value = true;
  tempFileList = [];
  return true;
};

let successFileCount = 0;
const handleSuccessUpload = (res, file, files) => {
  successFileCount += 1;
  if (successFileCount !== fileCountLimit) {
    return true;
  }
  let filenames = files.map(x => x.name);
  ElMessage({
    message: "正在分析文件，请稍等！",
    grouping: true,
    type: 'info',
  })
  setTimeout(() => {
    request({
      url: "afterUploadModel",
      method: "POST",
      timeout: 20 * 1000,
      data: {
        ptName: filenames.find(x => x.slice(-2) === "pt"),
        pyName: filenames.find(x => x.slice(-2) === "py"),
        txtName: filenames.find(x => x.slice(-3) === "txt"),
        token: uploadToken.value,
      }
    }).then((res) => {
      ElMessage({
        message: "上传成功！",
        grouping: true,
        type: 'success',
      })
      emit("finish", res);
    }).catch((err) => {

    }).finally(() => {
      isLoading.value = false;
      successFileCount = 0;
    });
  }, 100);
};

const handleErrorUpload = (res) => {
  isLoading.value = false;
};
const handleChange = (file, files) => {
  fileCountCurrent = files.length;

}
const submitUpload = () => {
  if (fileCountCurrent === 0) {
    ElMessage({
      type: "info",
      message: "未选择文件",
      grouping: true,
    });
    return;
  }
  validToken().then(response => {
    uploadToken.value = new Date().getTime().toString();
    upload.value.submit();
  });

};


</script>

<style>


</style>
