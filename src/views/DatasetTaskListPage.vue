<template>
  <div>
    <div style="display: flex;align-items: center;margin: 10px 0;">
      <el-button style="margin:0 10px 0 20px;" @click="getData">搜索</el-button>
      <el-input v-model="searchText" placeholder="输入任务名称" style="width:200px"/>
    </div>
    <el-table :data="datasets"
              @sort-change="handleSortChange"
              style="width: 100%"
              height="78vh"
              ref="tableRef"
              v-loading="isLoading">
      <el-table-column sortable
                       prop="task_id" label="编号" :show-overflow-tooltip="true"/>
      <el-table-column sortable
                       prop="task_name" label="名称" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
          prop="task_description" label="描述" min-width="200" :show-overflow-tooltip="true"/>
      <el-table-column prop="task_status" sortable width="120" label="状态"
                       :show-overflow-tooltip="true">
        <template #default="scope">
          <el-tag class="ml-2" :type="scope.row.task_status === '已完成' ? 'success' : 'info'">
            {{ scope.row.task_status }}
          </el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="dataset_id_1" sortable min-width="160" label="数据集"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="dataset_id_2" sortable min-width="160" label="对比数据集"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="create_time" sortable label="创建时间" width="120" :formatter="timeFormatter()"/>
      <el-table-column prop="create_user__username" label="创建人" width="120"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button link v-if="scope.row.task_status === '已完成'"  type="primary"
                     size="small" @click="viewReport(scope.row)">
            查看报告
          </el-button>
          <el-button link style="margin-left: 10px;" type="danger"
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


    <el-dialog v-model="isShowReport" style="width: 1300px;" title="报告查看">
      <report-dataset-dialog :data="reportRow"></report-dataset-dialog>
    </el-dialog>


  </div>
</template>


<script setup>
import {ref} from 'vue'
import {timeFormatter} from "../utils/formatters";
import {useStore} from '../pinia/index'
import {ElMessage} from "element-plus";
import ReportDatasetDialog from "../components/ReportDatasetDialog.vue";

const store = useStore()

let page = ref(1);
let pageSize = ref(20);
let total = ref(100);
let datasets = ref(null);
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
const handleDeleteClick = (row) => {
  store.REMOVE_ITEM_DATASET(row);
  getData();
  ElMessage({
    message: "删除成功!",
    grouping: true,
    type: 'success',
  });
}
const getData = () => {
  isLoading.value = true;
  setTimeout(() => {
    datasets.value = store.datasetList.slice();
    datasets.value.unshift(JSON.parse(
        `{
              "task_name": "测试任务001",
              "task_description": "测试任务描述",
              "method_list": ["SSIM"],
              "dataset_id_1": "ImageNet_lite",
              "dataset_id_2": "ImageNet_lite_aug",
              "task_id": 0,
              "task_status": "已完成",
              "create_time": "2022-12-13T13:40:41.995Z",
              "create_user__username": "root"
            }`
    ));
    total.value = datasets.value.length;
    isLoading.value = false;
  }, 100);
};

let isShowReport = ref(false);
let reportRow = ref(null);
const viewReport = (row) => {
  reportRow.value = row;
  isShowReport.value = true;
}

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
