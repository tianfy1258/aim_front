<template>

  <el-form-item style="margin-top: 20px">

  </el-form-item>
  <el-form-item label="操作">
    <div style="display: flex;align-items: center;justify-content: center;width: 200px">
      <el-button @click="addReport"
                 style="flex-grow: 1"
                 type="">
        保存结果
      </el-button>
      <el-button @click="clearReport"
                 style="flex: 0.2"
                 type="danger">
        清空结果
      </el-button>
    </div>
  </el-form-item>
  <tensor-space-report-list
      v-show="report?.length > 0"
      :data="report?.map(x => x.tensorSpaceImage.toDataURL('image/jpeg'))"
      @delete-image="deleteReport"
  ></tensor-space-report-list>
  <el-form-item>
    <el-button @click="generateReport" style="width: 200px"
               v-show="Object.keys(report).length > 0"
               type="primary">
      导出报告
    </el-button>
  </el-form-item>
</template>

<script setup>
import {ref, toRaw} from "vue";
import {useStore} from "../pinia/index.js"
import {createPDF} from "../utils/pdf.js";
import TensorSpaceReportList from "./TensorSpaceReportList.vue";
import {ElMessage, ElMessageBox} from "element-plus";

const props = defineProps({
  model: {
    type: Object,
    required: true,
    default: {
      modelRenderer: {
        renderer: null,
        scene: null,
        camera: null,
      },
    },
  },
  name: {
    type: String,
    required: true,
    default: "",
  }
});
let report = ref([]);
const store = useStore();
const clearReport = () => {
  report.value = []
}
const addReport = () => {
  if (!store.captureValid) {
    ElMessage({
      message: "请进行数据输入",
      type: "info",
    });
    return;
  }
  let modelName = props.name;
  report.value = report.value ?? [];
  let tensorSpace = toRaw(store.tensorSpace);
  report.value.push(
      {
        name:modelName,
        input: tensorSpace.input,
        tensorSpaceImage: captureTensorSpace(),
        output: tensorSpace.output,
      }
  );
}
const deleteReport = (index) => {
  if (index !== -1) {
    report.value.splice(index, 1);
  }
}
const generateReport = () => {
  ElMessageBox.confirm('确定创建报告？')
      .then(() => {
        createPDF(toRaw(report.value));
      }).catch(err => {
    console.log(err);
  })
}
const captureTensorSpace = () => {
  const model = toRaw(props.model);
  const renderer = model.modelRenderer.renderer;
  const scene = model.modelRenderer.scene;
  const camera = model.modelRenderer.camera;
  renderer.render(scene, camera); // 首先渲染一次

  const canvas = document.getElementsByTagName('canvas')[0];
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  const ctx = newCanvas.getContext('2d');
  const gl = canvas.getContext('webgl');

  // 读取像素数据
  const buffer = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
  // 将像素数据翻转
  const flippedBuffer = new Uint8Array(buffer.length);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      for (let c = 0; c < 4; c++) {
        flippedBuffer[(y * canvas.width + x) * 4 + c] = buffer[((canvas.height - y - 1) * canvas.width + x) * 4 + c];
      }
    }
  }

  // 复制到新的canvas
  const imageData = new ImageData(new Uint8ClampedArray(flippedBuffer), canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  return newCanvas;
  //  // 打开新的窗口
  //  var w = window.open('', '');
  //  w.document.title = "DNA_screen";
  //  w.document.body.style.backgroundColor = "white";
  //  var img = new Image();
  //  img.src = newCanvas.toDataURL();
  //  w.document.body.appendChild(img);
  // // 保存图像并下载
  //  const dataURL = newCanvas.toDataURL('image/png');
  //  const link = document.createElement('a');
  //  link.download = 'tensorspace.png';
  //  link.href = dataURL;
  //  link.click();
};
</script>

<style scoped>

</style>
