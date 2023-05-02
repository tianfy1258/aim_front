import jsPDF from 'jspdf';

let doc = null;
let currentHeight = 5;

let INPUT_PIC_SIZE = 50
let OUTPUT_PIC_SIZE = 190
let INPUT_DELTA = INPUT_PIC_SIZE + 10;
let OUTPUT_DELTA = 137;

const createPDF = (data) => {
  currentHeight = 10;
  doc = new jsPDF();
  // 遍历data的所有属性
  data.forEach((item) => {
    currentHeight = 10;
    addItem(item);
    doc.addPage();
  });
  // 删除最后一页空白页
  doc.deletePage(doc.getNumberOfPages());
// 获取当前时间戳
  let timestamp = new Date().getTime();
// 将 PDF 文档保存或下载
  doc.save(timestamp + ".pdf");
}
export {createPDF};

function addItem(item) {
  doc.addImage(text2img("模型：" + item.name), 10, currentHeight);
  currentHeight += 10;
  doc.addImage(text2img("输入："), 10, currentHeight);
  currentHeight += 13;
  // 遍历输入字段
  if (item.input.type === "image") {
    if (typeof item.input.value === 'object') {
      item.input.value = list2canvas(item.input.value);
    }
    // 将图像添加到 PDF 文档中
    doc.addImage(item.input.value, "JPEG", 10, currentHeight, INPUT_PIC_SIZE, INPUT_PIC_SIZE);
    currentHeight += INPUT_DELTA;
  } else if (item.input.type === "text") {
    // 将文本添加到 PDF 文档中
    doc.addImage(text2img(item.input.value), 10, currentHeight);
    currentHeight += 13;
  }
  // 将 tensorSpaceImage 添加到 PDF 文档中
  doc.addImage(text2img("可视化展示："), 10, currentHeight);
  currentHeight += 13;
  doc.addImage(item.tensorSpaceImage.toDataURL("image/jpeg"), "canvas", 10, currentHeight, OUTPUT_PIC_SIZE, OUTPUT_PIC_SIZE - 60);
  currentHeight += OUTPUT_DELTA;


  doc.addImage(text2img("输出："), 10, currentHeight);
  currentHeight += 10;
  // 遍历输出字段
  if (item.output.type === "image") {
    if (typeof item.output.value === 'object') {
      item.output.value = list2canvas(item.output.value);
    }
    // 将图像添加到 PDF 文档中
    doc.addImage(item.output.value, "JPEG", 10, currentHeight, INPUT_PIC_SIZE, INPUT_PIC_SIZE);
    currentHeight += INPUT_PIC_SIZE;
  } else if (item.output.type === "text") {
    // 将文本添加到 PDF 文档中
    let text = item.output.value;
    let arr = text.split("@");
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i].trim();
      doc.addImage(text2img(str), 10, currentHeight);
      currentHeight += 10;
    }
    currentHeight += 13;
  }

}

const text2img = (text) => {


  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");


// 设置 canvas 大小
  canvas.width = 600;
  canvas.height = 60;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// 设置文本样式
  ctx.font = "16px 宋体";
  ctx.fillStyle = "black";
  ctx.fillText(text, 10, 30);

  return canvas.toDataURL("image/jpeg");
}
const list2canvas = (list) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let data = [];

  // 设置 canvas 大小
  if (list.length !== 784) {
    let size = Math.round(Math.sqrt(list.length / 3));
    canvas.width = size;
    canvas.height = size;
    let pd = 0;
    for (let i = 0; i < list.length; i += 3) {
      data[pd++] = list[i];
      data[pd++] = list[i + 1];
      data[pd++] = list[i + 2];
      data[pd++] = 255; // 添加alpha通道，表示完全不透明
    }
  } else {
    canvas.width = 28;
    canvas.height = 28;
    let pd = 0;
    for (let i = 0; i < list.length; i++) {
      data[pd++] = list[i];
      data[pd++] = list[i];
      data[pd++] = list[i];
      data[pd++] = 255; // 添加alpha通道，表示完全不透明
    }
  }

  // 将list转化为uint8
  const buffer = new Uint8Array(data);
  const imageData = new ImageData(new Uint8ClampedArray(buffer), canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/jpeg");

};
