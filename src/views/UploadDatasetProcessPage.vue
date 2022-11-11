<template>
  <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="180px"
      style="width:800px">

    <div v-loading="isLoading">
      <el-form-item label="总样本数：">
        <div>{{ form.db_instances }}</div>
      </el-form-item>
      <el-form-item label="标签数量：">
        <div>{{ form.db_tags_num }}</div>
      </el-form-item>
      <el-form-item label="数据集名称" prop="db_name">
        <el-input v-model="form.db_name" placeholder="请输入数据集名称"/>
      </el-form-item>
      <el-form-item label="数据集描述" placeholder="请输入数据集描述" prop="db_description">
        <el-input type="text" v-model="form.db_description"/>
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

const emit = defineEmits(["finish"]);
const props = defineProps({
  response: {
    type: Object,
  },
});
let form = reactive({
  db_type: props.response.db_type,
  db_instances: props.response.db_instances,
  db_tags_num: props.response.db_tags_num,
  db_tags: props.response.db_tags,
  csv_path: props.response.csv_path,
  zip_path: props.response.zip_path,
  db_name: "",
  db_description: "",
})
const rules = reactive({
  db_name: [
    {required: true, message: '请输入数据集名称', trigger: 'change',},
    {min: 3, message: '数据集名称应不少于3个字符', trigger: 'change'},
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
        url: "createDataset",
        method: "POST",
        data: form,
      })
          .then((response) => {
            emit("finish")
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
