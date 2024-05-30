<script setup>
import {reactive, ref} from "vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {logListService} from "@/api/log.js";

let total = ref();

let searchCondition = reactive({
  searchKey: "",
  pageNum: 1,
  pageSize: 5,
  orderBy: "",
  asc: true
});

let logs = ref([]);
const logList = async () => {
  let result = await logListService({
    searchKey: searchCondition.searchKey,
    pageNum: searchCondition.pageNum,
    pageSize: searchCondition.pageSize,
    orderBy: searchCondition.orderBy,
    asc: searchCondition.asc
  });
  logs.value = result.data.items
  total.value = result.data.total
}

logList();

const onSizeChange = () => {
  logList();
}
const onCurrentChange = () => {
  logList();
}
const search = () => {
  logList();
}
const reset = () => {

}

const sortChange = (column) => {
  console.log(column)
  searchCondition.orderBy = toUnderline(column.prop);
  searchCondition.asc = column.order === "ascending";
  search();
}

function toUnderline(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase()) {
      result += '_' + str[i].toLowerCase();
    } else {
      result += str[i];
    }
  }
  return result;
}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>请求日志</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form-item label="关键字：">
      <el-input v-model="searchCondition.searchKey"  placeholder="请输入"/>
    </el-form-item>
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="logs" style="width: 100%" @sort-change="sortChange">
      <el-table-column prop="id" label="序号"/>
      <el-table-column prop="className" label="类名" sortable="custom"/>
      <el-table-column prop="methodName" label="方法名称" sortable="custom"/>
      <el-table-column prop="params" label="请求参数" sortable="custom"/>
      <el-table-column prop="returnParams" label="返回参数" sortable="custom"/>
      <el-table-column prop="requestEnterTime" label="请求开始时间" sortable="custom"/>
      <el-table-column prop="requestLeaveTime" label="请求结束时间" sortable="custom"/>
      <el-table-column prop="createUser" label="操作人" sortable="custom"/>
      <el-table-column prop="requestSpendTime" label="请求耗时（ms）" sortable="custom"/>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="searchCondition.pageNum" v-model:page-size="searchCondition.pageSize" :page-sizes="[3, 5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 抽屉样式 */
:deep(.avatar-uploader) {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}

.el-select {
  min-width: 100px;
}
</style>