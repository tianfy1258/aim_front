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
const emits = defineEmits(['changeModel']);

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
  emits("changeModel", model);

});
const clear = () => {
  model.clear();
}
import {useStore} from "../pinia/index.js";
import result from "./imagenet_result.js";
const store = useStore();
const float32ArrayToUint8List = (float32Array) => {
  const length = float32Array.length;
  const uint8List = new Array(length);

  for (let i = 0; i < length; i++) {
    uint8List[i] = Math.floor(((float32Array[i] + 1) / 2) * 255);
  }

  return uint8List;
}

let r = null;
watch(props.data, (val) => {
  if (val.number < 10 && val.number >= 0) {
    store.CAPTURE_VALID();
  }
  let randomData = tf.randomNormal([1, 100]).dataSync();
  model.predict([randomData, [val.number]], (val) => {
    r = float32ArrayToUint8List(val);
  });
  store.SET_TENSORSPACE_STATE({
    output: {
      type: "image",
      value: r,
    },
    input: {
      type: "text",
      value: `
          标签：${val.number}
        `,
    }
  });

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
