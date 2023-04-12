<template>
  <div ref="chartRef" id="main" style="width:1100px;height: 500px">

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
    data: props.data.yAxis.reverse(),
    axisLabel: {
      formatter: function(value) {
        // 将名称截断为 10 个字符
        return value.length > 35 ? value.substr(0, 10) + '...' : value;
      }
    },
  },
  series: [
    {
      name: '分类正确',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
        formatter: function(params) {
          if(params.value === 0)
            return '';
          return params.value + ' (' + (params.value / props.data.dataTotal[params.dataIndex] * 100).toFixed(2) + '%)';
        }
      },
      itemStyle: {
        color: '#93e967' // 更改颜色为绿色
      },
      emphasis: {
        focus: 'series'
      },
      data: props.data.dataCorrect.reverse(),
    },
    {
      name: '分类错误',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      itemStyle: {
        color: '#ff7575' // 更改颜色为绿色
      },
      emphasis: {
        focus: 'series'
      },
      data: props.data.dataTotal.reverse().map((num, index) => {
        return num - props.data.dataCorrect[index];
      }),
    },
  ]
};


watch(() => props.data, (newVal) => {
  option.yAxis.data = newVal.yAxis.reverse();
  option.series[0].data = newVal.dataCorrect.reverse();
  option.series[1].data = newVal.dataTotal.reverse().map((num, index) => {
    return num - newVal.dataCorrect[index];
  });
  myChart.setOption(option);
});
</script>

<style scoped>

</style>
