<template>
  <el-form ref="formRef"
           :model="config"
           id="OptionsIntegratedGradientsForm"
           label-width="60px">
    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        在每次迭代中，用于遮挡的超矩形应在每个方向上移动的步伐。
        <br>
        默认值 8。 值越小，结果越精细，但耗时也就更长。推荐该值为0.25~0.5倍的矩形大小。
      </template>
      <el-form-item label="strides" prop="strides">
        <el-input-number v-model="config.strides" :min="1" :max="256"/>
      </el-form-item>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        用于遮挡的超矩形的大小
        <br>
        默认值 32。值越小，结果越精细，但耗时也就更长。推荐该值为0.25~0.5倍图片大小。
      </template>
      <el-form-item label="sliding_window_shapes" prop="sliding_window_shapes">
        <el-input-number v-model="config.sliding_window_shapes" :min="2" :max="256"/>
      </el-form-item>
    </el-tooltip>
  </el-form>
</template>

<script setup>
import {reactive, ref, watch, watchEffect} from "vue";

const formRef = ref(null);
const methodOptions = ref(["riemann_right","riemann_left","riemann_middle","riemann_trapezoid","gausslegendre"])
const config = reactive({
  sliding_window_shapes: 32,
  strides:8,

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
