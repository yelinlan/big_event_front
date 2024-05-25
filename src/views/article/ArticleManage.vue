<script setup>
import {
  articleAddService,
  articleCategoryListService,
  articleDeleteService,
  articleListService,
  articleUpdateService
} from "@/api/article.js";
import {ref} from "vue";
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {useTokenStore} from "@/stores/token.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const categories = ref([])
const articleCategoryList = async () => {
  let value = await articleCategoryListService();
  categories.value = value.data;
}
articleCategoryList()

let categoryId = ref();
let state = ref();
let searchKey = ref();
let pageNum = ref(1);
let pageSize = ref(5);
let total = ref();

let articles = ref([]);

let visibleDrawer = ref(false);
let drawerTitle = ref();
let articleModel = ref({});

let tokenStore = useTokenStore();

const articleList = async () => {
  let result = await articleListService({
    state: state.value,
    searchKey: searchKey.value,
    categoryId: categoryId.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  });
  articles.value = result.data.items

  for (const article of articles.value) {
    for (const category of categories.value) {
      if (category.id === article.categoryId) {
        article.categoryName = category.categoryName
      }
    }
  }
  total.value = result.data.total
}

articleList();

const onSizeChange = () => {
  articleList();
}
const onCurrentChange = () => {
  articleList();
}
const search = () => {
  articleList();
}
const reset = () => {
  categoryId.value = ''
  state.value = ''
}

const showAddArticle = () => {
  drawerTitle.value = '添加文章'
  articleModel.value = {}
  articleModel.value.content='<p></p>'
  visibleDrawer.value = true
}

const showUpdateArticle = (row) => {
  drawerTitle.value = '编辑文章'
  articleModel.value = {
    categoryId: row.categoryId,
    title: row.title,
    coverImg: row.coverImg,
    id: row.id,
    content: row.content,
    state: row.state
  }
  visibleDrawer.value = true
}

const deleteArticle = (row) => {

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
        let result = await articleDeleteService(row.id)
        ElMessage.success(result.message ? result.message : "删除成功")
        ElMessage({
          type: 'success',
          message: '删除成功！',
        })
        await articleList();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      })
}


const updateArticle = async (state) => {
  articleModel.value.state = state
  let result = await articleUpdateService(articleModel.value);
  await articleList();
  ElMessage.success(result.message ? result.message : "修改成功")
  visibleDrawer.value = false
}

const addArticle = async (state) => {
  articleModel.value.state = state
  let result = await articleAddService(articleModel.value);
  await articleList();
  ElMessage.success(result.message ? result.message : "新增成功")
  visibleDrawer.value = false
}

const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="showAddArticle">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
              v-for="c in categories"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showUpdateArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
  </el-card>
  <!-- 抽屉 -->
  <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
    <!-- 添加文章表单 -->
    <el-form :model="articleModel" label-width="100px">
      <el-form-item label="文章标题">
        <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <el-select placeholder="请选择" v-model="articleModel.categoryId">
          <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                   action="/api/upload"
                   name="file"
                   :headers="{'Authorization':tokenStore.token}"
                   :on-success="uploadSuccess"
        >
          <el-image v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <div class="editor">
          <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="drawerTitle.value = '添加文章'?addArticle('已发布'):updateArticle('已发布')">
          发布
        </el-button>
        <el-button type="info" @click="drawerTitle.value = '添加文章'?addArticle('草稿'):updateArticle('草稿')">草稿
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
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