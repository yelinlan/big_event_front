<script setup>
import {Delete, Edit} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {
  articleCategoryAddService,
  articleCategoryDeleteService,
  articleCategoryListService,
  articleCategoryUpdateService
} from "@/api/article.js";
import {ElMessage, ElMessageBox} from "element-plus";

const categories = ref([])
const categoryModel = ref({
  categoryName: '',
  categoryAlias: ''
})
const dialogVisible = ref(false)
const title = ref('')
let rules = ref({
  categoryName: [
    {required: true, message: "请输入分类名称", trigger: "blur"},
    {min: 1, max: 32, message: "长度为1-32位非空字符", trigger: "blur"}
  ],
  categoryAlias: [
    {required: true, message: "请输入分类别名", trigger: "blur"},
    {min: 1, max: 32, message: "长度为1-32位非空字符", trigger: "blur"}
  ]
});

const articleCategoryList = async () => {
  let value = await articleCategoryListService();
  categories.value = value.data;
}
articleCategoryList()

const showUpdateDialog = (row) => {
  categoryModel.value = {categoryName: row.categoryName, categoryAlias: row.categoryAlias, id: row.id}
  dialogVisible.value = true
  title.value = "编辑分类"
}
const showInsertDialog = () => {
  categoryModel.value = {}
  dialogVisible.value = true
  title.value = "添加分类"
}

const addCategory = async () => {
  let result = await articleCategoryAddService(categoryModel.value);
  ElMessage.success(result.message ? result.message : "添加成功")
  await articleCategoryList()
  dialogVisible.value = false
}

const updateCategory = async () => {
  let result = await articleCategoryUpdateService(categoryModel.value);
  ElMessage.success(result.message ? result.message : "修改成功")
  await articleCategoryList()
  dialogVisible.value = false
}

const deleteCategory = (row) => {

  ElMessageBox.confirm(
      '确认删除文章分类?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        let result = await articleCategoryDeleteService(row.id);
        ElMessage({
          type: 'success',
          message: '删除成功！',
        })
        await articleCategoryList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary" @click="showInsertDialog">添加分类</el-button>
        </div>
      </div>
    </template>
    <el-table :data="categories" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showUpdateDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form ref="form" :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="title==='添加分类'?addCategory():updateCategory()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
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
</style>