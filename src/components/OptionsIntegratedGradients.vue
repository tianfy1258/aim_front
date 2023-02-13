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
        近似方法迭代次数
        <br>
        默认值 50，值越大，耗时越长且占用的内存越多。
      </template>
      <el-form-item label="迭代次数" prop="n_steps ">
        <el-input-number v-model="config.n_steps" :min="2" :max="1000"/>
      </el-form-item>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        placement="right"
    >
      <template #content>
        近似积分的方法。
        <br>
        默认值 gausslegendre。
      </template>
      <el-form-item label="近似方法" prop="method">
        <el-select v-model="config.method"
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
  </el-form>
</template>

<script setup>
import {reactive, ref, watch, watchEffect} from "vue";

const formRef = ref(null);
const methodOptions = ref(["riemann_right","riemann_left","riemann_middle","riemann_trapezoid","gausslegendre"])
const config = reactive({
  n_steps: 50,
  method: "gausslegendre",
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
