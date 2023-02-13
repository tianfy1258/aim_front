<template>
  <el-row>
    <el-col :span="8">
      <el-form ref="formRef"
               id="InterpreterMainPageForm"
               :model="form"
               :rules="rules"
               label-width="120px"
               style="width:600px">

        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="form.task_name"></el-input>
        </el-form-item>

        <el-form-item label="任务描述" prop="task_description">
          <el-input v-model="form.task_description"></el-input>
        </el-form-item>

        <el-form-item label="数据集" prop="dataset_id_1" class="datasetSelect">
          <el-select-v2 v-model="form.dataset_id_1"
                        :options="datasetOptions"
                        filterable
                        placeholder="请选择">

          </el-select-v2>
        </el-form-item>

        <el-form-item label="对比数据集" prop="dataset_id_2" class="datasetSelect">
          <el-select-v2 v-model="form.dataset_id_2"
                        :options="datasetOptions"
                        filterable
                        placeholder="请选择">

          </el-select-v2>
        </el-form-item>
        <el-form-item label="度量方法" prop="sample">
          <el-checkbox-group class="checkboxGroup" v-model="form.method_list">
            <el-checkbox v-for="item in measure_methods" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleSubmitClick(formRef)" style="width: 200px"
                     type="primary">
            开始任务
          </el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>
<script>

</script>
<script setup>
import {reactive, ref, watchEffect} from "vue";
import {request} from "../network/request.js";
import {ElMessage} from "element-plus";
import {useStore} from '../pinia/index'
import {useRouter} from "vue-router";

const router = useRouter();
const store = useStore()

let measure_methods = ref([
  {label:"MSE（均方差）",value:"MSE"},
  {label:"SNR（信噪比）",value:"SNR"},
  {label:"PSNR（峰值信噪比）",value:"PSNR"},
  {label:"SSIM（结构相似性）",value:"SSIM"},
  {label:"MSSIM（平均结构相似性）",value:"MSSIM"},
  {label:"UQI（通用质量）",value:"UQI"},
  {label:"NQM（噪声质量）",value:"NQM"},
  {label:"FSIM（特征相似性）",value:"FSIM "},
])

const formRef = ref(null);
const form = reactive({
  task_name:"",
  task_description:"",
  method_list:[],
  dataset_id_1:"",
  dataset_id_2:"",
});
const rules = reactive({
  task_name: [
    {
      required: true,
      message: '请输入任务名称',
      trigger: 'change',
    },
  ],
  dataset_id_1: [
    {
      required: true,
      message: '请选择数据集',
      trigger: 'change',
    },
  ],
  dataset_id_2: [
    {
      required: true,
      message: '请选择数据集',
      trigger: 'change',
    },
  ],
})

let datasetOptions = ref([]);
let modelOptions = ref([]);
const getDatasetOptions = () => {
  request({
    url: "getDatasetOptions",
    method: 'POST',
    data: {
      pageSize: 100000,
    }
  }).then((res) => {
    datasetOptions.value = res.data.map((x) => ({
      value: x.dataset_name,
      label: x.dataset_name,
      instances: x.dataset_instances,
    }));
  })
}
const getModelOptions = () => {
  request({
    url: "getModelOptions",
    method: 'POST',
    data: {
      pageSize: 100000,
    }
  }).then((res) => {
    modelOptions.value = res.data.map((x) => ({
      value: x.model_id,
      label: x.model_name,
    }))
  })
}
getModelOptions();
getDatasetOptions();


let isLoginButtonValid = ref(true);
let isLoading = ref(false);
let response = ref([]);
const handleSubmitClick = (formRef, useCurrent) => {
  if (!formRef || !isLoginButtonValid.value) {
    return;
  }
  let form_ = JSON.parse(JSON.stringify(form));
  formRef.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      isLoginButtonValid.value = false;
      setTimeout(() => {
        ElMessage({
          message: "提交成功",
          type: "success"
        });
        isLoginButtonValid.value = true;
        isLoading.value = false;
        form_.task_id = store.datasetList.length > 0 ?
            store.datasetList[store.datasetList.length - 1].task_id + 1 :
            1;
        form_.task_status = "执行中";
        form_.create_time = new Date();
        form_.create_user__username = "root";
        store.ADD_ITEM_DATASET(form_);
        router.push("/main/DatasetTaskList");
      }, Math.min(1000, Math.max(300, 1000 * Math.random())));
    } else {
      return false
    }
  })
}


</script>

<style scoped>
#InterpreterMainPageForm {

}

.datasetSelect {
  text-align: left;
}

.el-form-item .el-select-v2 {
  width: 350px;
}

.checkboxGroup {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  justify-content: flex-start;

}

</style>
