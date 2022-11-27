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
        判断神经元是否激活的阈值，大于该阈值的神经元视为激活的神经元，范围为0~1。
        <br>
        默认值 0.75。 值越小，激活的标准越严格。
      </template>
      <el-form-item label="激活阈值" prop="threshold">
        <el-input-number v-model="config.threshold" :min="0" :max="1" :precision="2"/>
      </el-form-item>
    </el-tooltip>

  </el-form>
</template>

<script setup>
import {reactive, ref, watch, watchEffect} from "vue";

const formRef = ref(null);
const methodOptions = ref(["riemann_right","riemann_left","riemann_middle","riemann_trapezoid","gausslegendre"])
const config = reactive({
  threshold: 0.75,

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
