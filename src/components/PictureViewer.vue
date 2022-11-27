<template>
  <el-row class="image-flex">
    <el-col :span="6">
      <div class="block" v-show="imageInfo">
        <span class="demonstration">原始图片</span>
        <el-image :src="`http://localhost:8000/getImage?url=${imageInfo?.image_url}`"
                  :preview-src-list="[`http://localhost:8000/getImage?url=${imageInfo?.image_url}`]"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>

        </el-image>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="block" v-show="imageInfo">
        <span class="demonstration">归因输出</span>
        <el-image :src="`http://localhost:8000/getImage?url=${imageInfo?.attr_url}`"
                  :preview-src-list="[`http://localhost:8000/getImage?url=${imageInfo?.attr_url}`]"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>

        </el-image>
      </div>
    </el-col>
    <el-col :span="12" v-show="imageInfo">
      <div class="block">
        <div id="FlexColumn">
          <div class="flex-container">
            <div class="item-label">图片名称</div>
            <div>{{imageInfo?.image_name}}</div>
          </div>
          <div class="flex-container">
            <div class="item-label">置信度</div>
            <div>{{imageInfo?.image_score}}</div>
          </div>
          <div class="flex-container">
            <div class="item-label">预测类别</div>
            <div>{{imageInfo?.image_predict_label}}</div>
          </div>
          <div class="flex-container">
            <div class="item-label">图片类别</div>
            <div>{{imageInfo?.image_label}}</div>
          </div>
        </div>
        </div>
    </el-col>
  </el-row>


</template>

<script setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
defineProps({
  imageInfo:{
    type:Object,
  }
})


</script>

<style scoped>

.image-flex .block {
  text-align: center;
}

.image-flex .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  /*margin-bottom: 20px;*/
}

.image-flex .el-image {
  width: 90%;
  height: 90%;
  max-width: 230px;
  /*max-height: 230px;*/
  /*width: 230px;*/
  /*height: 230px;*/
}

.el-row {
  height: 260px;
}
#FlexColumn {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.flex-container {
  display: flex;
  justify-content: center;
}
.item-label {
  text-align: right;
  margin-right: 20px;
  width: 80px;
}
</style>
