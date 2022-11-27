<template>
  <div ref="chartRef" id="main" style="width: 100%;height: 500px">

  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref, watch} from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
const chartRef = ref(null);
let option;
let myChart;
onMounted(() => {
  myChart = echarts.init(chartRef.value);
  option && myChart.setOption(option);
});
let task_key = null;
let data = [];
watch(props.data, (val) => {
  let option = {};
  if (task_key !== val.task_key) {
    task_key = val.task_key;
    data = [];
  }
  let xAxisData = [];
  for (let i = 0; i < val.process; i++) {
    xAxisData.push(i);
  }

  option.xAxis = {
    type: 'category',
    data: xAxisData
  };
  option.yAxis = {
    type: 'value'
  };
  data = [...data, ...val.data]
  option.series = [
    {
      data: data,
      type: 'line',
    }
  ];

  myChart.setOption(option);

});
option = {
  title: {
    text: '覆盖率',
  },
  tooltip: {
    show: true
  },
  xAxis: {
    name: "测试样本数",
    type: 'category',
    splitLine: {
      show: false
    },
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      showSymbol: false,
    }
  ]
};


</script>

<style scoped>

</style>
