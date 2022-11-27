<template>
  <div ref="chartRef"
       v-loading="isLoading"
       :element-loading-text="loadingText"
       id="main"
       style="width: 100%;height: 800px">
  </div>
  <div id="PadContainer" v-show="!isLoading">
    <div style="display: flex;flex-direction: column">
      <canvas ref="padRef" id="SignaturePad" class="signature-pad" width=224 height=224></canvas>
      <el-button id="ClearButton" @click="clear">清除</el-button>
    </div>
  </div>
</template>

<script setup>
import * as TSP from 'tensorspace';
import {onMounted, ref, watch} from "vue";
import SignaturePad from "./signature_pad.js"
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
const chartRef = ref(null);
const padRef = ref(null);
let model = null;
let signaturePad = null;
let isLoading = ref(false);
let loadingText = ref("");
onMounted(() => {
  isLoading.value = true;
  const getImage = () => {
    let canvas = padRef.value;
    let context = canvas.getContext( '2d' );
    let imgData = context.getImageData( 0, 0, canvas.width, canvas.height );
    let signatureData = [];
    for ( let i = 0; i < 224; i += 8 ) {
      for ( let j = 3; j < 896; j += 32 ) {
        signatureData.push( imgData.data[ 896 * i + j ] / 255 );
      }
    }
    model.predict( signatureData );
  }
  signaturePad = new SignaturePad(padRef.value, {
    minWidth: 10,
    penColor: 'rgb(103, 151, 174)',
    onEnd: getImage
  });
  model = new TSP.models.Sequential(chartRef.value);

  model.add(new TSP.layers.GreyscaleInput());
  model.add(new TSP.layers.Padding2d());
  model.add(new TSP.layers.Conv2d());
  model.add(new TSP.layers.Pooling2d());
  model.add(new TSP.layers.Conv2d());
  model.add(new TSP.layers.Pooling2d());
  model.add(new TSP.layers.Dense());
  model.add(new TSP.layers.Dense());
  model.add(new TSP.layers.Output1d({
    outputs: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  }));
  model.load({
    type: 'tfjs',
    url: 'http://localhost:8000/getFile/mnist.json',
    onProgress: function( fraction ) {
      loadingText.value = "模型加载进度：" + (fraction * 100).toFixed(2) + "%";
    },
    onComplete: function() {
      loadingText.value = "模型加载完成，正在初始化...";
    }
  });
  model.init(function () {
    fetch('http://localhost:8000/getFile/5.json',)
        .then(res => res.json())
        .then(data => {
          model.predict(data);
        });
    isLoading.value = false;
  });

});
const clear = () => {
  model.clear();
  signaturePad.clear();
}
watch(props.data, (val) => {

});
watch(loadingText,value => {
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
  top: -254px;
}
#SignaturePad {
  background: rgba(39, 73, 105, 0.72);
}
#ClearButton {
  width: 100%;
}
</style>
