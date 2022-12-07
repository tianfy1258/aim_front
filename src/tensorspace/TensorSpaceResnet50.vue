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
import {BASE_URL} from "../network/request.js"
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
    model.add(new TSP.layers.RGBInput());
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Pooling2d());
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn2a_branch2c = new TSP.layers.Conv2d();
    model.add(bn2a_branch2c);
    let bn2a_branch1 = new TSP.layers.Conv2d();
    model.add(bn2a_branch1);
    let activation_4 = TSP.layers.Add([bn2a_branch2c, bn2a_branch1]);
    model.add(activation_4);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn2b_branch2c = new TSP.layers.Conv2d();
    model.add(bn2b_branch2c);
    let activation_7 = TSP.layers.Add([activation_4, bn2b_branch2c]);
    model.add(activation_7);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn2c_branch2c = new TSP.layers.Conv2d();
    model.add(bn2c_branch2c);
    let activation_10 = TSP.layers.Add([activation_7, bn2c_branch2c]);
    model.add(activation_10);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn3a_branch2c = new TSP.layers.Conv2d();
    model.add(bn3a_branch2c);
    let bn3a_branch1 = new TSP.layers.Conv2d();
    model.add(bn3a_branch1);
    let activation_13 = TSP.layers.Add([bn3a_branch1, bn3a_branch2c]);
    model.add(activation_13);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn3b_branch2c = new TSP.layers.Conv2d();
    model.add(bn3b_branch2c);
    let activation_16 = TSP.layers.Add([activation_13, bn3b_branch2c]);
    model.add(activation_16);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn3c_branch2c = new TSP.layers.Conv2d();
    model.add(bn3c_branch2c);
    let activation_19 = TSP.layers.Add([activation_16, bn3c_branch2c]);
    model.add(activation_19);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn3d_branch2c = new TSP.layers.Conv2d();
    model.add(bn3d_branch2c);
    let activation_22 = TSP.layers.Add([activation_19, bn3d_branch2c]);
    model.add(activation_22);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4a_branch2c = new TSP.layers.Conv2d();
    model.add(bn4a_branch2c);
    let bn4a_branch1 = new TSP.layers.Conv2d();
    model.add(bn4a_branch1);
    let activation_25 = TSP.layers.Add([bn4a_branch1, bn4a_branch2c]);
    model.add(activation_25);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4b_branch2c = new TSP.layers.Conv2d();
    model.add(bn4b_branch2c);
    let activation_28 = TSP.layers.Add([activation_25, bn4b_branch2c]);
    model.add(activation_28);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4c_branch2c = new TSP.layers.Conv2d();
    model.add(bn4c_branch2c);
    let activation_31 = TSP.layers.Add([activation_28, bn4c_branch2c]);
    model.add(activation_31);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4d_branch2c = new TSP.layers.Conv2d();
    model.add(bn4d_branch2c);
    let activation_34 = TSP.layers.Add([activation_31, bn4d_branch2c]);
    model.add(activation_34);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4e_branch2c = new TSP.layers.Conv2d();
    model.add(bn4e_branch2c);
    let activation_37 = TSP.layers.Add([activation_34, bn4e_branch2c]);
    model.add(activation_37);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn4f_branch2c = new TSP.layers.Conv2d();
    model.add(bn4f_branch2c);
    let activation_40 = TSP.layers.Add([activation_37, bn4f_branch2c]);
    model.add(activation_40);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn5a_branch2c = new TSP.layers.Conv2d();
    model.add(bn5a_branch2c);
    let bn5a_branch1 = new TSP.layers.Conv2d();
    model.add(bn5a_branch1);
    let activation_43 = TSP.layers.Add([bn5a_branch1, bn5a_branch2c]);
    model.add(activation_43);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn5b_branch2c = new TSP.layers.Conv2d();
    model.add(bn5b_branch2c);
    let activation_46 = TSP.layers.Add([activation_43, bn5b_branch2c]);
    model.add(activation_46);
    model.add(new TSP.layers.Conv2d());
    model.add(new TSP.layers.Conv2d());
    let bn5c_branch2c = new TSP.layers.Conv2d();
    model.add(bn5c_branch2c);
    let activation_49 = TSP.layers.Add([activation_46, bn5c_branch2c]);
    model.add(activation_49);
    model.add(new TSP.layers.Pooling2d());
    model.add(new TSP.layers.Output1d({
      paging: true,
      segmentLength: 400,
      outputs: result
    }));
    return model;
  }
  model = buildModel();
  model.load({
    type: "keras",
    url: `${BASE_URL}getFile/resnet50.json`,
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
