<template>
  <el-row>
    <el-col :span="8">
      <el-form ref="formRef"
               id="InterpreterMainPageForm"
               :model="form"
               :rules="rules"
               v-loading="isLoading"
               label-width="120px"
               style="width:600px">


        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="form.task_name"></el-input>
        </el-form-item>

        <el-form-item label="任务描述" prop="task_description">
          <el-input v-model="form.task_description"></el-input>
        </el-form-item>

        <el-form-item label="数据集" prop="dataset_id" class="datasetSelect">
          <el-select-v2 v-model="form.dataset_id"
                        :options="datasetOptions"
                        filterable
                        placeholder="请选择">
          </el-select-v2>
        </el-form-item>
        <el-form-item label="使用样本数" prop="sample">
          <div style="display: flex;">
            <el-slider style="width: 350px" v-model="form.sample_rate" :step="0.1" :min="0.1" :max="100"/>
            <div style="width: 100px" v-show="form.dataset_id">{{ sample_count }}</div>
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


        <el-form-item label="测试模型" prop="model_id">
          <el-select v-model="form.model_id"
                     placeholder="请选择">
            <el-option
                v-for="item in modelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="度量方法" prop="method_list" v-show="false">
          <el-checkbox-group class="checkboxGroup" disabled v-model="form.method_list">
            <el-checkbox v-for="item in measure_method" :label="item.label">{{ item.label }}</el-checkbox>
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

const formRef = ref(null);
const form = reactive({
  task_name: "",
  task_description: "",
  method_list: ["准确率", "精确率", "召回率", "误报率"],
  dataset_id: "",
  model_id: "",
  enable_random: false,
  random_seed: 0,
  sample_rate: 1,
  sample_count: -1,
});
const rules = reactive({
  task_name: [
    {
      required: true,
      message: '请输入任务名称',
      trigger: 'change',
    },
  ],
  dataset_id: [
    {
      required: true,
      message: '请选择数据集',
      trigger: 'change',
    },
  ],
  model_id: [
    {
      required: true,
      message: '请选择模型',
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

const measure_method = ref([
  {label: "准确率", value: "acc"},
  {label: "精确率", value: "precision"},
  {label: "召回率", value: "recall"},
  {label: "误报率", value: "false_positive_rate"}
]);

const sample_count = computed(() => {
  let dataset = datasetOptions?.value?.find(x => x.value === form.dataset_id);
  return dataset ? Math.round(form.sample_rate * 0.01 * dataset.instances) : 0;
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
        url: "createModelMeasurementTask",
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
            router.push('/main/modelTaskList')
          })
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
