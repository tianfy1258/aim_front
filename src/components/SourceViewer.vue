<template>
  <el-dialog v-model="isVisible"
             :title="title"
             :width="400"
             @close="handleClose"
  >
    <el-image :src="src" fit="contain" v-if="type === 'images' && isVisible"/>
    <div v-else style="text-align:left;">{{content}}</div>
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import {request} from "../network/request";
import {watch} from "vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  isVisible: Boolean,
  title: String,
  src: String,
  type:String ,
})
let content = ref(null)
watch(props, (v) => {
  if (v.type === 'text' && v.isVisible) {
    request({
      url:v.src + '&type=text',
    }).then(res => {
      content.value = res;
    })
  }
})

const handleClose = () => {
  emit("close");
}
</script>

<style scoped>

</style>
