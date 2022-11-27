<template>
  <div ref="chartRef"
       v-loading="isLoading"
       :element-loading-text="loadingText"
       id="main"
       style="width: 100%;height: 800px">
  </div>
  <div id="PadContainer">
    <div style="display: flex;flex-direction: column;color: white;">
      <div id="SignaturePad">
        <div class="item">
          标签：{{ label }}
        </div>
        <div class="item">
          预测标签：{{ predict_label }}
        </div>
        <div class="item">
          置信度：{{ output }}
        </div>
      </div>
      <el-button id="ClearButton" @click="getImage">获取新图片进行分析</el-button>

    </div>
  </div>
</template>

<script setup>
import * as TSP from 'tensorspace';
import * as tf from "@tensorflow/tfjs"
import result from "./imagenet_result.js"
import {onMounted, ref, watch} from "vue";
import {request} from "../network/request.js";
import {ElMessage} from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
let isLoading = ref(false);
let loadingText = ref("正在获取模型信息...");
const chartRef = ref(null);
let model = null;
let output = ref(0);
let predict_label = ref("");
let label = ref("");
const predict = (data, model) => {
  model.predict(data, (val) => {
    let max = Math.max(...val);
    let index = val.indexOf(max);
    output.value = max;
    predict_label.value = result[index];
  });
}

onMounted(() => {
  isLoading.value = true;
  const buildModel = () => {
    let model = new TSP.models.Sequential(chartRef.value);
    model.add(new TSP.layers.RGBInput({
      shape: [224, 224, 3]
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 64,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 64,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Pooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 128,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 128,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Pooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 256,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 256,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 256,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Pooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Pooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Conv2d({
      kernelSize: 3,
      filters: 512,
      strides: 1,
      padding: "same"
    }));
    model.add(new TSP.layers.Pooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    model.add(new TSP.layers.Dense({
      units: 4096,
      paging: true,
      segmentLength: 400
    }));
    model.add(new TSP.layers.Dense({
      units: 4096,
      paging: true,
      segmentLength: 400
    }));
    model.add(new TSP.layers.Output1d({
      units: 1000,
      paging: true,
      segmentLength: 400,
      outputs: result
    }));
    return model;
  }
  model = buildModel();
  model.load({
    type: "keras",
    url: "http://localhost:8000/getFile/vgg16.json",
    onProgress: function (fraction) {
      loadingText.value = "模型加载进度：" + (fraction * 100).toFixed(2) + "%";
    },
    onComplete: function () {
      loadingText.value = "模型加载完成，正在初始化...";
    }
  });

  model.init(function () {
    isLoading.value = false;
  });


});
const getImage = () => {
  request({
    url: "getJsonImage",
    params: {
      width: 224,
      height: 224,
      scale: false,
    },
    method: "get",
  }).then(res => {
    ElMessage({
      message: "加载图片成功",
      grouping: true,
      type: 'success',
    });
    label.value = res.label;
    predict(res.data, model);
  });
}
watch(props.data, (val) => {
  let randomData = tf.randomNormal([1, 100]).dataSync();
  model.predict([randomData, [val.number]]);
});
watch(loadingText, value => {
  let node = document.getElementsByClassName("el-loading-text");
  if (node[0]) {
    node[0].innerHTML = value;
  }
});

</script>

<style scoped>
#PadContainer {
  position: relative;
  float: right;
  top: -110px;
}

#SignaturePad {
  background: rgba(39, 73, 105, 0.72);
  width: 350px;
  height: 80px;
}

#ClearButton {
  width: 100%;
}

#SignaturePad .item {
  text-align: left;
  width: 330px;
  height: 25px;
  overflow: hidden;
  padding-left: 15px;
}
</style>
