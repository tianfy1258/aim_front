<template>
  <el-row>
    <el-col :span="6">
      <el-form ref="formRef"
               id="InterpreterMainPageForm"
               :model="form"
               :rules="rules"
               label-width="120px"
      >
        <el-form-item label="测试模型" prop="model_id">
          <el-select v-model="form.model_id"
                     @change="changeSelectModel"
                     placeholder="请选择">
            <el-option
                v-for="item in modelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标数字" v-if="currentModel.label === 'ACGAN'">
          <el-radio-group v-model="form.options.number" style="width: 300px;">
            <el-radio :label="x" v-for="x in [0,1,2,3,4,5,6,7,8,9]">{{ x }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <tensor-space-report :model="model" :name="String(currentModel.label)" v-if="model !== null"></tensor-space-report>

      </el-form>

    </el-col>
    <el-col :span="18" v-loading="isLoading" style="height: 89vh;">
      <tensor-space-lenet
          v-if="currentModel.label === 'LeNet'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-lenet>

      <tensor-space-acgangen
          v-else-if="currentModel.label === 'ACGAN'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-acgangen>

      <tensor-space-alexnet
          v-else-if="currentModel.label === 'AlexNet'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-alexnet>

      <tensor-space-inception-v3
          v-else-if="currentModel.label === 'Inception-v3'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-inception-v3>

      <tensor-space-mobilenet
          v-else-if="currentModel.label === 'MobileNet'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-mobilenet>

      <tensor-space-resnet50
          v-else-if="currentModel.label === 'Resnet50'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-resnet50>

      <tensor-space-vgg16
          v-else-if="currentModel.label === 'VGG16'"
          :data="form.options"
          @change-model="changeModel"
      ></tensor-space-vgg16>


    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'tensorspace'
}
</script>
<script setup>
import {computed, reactive, ref} from "vue";
import {useStore} from "../pinia/index.js";
import TensorSpaceAcgangen from "../tensorspace/TensorSpaceAcgangen";
import TensorSpaceLenet from "../tensorspace/TensorSpaceLenet.vue";
import TensorSpaceAlexnet from "../tensorspace/TensorSpaceAlexnet.vue";
import TensorSpaceInceptionV3 from "../tensorspace/TensorSpaceInceptionV3.vue";
import TensorSpaceMobilenet from "../tensorspace/TensorSpaceMobilenet.vue";
import TensorSpaceResnet50 from "../tensorspace/TensorSpaceResnet50.vue";
import TensorSpaceVgg16 from "../tensorspace/TensorSpaceVgg16.vue";
import TensorSpaceReport from "../components/TensorSpaceReport.vue";
import {ElMessageBox} from "element-plus";

const store = useStore();
let modelOptions = ref([
  {label: "LeNet", value: 0},
  {label: "ACGAN", value: 1},
  {label: "AlexNet", value: 2},
  {label: "Inception-v3", value: 3},
  {label: "MobileNet", value: 4},
  {label: "Resnet50", value: 5},
  {label: "VGG16", value: 6},
]);


const formRef = ref(null);
const form = reactive({
  model_id: null,
  options: {},
});
const rules = reactive({
  model_id: [
    {
      required: true,
      message: '请选择测试模型',
      trigger: 'change',
    },
  ],
})
const currentModel = computed(() => {
  return form.model_id === null ? {label: -1, value: -1} : modelOptions.value.find(x => x.value === form.model_id);
})
let isLoading = ref(false);
let response = ref([]);
let model = ref(null);

const changeModel = (m) => {
  model.value = m;
}
const changeSelectModel = (value) => {
  store.CAPTURE_INVALID();
  store.REMOVE_TENSORSPACE_STATE();
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
