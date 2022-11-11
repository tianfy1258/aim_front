<template>
  <el-row>
    <el-col :span="9">
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
        <el-form-item label="归因方法" prop="attribution">
          <el-select v-model="form.attribution"
                     placeholder="请选择">
            <el-option
                v-for="item in attributionOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="参数设置" prop="options" v-show="form.attribution">
          <OptionsIntegratedGradients v-show="form.attribution === 'Integrated Gradients'"
                                      @change="changeOptions"></OptionsIntegratedGradients>
        </el-form-item>

        <el-form-item label="可视化方法" prop="visualize">
          <el-select v-model="form.visualize"
                     placeholder="请选择">
            <el-option
                v-for="item in visualizeOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="可视化符号" prop="visualize">
          <el-select v-model="form.sign"
                     placeholder="请选择">
            <el-option
                v-for="item in signOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="数据集" prop="dataset_id" id="DatasetSelect">
          <el-select-v2 v-model="form.dataset_id"
                        :options="datasetOptions"
                        filterable
                        placeholder="请选择">

          </el-select-v2>
        </el-form-item>

        <el-form-item label="采样方法" prop="sample">
          <el-select v-model="form.sample_method"
                     placeholder="请选择">
            <el-option
                v-for="item in sampleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="采样个数" prop="sample">
          <el-input-number v-model="form.sample_num" :min="1" :max="10"/>
        </el-form-item>

        <el-form-item>
          <el-button  @click="handleSubmitClick(formRef,false)" style="width: 200px"
                     type="primary">
            获取新图片并分析
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button v-show="response.length !== 0" @click="handleSubmitClick(formRef,true)" style="width: 200px" type="primary">
            使用当前图片并分析
          </el-button>
        </el-form-item>
      </el-form>

    </el-col>
    <el-col :span="15" v-loading="isLoading">
      <el-scrollbar ref="scrollbarRef" max-height="94vh" always>
        <el-row style="height: fit-content" v-for="res in response">
          <el-col>
            <picture-viewer :image-info="res"></picture-viewer>
          </el-col>
        </el-row>
      </el-scrollbar>

    </el-col>
  </el-row>
</template>

<script setup>
import {reactive, ref, toRaw} from "vue";
import OptionsIntegratedGradients from "../components/OptionsIntegratedGradients.vue";
import {request} from "../network/request.js";
import PictureViewer from "../components/PictureViewer.vue";


let attributionOptions = ref(['Integrated Gradients']);
let visualizeOptions = ref(['heat_map', 'blended_heat_map']);
let signOptions = ref(['positive', 'negative', 'absolute_value', 'all']);
let sampleOptions = ref([{label: "随机采样", value: "random"}, {label: "指定图片", value: "custom"}]);
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
    }))
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
  attribution: '',
  model_id: '',
  options: {},
  visualize: 'heat_map',
  sign: 'all',
  dataset_id: '',
  sample_method: 'random',
  sample_num: 3,
});
const rules = reactive({
  attribution: [
    {
      required: true,
      message: '请选择归因方法',
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
const changeOptions = (op) => {
  form.options = op;
}
let isLoginButtonValid = ref(true);
let isLoading = ref(false);
let response = ref([]);
const handleSubmitClick = (formRef, useCurrent) => {
  if (!formRef || !isLoginButtonValid.value) {
    return;
  }
  let form_ = JSON.parse(JSON.stringify(form));
  if (useCurrent) {
    form_.samples = response.value.map(x => x.image_name);
    form_.sample_method = "provide"
  }
  formRef.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      isLoginButtonValid.value = false;
      request({
        url: "attribute",
        method: "POST",
        timeout: 8000,
        data: form_,
      }).then((res) => {
        response.value = res.data;
      }).catch((err) => {
      }).finally(() => {
        isLoginButtonValid.value = true;
        isLoading.value = false;
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

#DatasetSelect {
  text-align: left;
}

.el-form-item .el-select-v2 {
  width: 350px;
}

</style>
