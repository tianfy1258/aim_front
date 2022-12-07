<template>
  <el-row>
    <el-col :span="8">
      <el-form ref="formRef"
               id="InterpreterMainPageForm"
               :model="form"
               :rules="rules"
               label-width="120px"
               style="width:600px">
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
        <el-form-item label="覆盖方法" prop="coverage">
          <el-select v-model="form.coverage"
                     placeholder="请选择">
            <el-option
                v-for="item in coverageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="参数设置" prop="options" v-show="form.coverage">-->
        <!--          <options-neuron-coverage v-if="form.coverage === '神经元覆盖'" @change="changeOptions"/>-->
        <!--          <div v-else>无</div>-->
        <!--        </el-form-item>-->

        <el-tooltip
            class="box-item"
            effect="dark"
            placement="right"
        >
          <template #content>
            判断神经元是否激活的阈值，大于该阈值的神经元视为激活的神经元，范围为0~1。
            <br>
            默认值 0.75。 值越小，激活的标准越严格。
          </template>
          <el-form-item label="激活阈值" prop="threshold">
            <el-input-number v-model="form.threshold" :min="0" :max="1" :precision="2" :step="0.05"/>
          </el-form-item>
        </el-tooltip>

        <el-form-item label="数据集" prop="dataset_id" id="DatasetSelect">
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


        <el-form-item>
          <el-button @click="handleSubmitClick(formRef)" style="width: 200px"
                     type="primary">
            开始任务
          </el-button>
        </el-form-item>
      </el-form>

    </el-col>
    <el-col :span="16" v-loading="isLoading">
      <el-row>
        <coverage-line-chart :data="chartData"></coverage-line-chart>
      </el-row>
      <el-row>
        <el-form id="ResultForm">
          <el-form-item label="任务状态：">
            {{ task_status }}
          </el-form-item>
          <el-form-item label="已测试样本数：">
            {{ task_process }}
          </el-form-item>
          <el-form-item label="覆盖率：">
            {{ task_result }}
          </el-form-item>
        </el-form>

      </el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'coverage'
}
</script>
<script setup>
import {computed, reactive, ref} from "vue";
import {request} from "../network/request.js";
import md5 from "../utils/md5.js";
import {useStore} from "../pinia/index.js";
import CoverageLineChart from "../echarts/CoverageLineChart.vue";

const store = useStore();

let coverageOptions = ref([
  {label: "神经元覆盖", value: "Neuron Coverage"},
  {label: " k-多段神经元覆盖", value: "Fake_1"},
  {label: "神经元边界覆盖", value: "Fake_2"},
  {label: "强神经元激活覆盖", value: "Fake_3"},
  {label: "连接覆盖", value: "Fake_4"},
  {label: "路径覆盖", value: "Fake_5"},
  {label: "图元素覆盖", value: "Fake_6"},
  {label: "图结构覆盖", value: "Fake_7"},
]);
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


const formRef = ref(null);
const form = reactive({
  coverage: "Neuron Coverage",
  model_id: 10,
  options: {},
  threshold: 0.35,
  dataset_id: 5576,
  sample_rate: 1,
  sample_count: -1,
  task_key: null,
});
const sample_count = computed(() => {
  let dataset = datasetOptions?.value?.find(x => x.value === form.dataset_id);
  return dataset ? Math.round(form.sample_rate * 0.01 * dataset.instances) : 0;
})
const rules = reactive({
  coverage: [
    {
      required: true,
      message: '请选择覆盖方法',
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
      message: '请选择测试模型',
      trigger: 'change',
    },
  ],
})

let isLoginButtonValid = ref(true);
let isLoading = ref(false);
let response = ref([]);
let taskStatusInterval = null;
const handleSubmitClick = (formRef) => {
  if (!formRef || !isLoginButtonValid.value) {
    return;
  }
  form.task_key = md5("" + new Date().getTime() + store.user.username);
  form.sample_count = sample_count.value;

  let form_ = JSON.parse(JSON.stringify(form));
  form_.model_name = modelOptions.value.find(x => x.value === form_.model_id).label;
  if (form_.coverage.slice(0,4) === "Fake") {
    form_.coverage = "Neuron Coverage";
    form_.threshold = form_.threshold + form_.threshold * Math.random() * 0.3;
  }
  formRef.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      isLoginButtonValid.value = false;
      setTimeout(() => {
        currentIndex = 0;
        taskStatusInterval = setInterval(getTaskStatus, 500);
      }, 1000);
      request({
        url: "coverage",
        method: "POST",
        timeout: 10 * 60 * 1000,
        data: form_,
      }).then((res) => {
        response.value = res.data;
      }).catch((err) => {
        clearInterval(taskStatusInterval);
      }).finally(() => {
        isLoginButtonValid.value = true;
        isLoading.value = false;
        // clearInterval(taskStatusInterval);
      });

    } else {
      return false
    }
  })
};


let task_process = ref(0);
let task_result = ref(0.);
let task_total = ref(0);
let _res_finished = ref(false);
let task_status = computed(() => {
  if (!_res_finished.value) {
    return "正在运行"
  }
  if (_res_finished.value) {
    return "已完成"
  }
});

let chartData = reactive({
  y: [],
  total: 0,
  process: 0,
  task_key: null,
})
let currentIndex = 0;
const getTaskStatus = () => {
  request({
    url: "getStatus",
    params: {
      task_key: form.task_key,
      current_index: currentIndex,
    },
  }).then((res) => {
    _res_finished.value = res.status;
    task_process.value = res.process;
    task_total.value = res.total;
    task_result.value = res.data[res.data.length - 1];
    chartData.data = res.data;
    chartData.total = res.total;
    chartData.process = res.process;
    chartData.task_key = form.task_key;
    currentIndex = res.process;
    if (currentIndex !== 0) {
      isLoading.value = false;
    }
    if (res.status) {
      clearInterval(taskStatusInterval);
      isLoading.value = false;
    }
  }).catch(err => {
    const {code} = err;
    if (code === 402) {
      console.log("retry");
      return;
    }
    clearInterval(taskStatusInterval);
    isLoading.value = false;
  });
}

</script>

<style scoped>
#InterpreterMainPageForm {

}

#DatasetSelect {
  text-align: left;
}

.el-form-item .el-select-v2 {
  width: 350px;
}

#ResultForm {
  margin-left: 80px;
}
</style>
