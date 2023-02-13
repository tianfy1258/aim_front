<template>
  <div ref="chartRef" id="main" style="width:1100px;height: 500px">

  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref, watch} from "vue";


const chartRef = ref(null);
let option;
let myChart;
onMounted(() => {
  myChart = echarts.init(chartRef.value);
  option && myChart.setOption(option);
});
let task_key = ref(null);
let data = [];

option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: ['cucumber', 'miniature poodle', 'Sussex spaniel', 'freight car', 'chiton', 'ice cream', 'bolo tie', 'binoculars', 'Tibetan mastiff', 'beach wagon', 'groenendael', 'abacus', 'drum', 'stopwatch', 'ear', 'kuvasz', 'suspension bridge', 'rapeseed', 'redshank', 'mushroom']
  },
  series: [
    {
      name: '分类正确',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [19, 6, 15, 5, 8, 18, 18, 9, 9, 10, 18, 13, 6, 18, 11, 13, 12, 11, 5, 18]
    },
    {
      name: '分类错误',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [16, 5, 14, 5, 8, 19, 20, 10, 11, 13, 24, 18, 8, 27, 17, 20, 19, 18, 8, 32]
    },
  ]
};


</script>

<style scoped>

</style>
