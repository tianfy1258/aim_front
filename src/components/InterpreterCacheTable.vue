<template>
  <div id="CacheTable">
    <el-divider></el-divider>
    <el-table :data="props.data"
              height="40vh"
              ref="tableRef"
              highlight-current-row
              @current-change="handleCurrentChange"
              :default-sort="{ prop: 'time', order: 'descending' }"
              v-loading="isLoading">
      <el-table-column sortable
                       prop="req.attribution" label="归因方法" :show-overflow-tooltip="true"/>
      <el-table-column sortable
                       prop="req.model_name" width="110px" label="模型名称" :show-overflow-tooltip="true"/>
      <el-table-column sortable
                       prop="req.is_noise_tunnel" label="噪声通道" width="110px">
      </el-table-column>
      <el-table-column prop="res[0].image_name" sortable min-width="120px" label="图片名"
                       :show-overflow-tooltip="true"/>
      <el-table-column  sortable min-width="100px" label="参数"
                        :show-overflow-tooltip="true">
        <template #default="scope">
          {{scope.row.req.is_noise_tunnel ? scope.row.req.noise_tunnel_options : scope.row.req.options}}
        </template>
      </el-table-column>
      <el-table-column prop="res[0].image_label" sortable width="120" label="类别" :show-overflow-tooltip="true"/>
      <el-table-column  sortable min-width="60px" label="时间" prop="time"
                        :show-overflow-tooltip="true" :formatter="timeFormatter('hh:mm:ss')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {computed, ref} from 'vue'</script>

<script setup>

import {request} from "../network/request";
import {ref, watch, watchEffect} from "vue";
import {sizeFormatter, timeFormatter} from "../utils/formatters";
import {computed} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {},
  }
})
const emits = defineEmits(['change'])
// let data = ref(null);
let isLoading = ref(false);
let tableRef = ref(null);

const handleDeleteClick = (item) => {
  ElMessageBox.confirm('此操作会删除和该模型相关的所有结果，你确定这么做吗？')
      .then(() => {
        request({
          url: "deleteDeepModel",
          method: "POST",
          data: {
            "id": item.model_id,
          }
        })
            .then(res => {
              ElMessage({
                message: "删除成功！",
                grouping: true,
                type: 'success',
              });
            })
            .finally(() => {
              getData();
            })
      }).catch(err => {
  })
};
const handleCurrentChange = (val) => {
  emits('change', val);
  setCurrent(val);
};
const setCurrent = (row) => {
  tableRef?.value?.setCurrentRow(row);
};

watch(props.data,(val) => {
  setCurrent(props.data[props.data.length - 1]);
},{
  immediate: true,
})
</script>

<style scoped>
.el-pagination {
  margin-top: 2vh;
  justify-content: center;
}
#CacheTable {
  width: 100%;
  margin-top: 30px;
}
</style>
