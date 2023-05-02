<template>
  <div>
    <el-form-item label="图片列表">
      <div v-for="(image, index) in data" :key="index" class="image-container">
        <el-image
            :src="image"
            :preview-src-list="data"
            fit="cover"
        ></el-image>
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="default"
            circle
            @click="deleteImage(index)"
        ></el-button>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "TensorSpaceReportList",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    data() {
    },
  },
  methods: {
    deleteImage(index) {
      this.$emit("deleteImage", index);
    },
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-image {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
}

.el-button {
  position: absolute;
  top: -5px;
  right: -5px;
}
</style>
