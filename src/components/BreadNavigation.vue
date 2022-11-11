<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
        :to="{path: item.path}"
        v-for="(item, index) in breadList"
        :key="index"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>

</template>


<script setup>
import {ref, watch, watchEffect} from "vue";
import {useRoute} from "vue-router";

const $route = useRoute();
let breadList = ref([]);

const getBreadcrumb = () => {
  breadList.value = $route.matched;
  if (!$route.matched[$route.matched.length - 1].meta.title) {
    breadList.value = breadList.value.slice(0, $route.matched.length - 1);
  }
}
watchEffect(getBreadcrumb);

</script>

<style scoped>
.el-breadcrumb {
  height: 3vh;
  padding: 10px 0 0 20px;
  margin-bottom: 8px;
  background: #fff;
}
</style>
