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
        <el-form-item label="使用样本数" prop="sample">
          <div style="display: flex;">
            <el-slider style="width: 350px" v-model="form.sample_rate" :step="0.1" :min="0.1" :max="100"/>
            <div style="width: 100px" v-show="form.dataset_id_1">{{ sample_count }}</div>
          </div>
        </el-form-item>
        <el-form-item label="随机数种子" prop="enable_random">
          <el-radio-group v-model="form.enable_random">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="随机数种子" prop="random_seed" v-show="form.enable_random">
          <el-input-number v-model="form.random_seed" :min="0" :max="10000" :step="1"></el-input-number>
        </el-form-item>

        <el-form-item label="度量方法" prop="sample"
                      v-show="false"
                      >
          <el-checkbox-group class="checkboxGroup" disabled v-model="form.single_method_list">
            <el-checkbox v-for="item in singleMeasureMethods" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="对比分析" prop="enable_compare" v-show="false">
          <el-radio-group v-model="form.enable_compare">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="对比数据集" prop="dataset_id_2" class="datasetSelect"
                      v-show="form.enable_compare">
          <el-select-v2 v-model="form.dataset_id_2"
                        :options="datasetRelatedOptions"
                        filterable
                        placeholder="请选择">

          </el-select-v2>
        </el-form-item>



        <el-form-item label="对比方法" prop="sample"
                      v-show="form.enable_compare">
          <el-checkbox-group class="checkboxGroup" v-model="form.compare_method_list">
            <el-checkbox v-for="item in compareMeasureMethods" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="onSubmit(formRef)" style="width: 200px"
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
import {computed, reactive, ref, watchEffect} from "vue";
import {request} from "../network/request.js";
import {ElMessage} from "element-plus";
import {useStore} from '../pinia/index'
import {useRouter} from "vue-router";

const router = useRouter();
const store = useStore()
const singleMeasureMethods = ref([
  {label: "平均值", value: "mean"},
  {label: "标准差", value: "std"},
  {label: "平均梯度", value: "gradient"},
  {label: "BRISQUE指数", value: "brisque"},
]);
const compareMeasureMethods = ref([
  {label:"SNR（信噪比）",value:"SNR"},
  {label:"PSNR（峰值信噪比）",value:"PSNR"},
  // {label:"SSIM（结构相似性）",value:"SSIM"},
  // {label:"MSSIM（平均结构相似性）",value:"MSSIM"},
  // {label:"UQI（通用质量）",value:"UQI"},
  // {label:"NQM（噪声质量）",value:"NQM"},
  {label:"FSIM（特征相似性）",value:"FSIM "},
  {label:"MSE（均方差）",value:"MSE"},
])

const sample_count = computed(() => {
  let dataset = datasetOptions?.value?.find(x => x.value === form.dataset_id_1);
  return dataset ? Math.round(form.sample_rate * 0.01 * dataset.instances) : 0;
})
const formRef = ref(null);
const form = reactive({
  task_name:"",
  task_description:"",
  dataset_id_1:"",
  dataset_id_2:"",
  enable_random: false,
  random_seed: 0,
  sample_rate: 1,
  sample_count: -1,
  enable_compare:false,
  compare_method_list:[],
  single_method_list:["mean","std","gradient","brisque"],

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
  // dataset_id_2: [
  //   {
  //     required: true,
  //     message: '请选择数据集',
  //     trigger: 'change',
  //   },
  // ],
})

let datasetOptions = ref([]);
let datasetRelatedOptions = ref([]);
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
      value: x.dataset_id,
      label: x.dataset_name,
      instances: x.dataset_instances,
      hashcode: x.hashcode,
    }));
  })
}
const getDatasetRelatedOptions = (hashcode) => {
  request({
    url: "getDatasetOptions",
    method: 'POST',
    data: {
      pageSize: 100000,
      filter:{
        hashcode:hashcode,
      }
    }
  }).then((res) => {
    datasetRelatedOptions.value = res.data.filter(x =>
      x.dataset_id !== form.dataset_id_1
    ).map((x) => ({
      value: x.dataset_id,
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
// get related dataset options when dataset_id_1 changed
watchEffect(() => {
  if (form.dataset_id_1) {
    let hashcode = datasetOptions.value.find((x) => x.value === form.dataset_id_1).hashcode;
    getDatasetRelatedOptions(hashcode);
  }
})


let isLoginButtonValid = ref(true);
let isLoading = ref(false);
let response = ref([]);

const onSubmit = (formRef) => {
  if (!formRef || !isLoginButtonValid.value) return
  formRef.validate((valid) => {
    if (valid) {

      form.sample_count = sample_count.value;
      isLoginButtonValid.value = false;
      isLoading.value = true;
      request({
        url: "createDatasetMeasurementTask",
        method: "POST",
        data: form,
      }).then((res) => {
        ElMessage({
          type: 'success',
          message: '创建成功 ' + res.task_id,
        });

      }).catch((err) => {
      })
          .finally(() => {
            isLoginButtonValid.value = true;
            isLoading.value = false;
            router.push('/main/datasetTaskList')
          });
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
