<template>
  <el-scrollbar>
    <div class="flex-row">
      <div style="font-size: 1.3em;margin: 20px;padding-left: 40px;">模型测试结果:</div>
    </div>
    <div class="flex-row">
      <el-table :data="tableData"
                ref="tableRef"
                highlight-current-row
                style="width: 600px;margin-left: 60px;margin-bottom: 30px"
      >
        <el-table-column prop="label" label="度量方法"/>
        <el-table-column prop="value" label="度量值"/>
      </el-table>
    </div>
    <bar-chart :data="lowestChartData"></bar-chart>
    <bar-chart :data="highestChartData"></bar-chart>

  </el-scrollbar>

</template>

<script setup>
import {ref, watchEffect} from 'vue'
import BarChart from "../echarts/BarChart.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
let lowestChartData = ref(null);
let highestChartData = ref(null);
let tableData = ref([])
watchEffect(() => {
  tableData.value = props.data.tableData;
  lowestChartData.value = props.data.lowestChartData;
  highestChartData.value = props.data.highestChartData;
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
