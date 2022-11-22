<template>
  <el-form ref="formRef"
           :model="config"
           id="OptionsIntegratedGradientsForm"
           label-width="80px">
    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        平滑类型
        <br>
        默认为 smoothgrad。
      </template>
      <el-form-item label="平滑类型" prop="nt_type">
        <el-select v-model="config.nt_type"
                   placeholder="请选择">
          <el-option
              v-for="item in methodOptions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        输入批次中每个样本随机生成的样例的数量。随机样例是通过在每个样本中加入高斯随机噪声而产生的。
        <br>
        默认为：5。
      </template>
      <el-form-item label="样例数量" prop="nt_samples">
        <el-input-number v-model="config.nt_samples" :min="1" :max="64"/>
      </el-form-item>
    </el-tooltip>

    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        高斯噪声的标准差（其平均值为0）。
        <br>
        默认为 1.0。
      </template>
      <el-form-item label="标准差" prop="stdevs">
        <el-input-number v-model="config.stdevs" :precision="2" :step="0.1"/>
      </el-form-item>
    </el-tooltip>

  </el-form>
</template>

<script setup>
import {reactive, ref, watch, watchEffect} from "vue";

const formRef = ref(null);
const methodOptions = ref(["smoothgrad","smoothgrad_sq","vargrad"])
const config = reactive({
  nt_type: "smoothgrad",
  nt_samples: 5,
  stdevs:1.0,
});
const emits = defineEmits(['change']);
watch(config,(n,o) => {
      emits('change', n);
    },
    {immediate: true}
)



</script>

<style scoped>
#OptionsIntegratedGradientsForm {
  margin-top: 30px;
}
.el-form-item {
  margin-bottom: 18px;
}
</style>
