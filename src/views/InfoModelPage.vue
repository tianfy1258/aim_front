<template>
  <div>
    <div style="display: flex;align-items: center;margin: 10px 0;">
      <el-button style="margin:0 10px 0 20px;" @click="getData">搜索</el-button>
      <el-input v-model="searchText" placeholder="输入模型名称" style="width:200px"/>
    </div>
    <el-table :data="models"
              @sort-change="handleSortChange"
              style="width: 100%"
              height="78vh"
              ref="tableRef"
              v-loading="isLoading">
      <el-table-column sortable="custom"
                       prop="model_id" label="编号" :show-overflow-tooltip="true"/>
      <el-table-column sortable="custom"
                       prop="model_name" label="名称" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
          prop="model_description" label="描述" min-width="220" :show-overflow-tooltip="true"/>
      <el-table-column prop="model_size" sortable="custom" width="120" label="大小" :formatter="sizeFormatter"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="model_type" sortable="custom" width="120" label="类别"/>
      <el-table-column prop="model_output_shape" sortable="custom" width="140" label="输出类别个数"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="create_time" sortable="custom" label="创建时间" width="120" :formatter="timeFormatter()"/>
      <el-table-column prop="create_user__username" label="创建人" width="120"/>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-link :href="`${DOWNLOAD_URL}assets/${scope.row.model_filename}.pt`" type="primary" size="small">
            下载
          </el-link>
          <el-button v-if="scope.row.create_user__username !== 'system'" link style="margin-left: 10px;" type="danger"
                     size="small" @click="handleDeleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="el-pagination"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10,20,50,100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

  </div>
</template>


<script setup>
import {ref} from 'vue'
import {DOWNLOAD_URL, request} from "../network/request";
import {sizeFormatter, timeFormatter} from "../utils/formatters";
import {ElMessage, ElMessageBox} from "element-plus";


let page = ref(1);
let pageSize = ref(20);
let total = ref(100);
let models = ref(null);
let isLoading = ref(true);
let orderBy = null;
let tableRef = ref(null);
let searchText = ref("");

const handleCurrentChange = (val) => {
  page.value = val;
  getData();
};
const handlePageSizeChange = (val) => {
  pageSize.value = val;
  getData();
};
const handleSortChange = ({column, order, prop}) => {
  if (order === 'descending') {
    orderBy = ["-" + prop];
  } else {
    orderBy = [prop];
  }
  getData();
};

const getData = () => {

  if (orderBy === null) {
    // 默认排序：按照id
    orderBy = ["-model_id"]
  }
  let filter = {}
  if (searchText.value) {
    filter.model_name__contains = searchText.value;
  }
  let params = {
    pageSize: pageSize.value,
    pageNum: page.value,
    orderBy: orderBy?.toString(),
    filter: filter
  };
  for (let key in params) {
    if (!params[key]) {
      delete params[key];
    }
  }
  request({
    url: "getDeepModel",
    method: "POST",
    data: params,
  })
      .then((res) => {
        models.value = res.data;
        total.value = res.total;
      })
      .finally(() => {
        isLoading.value = false;
        tableRef?.value?.setScrollTop(0);
      })
};

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

const init = () => {
  getData();
}
init();
</script>

<style scoped>
.el-pagination {
  margin-top: 2vh;
  justify-content: center;
}
</style>
