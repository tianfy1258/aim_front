<template>
  <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="180px"
      style="width:800px">

    <div v-loading="isLoading">
      <el-form-item label="模型类名">
        <el-select v-model="form.model_classname"
                   placeholder="请选择模型类名">
          <el-option
              v-for="item in response.models"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理方法">
        <el-select v-model="form.image_processor"
                   placeholder="请选择处理方法">
          <el-option
              v-for="item in response.functions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模型名称" prop="model_name">
        <el-input v-model="form.model_name" placeholder="请输入模型名称"/>
      </el-form-item>
      <el-form-item label="模型描述" placeholder="请输入模型描述" prop="model_description">
        <el-input type="text" v-model="form.model_description"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">下一步</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {request} from "../network/request";

const emit = defineEmits(["finish","prev"]);
const props = defineProps({
  response: {
    type: Object,
  },
});
let form = reactive({
  model_classname: "",
  image_processor: "",
  model_name: "",
  model_description: "",
  "upload_token": props.response.upload_token,
  "labels_num": props.response.labels_num,
  "py_name": props.response.py_name,
  "pt_path": props.response.pt_path,
  "py_path": props.response.py_path,
  "txt_path": props.response.txt_path,
})
const rules = reactive({
  model_classname: [
    {required: true, message: '请选择模型类名', trigger: 'change',},
  ],
  image_processor: [
    {required: true, message: '请选择处理方法', trigger: 'change',},
  ],
  model_name: [
    {required: true, message: '请输入模型名称', trigger: 'change',},
    {min: 3, message: '模型名称应不少于3个字符', trigger: 'change'},
  ],
});
const formRef = ref(null);
let isLoading = ref(false);

const onSubmit = (formRef) => {
  if (!formRef || isLoading.value) return
  formRef.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      request({
        url: "checkIsPyValid",
        method: "POST",
        data: form,
      })
          .then((response) => {
            request({
              url: "createModel",
              method: "POST",
              data: form,
            }).then(res => {
              emit("finish");
            }).finally(() => {
              isLoading.value = false;
            })
          })
          .catch(err => {
            emit("prev")
          })
          .finally(() => {
            isLoading.value = false;
          })
    } else {
      isLoading.value = false;
      return false;
    }
  });
}
</script>

<style scoped>

</style>
