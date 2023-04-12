<template>
  <div class="flex-row">
    <div style="font-size: 1.3em;margin: 20px;padding-left: 40px;">数据集测试结果:</div>
  </div>
  <div class="flex-row">
    <el-form :model="formData" label-width="180px">
      <el-form-item label="平均值">
        <span>{{ `R: ${formData.mean[0]} G: ${formData.mean[1]} B: ${formData.mean[2]}` }}</span>
      </el-form-item>
      <el-form-item label="标准差">
        <span>{{ `R: ${formData.std[0]} G: ${formData.std[1]} B: ${formData.std[2]}` }}</span>
      </el-form-item>
      <el-form-item label="最小值">
        <span>{{ `R: ${formData.min[0]} G: ${formData.min[1]} B: ${formData.min[2]}` }}</span>
      </el-form-item>
      <el-form-item label="最大值">
        <span>{{ `R: ${formData.max[0]} G: ${formData.max[1]} B: ${formData.max[2]}` }}</span>
      </el-form-item>
      <el-form-item label="中位数">
        <span>{{ `R: ${formData.median[0]} G: ${formData.median[1]} B: ${formData.median[2]}` }}</span>
      </el-form-item>
      <el-form-item label="平均梯度">
        <span>{{ formData.gradient.mean }}</span>
      </el-form-item>
      <el-form-item label="Brisque指数">
        <span>{{ formData.brisque.mean }}</span>
      </el-form-item>
    </el-form>


  </div>

</template>

<script setup>
import {ref, watchEffect} from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
let formData = ref([])

watchEffect(() => {
  formData.value = props.data.result;
})
</script>


<style scoped>
#Form {
  width: 1600px;
}

.flex-row {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
}

.select-row {
  width: 50%;
}

.image-row {
  justify-content: space-between;
  margin-left: 100px;
  margin-top: 30px;
}

.flex-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.flex-col-item {
  display: flex;
  flex-direction: column;
}

.label {
  width: 160px;
  text-align: right;
  margin: auto 15px auto auto;

}

.full-width-input {
  width: 100%;
}

.image {
  width: 300px;
  height: 300px;
}
</style>
