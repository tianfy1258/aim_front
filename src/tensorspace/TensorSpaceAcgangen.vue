<template>
  <div ref="chartRef"
       v-loading="isLoading"
       :element-loading-text="loadingText"
       id="main"
       style="width: 100%;height: 800px">
  </div>
</template>

<script setup>
import * as TSP from 'tensorspace';
import {BASE_URL} from "../network/request.js"
import * as tf from "@tensorflow/tfjs"
import {onMounted, ref, watch, watchEffect} from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
let isLoading = ref(false);
const chartRef = ref(null);
let model = null;
let loadingText = ref("正在获取模型信息...");

onMounted(() => {
  isLoading.value = true;
  model = new TSP.models.Sequential(chartRef.value, {
    feedInputs: [0]
  });

  model.add(new TSP.layers.Input1d());
  model.add(new TSP.layers.Dense({
    paging: true,
    segmentLength: 400,
    overview: true
  }));

  model.add(new TSP.layers.Reshape());
  model.add(new TSP.layers.UpSampling2d());
  model.add(new TSP.layers.Conv2d());
  model.add(new TSP.layers.UpSampling2d());
  model.add(new TSP.layers.Conv2d());
  model.add(new TSP.layers.Conv2d());

  model.load({
    type: "tfjs",
    url: `${BASE_URL}getFile/acgangen.json`,
    onProgress: function( fraction ) {
      loadingText.value = "模型加载进度：" + (fraction * 100).toFixed(2) + "%";
    },
    onComplete: function() {
      loadingText.value = "模型加载完成，正在初始化...";
    }

  });


  let randomData = tf.randomNormal([1, 100]).dataSync();
  model.init(function () {
    model.predict([randomData, [0]]);
    isLoading.value = false;
  });


});
const clear = () => {
  model.clear();
}
watch(props.data, (val) => {
  let randomData = tf.randomNormal([1, 100]).dataSync();
  model.predict([randomData, [val.number]]);
});

watch(loadingText,value => {
  let node = document.getElementsByClassName("el-loading-text");
  if (node[0]) {
    node[0].innerHTML = value;
  }
});

</script>

<style scoped>

</style>
