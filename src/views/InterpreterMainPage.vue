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

        <el-form-item label="启用噪声通道" prop="is_noise_tunnel" v-show="form.attribution !== 'Occlusion'">
          <el-switch
              v-model="form.is_noise_tunnel"
          ></el-switch>
        </el-form-item>

        <el-form-item label="参数设置" prop="options" v-show="form.attribution && !form.is_noise_tunnel">
          <OptionsIntegratedGradients v-if="form.attribution === 'Integrated Gradients'"
                                      @change="changeOptions"></OptionsIntegratedGradients>
          <options-occlusion v-else-if="form.attribution === 'Occlusion'"
                             @change="changeOptions"
          ></options-occlusion>
          <div v-else>无</div>
        </el-form-item>

        <el-form-item label="噪声设置" prop="is_noise_tunnel" v-show="form.is_noise_tunnel">
          <options-noise-tunnel
              @change="changeNoiseTunnelOptions"
          >
          </options-noise-tunnel>
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

        <el-form-item label="采样个数" prop="sample" v-show="false">
          <el-input-number v-model="form.sample_num" :min="1" :max="10"/>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleSubmitClick(formRef,false)" style="width: 200px"
                     type="primary">
            获取新图片并分析
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button v-show="response.length !== 0" @click="handleSubmitClick(formRef,true)" style="width: 200px"
                     type="primary">
            使用当前图片并分析
          </el-button>
        </el-form-item>
      </el-form>

    </el-col>
    <el-col :span="16" v-loading="isLoading" >
      <el-row style="height: fit-content" v-for="res in response">
        <el-col>
          <picture-viewer :image-info="res"></picture-viewer>
        </el-col>
      </el-row>
      <el-row>
        <interpreter-cache-table :data="cacheData" @change="handleTableSelectionChange">
        </interpreter-cache-table>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup>
import {reactive, ref, watchEffect} from "vue";
import OptionsIntegratedGradients from "../components/OptionsIntegratedGradients.vue";
import {request} from "../network/request.js";
import OptionsOcclusion from "../components/OptionsOcclusion.vue";
import OptionsNoiseTunnel from "../components/OptionsNoiseTunnel.vue";
import PictureViewer from "../components/PictureViewer.vue";
import InterpreterCacheTable from "../components/InterpreterCacheTable.vue";

let attributionOptions = ref(['Integrated Gradients', "Saliency", "DeepLift", "Occlusion"]);
let visualizeOptions = ref(['heat_map', 'blended_heat_map']);
let signOptions = ref(['positive', 'negative', 'absolute_value', 'all']);
let sampleOptions = ref([{label: "随机采样", value: "random"}, {label: "指定图片", value: "custom"}]);
let datasetOptions = ref([]);
let modelOptions = ref([]);
let cacheData = ref([]);

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
  attribution: 'Saliency',
  model_id: 1,
  options: {},
  visualize: 'heat_map',
  sign: 'all',
  dataset_id: 5576,
  is_noise_tunnel: false,
  noise_tunnel_options: {},
  sample_method: 'random',
  sample_num: 1,
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
const changeNoiseTunnelOptions = (op) => {
  form.noise_tunnel_options = op;
}

const formController = () => {
  if (form.attribution === 'Occlusion') {
    form.is_noise_tunnel = false;
  }
}
watchEffect(formController)

const handleTableSelectionChange = ({req, res, time}) => {
  response.value = res;
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
  form_.model_name = modelOptions.value.find(x => x.value === form_.model_id).label;
  formRef.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      isLoginButtonValid.value = false;
      request({
        url: "attribute",
        method: "POST",
        timeout: 10 * 60 * 1000,
        data: form_,
      }).then((res) => {
        response.value = res.data;
        cacheData.value.push(
            {
              req: form_,
              res: res.data,
              time: new Date().getTime(),
            }
        )
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
