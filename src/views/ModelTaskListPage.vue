<template>
  <div>
    <div style="display: flex;align-items: center;margin: 10px 0;">
      <el-button style="margin:0 10px 0 20px;" @click="getData">搜索</el-button>
      <el-input v-model="searchText" placeholder="输入任务名称" style="width:200px"/>
      <div style="font-size: 0.8em;margin-left: 10px;display: flex;align-items: center;justify-content: center;">
        <div style="margin-right: 5px;">自动刷新</div>
        <el-switch v-model="refreshEnabled" @change="handleSwitchChange"></el-switch>
      </div>
    </div>
    <el-table :data="datasets"
              @sort-change="handleSortChange"
              style="width: 100%"
              height="78vh"
              ref="tableRef"
              v-loading="isLoading">
      <!--      <el-table-column sortable-->
      <!--                       prop="task_id" label="编号" :show-overflow-tooltip="true"/>-->
      <el-table-column sortable
                       prop="task_name" label="名称" :show-overflow-tooltip="true">
      </el-table-column>
      <!--      <el-table-column-->
      <!--          prop="task_description" label="描述" :show-overflow-tooltip="true"/>-->

      <el-table-column prop="dataset_id__dataset_name" sortable label="数据集"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="sample_count" min-width="50px" label="数据总数" :show-overflow-tooltip="true"/>

      <el-table-column prop="model_id__model_name" sortable label="度量模型"
                       :show-overflow-tooltip="true"/>
      <el-table-column prop="random_seed" sortable label="随机种子"
                       :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.enable_random ? scope.row.random_seed : "未启用" }}
        </template>
      </el-table-column>

      <el-table-column sortable
                       v-if="false"
                       prop="measure_method" label="度量方法" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ JSON.parse(scope.row.measure_method.replaceAll("'", "\"")).join(", ") }}
        </template>
      </el-table-column>
      <el-table-column prop="measure_method"  label="进度" :show-overflow-tooltip="true">
        <template #default="scope">

          <el-tooltip manual
                      :content="tooltipFormatter(scope.row)"
                      placement="top">
            <el-progress :percentage="progressFormatter(scope.row)"
                         :status="progressStyleFormatter(scope.row.task_status)"/>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column prop="task_status" sortable min-width="65px" label="状态"
                       :show-overflow-tooltip="true">
        <template #default="scope">
          <el-tag class="ml-2"
                  :type="statusStyleFormatter(scope.row.task_status)">
            {{ statusFormatter(scope.row.task_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" sortable label="创建时间" min-width="90px"
                       :formatter="timeFormatter('yyyy-MM-dd hh:mm:ss')"/>
      <el-table-column prop="create_user__username" label="创建人" width="120"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">

          <el-button link v-if="scope.row.task_status === 'SUCCESS' || scope.row.task_status === 'INTERRUPTED'"
                     type="primary"
                     size="small" @click="viewReport(scope.row)">
            查看报告
          </el-button>
          <el-button link v-else-if="scope.row.task_status === 'FAILURE'" type="primary"
                     size="small" @click="viewErrorLog(scope.row)">
            错误日志
          </el-button>
          <el-button link v-else-if="scope.row.task_status === 'PENDING' || scope.row.task_status === 'PROGRESS'"
                     type="primary"
                     size="small" @click="handleTerminateTask(scope.row)">
            取消任务
          </el-button>
          <el-button link v-else
                     size="small"
                     style="color:rgba(255,255,255,0);"
          >
            占位字符
          </el-button>
          <el-button link style="margin-left: 10px;" type="danger"
                     v-if="scope.row.task_status !== 'PROGRESS' && scope.row.task_status !== 'PENDING'"
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


    <el-dialog v-model="isShowReport" style="width: 70vw;" title="报告查看">
      <report-model-dialog :data="reportRow"></report-model-dialog>
    </el-dialog>

    <el-dialog v-model="isShowErrorLog" style="width: 70vw;" title="错误日志">
      <pre>
              {{ errorLog }}
      </pre>
    </el-dialog>


  </div>
</template>


<script setup>
import {ref} from 'vue'
import {timeFormatter} from "../utils/formatters";
import {useStore} from '../pinia/index'
import {ElMessage, ElMessageBox} from "element-plus";
import ReportModelDialog from "../components/ReportModelDialog.vue";
import {request} from "../network/request.js";

const store = useStore()

let page = ref(1);
let pageSize = ref(20);
let total = ref(100);
let datasets = ref(null);
let isLoading = ref(true);
let orderBy = null;
let tableRef = ref(null);
let searchText = ref("");
let refreshEnabled = ref(false);
let errorLog = ref("");
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
const handleDeleteClick = (item) => {
  ElMessageBox.confirm('删除任务信息？')
      .then(() => {
        request({
          url: "deleteModelMeasurementTask",
          method: "POST",
          data: {
            "id": item.task_id,
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
const handleTerminateTask = (item) => {
  ElMessageBox.confirm('取消任务？')
      .then(() => {
        request({
          url: "terminateModelMeasurementTask",
          method: "GET",
          params: {
            "task_id": item.task_id,
          }
        })
            .then(res => {
              if (item.task_status === 'PROGRESS') {
                ElMessage({
                  message: "中止请求已发送",
                  grouping: true,
                  type: 'info',
                });
                setTimeout(() => {
                  getData();
                }, 3000);
              } else {
                ElMessage({
                  message: "任务已取消",
                  grouping: true,
                  type: 'success',
                });
              }
            })
            .finally(() => {
              getData();
            })
      }).catch(err => {
  })
}
let refreshTimer = null;
const handleSwitchChange = (checked) => {
  if (checked) {
    getData();
    refreshTimer = setInterval(() => {
      getData();
    }, 3000);
  } else {
    clearInterval(refreshTimer);
  }
};
const progressFormatter = (row) => {
  if (row.task_status === 'SUCCESS') {
    return 100;
  } else if (row.task_status === 'PENDING') {
    return 0;
  } else if (row.task_status === 'PROGRESS' || row.task_status === 'INTERRUPTED') {
    return Math.floor((row.progress.current / row.progress.total) * 100);
  } else {
    return 0;
  }
};

const progressStyleFormatter = (string) => {
  if (string === 'SUCCESS') {
    return "success";
  } else if (string === 'FAILURE') {
    return "exception";
  } else {
    return "";
  }
}
const statusFormatter = (string) => {
  if (string === 'SUCCESS') {
    return "已完成";
  } else if (string === 'PENDING') {
    return "等待中";
  } else if (string === 'PROGRESS') {
    return "进行中";
  } else if (string === 'FAILURE') {
    return "失败";
  } else if (string === 'REVOKED') {
    return "已取消";
  } else if (string === 'INTERRUPTED') {
    return "已中止";
  } else {
    return "未知";
  }
}

const statusStyleFormatter = (string) => {
  if (string === 'SUCCESS') {
    return "success";
  } else if (string === 'PENDING') {
    return "info";
  } else if (string === 'PROGRESS') {
    return "";
  } else if (string === 'FAILURE') {
    return "danger";
  } else if (string === "REVOKED" || string === "INTERRUPTED") {
    return "warning";
  } else {
    return "info";
  }
}
const tooltipFormatter = (item) => {
  if (item.task_status === 'PROGRESS' || item.task_status === 'INTERRUPTED') {
    return item.progress.current + "/" + item.progress.total;
  } else if (item.task_status === 'FAILURE') {
    return "0/" + item.sample_count;
  } else if (item.task_status === 'SUCCESS') {
    return item.sample_count + "/" + item.sample_count;
  } else {
    return "0/" + item.sample_count;
  }
}

const getData = () => {

  if (orderBy === null) {
    // 默认排序：按照创建时间
    orderBy = ["-create_time"]
  }
  let filter = {}
  if (searchText.value) {
    filter.task_name__contains = searchText.value;
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
  isLoading.value = true;
  request({
    url: "getModelMeasurementTaskList",
    method: "POST",
    data: params,
  })
      .then((res) => {
        datasets.value = res.data;
        total.value = res.total;
      })
      .catch(err => {
        refreshEnabled.value = false;
      })
      .finally(() => {
        isLoading.value = false;
        tableRef?.value?.setScrollTop(0);
      })
};


let isShowReport = ref(false);
let isShowErrorLog = ref(false);
let reportRow = ref(null);
const getProgress = (row) => {
  isShowReport.value = false;
}
const viewReport = (row) => {
  reportRow.value = JSON.parse(row.task_result);
  isShowReport.value = true;
}
const viewErrorLog = (row) => {
  errorLog.value = row.task_traceback
  isShowErrorLog.value = true;
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

pre {
  text-align: left;
}

</style>
