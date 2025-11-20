<template>
  <div class="batch-upload-page">

    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon_notarize.png" /> <span>点击上传文件</span>
      </div>
      
      <div class="upload-container">
        <van-uploader 
          accept=".xlsx,.xls" 
          :after-read="handleUpload" 
          :before-read="beforeUpload"
          v-model="uploaderList"
          :max-count="1"
          upload-text="点击或拖拽文件"
        >
          <div class="custom-upload-box">
            <van-icon name="description" size="40" color="#1989fa" />
            <p class="upload-text">点击选择 Excel 文件上传</p>
            <p class="upload-tip">支持 .xlsx, .xls 格式，不超过 100MB</p>
          </div>
        </van-uploader>
      </div>

      <div class="template-download">
        <span>请严格按模板格式上传，</span>
        <a style="color: #409eff; cursor: pointer" href="/自购物资合同核备-物资明细导入模板.xlsx" download>模板下载</a>
      </div>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="uploadResult">
      <div class="detail-title-content">
        <img src="@/assets/img/Icon-invest.png" />
        <span>解析结果</span>
      </div>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-li-input">
          <div class="result-item">
            <span class="label">文件名：</span>
            <span class="value">{{ uploadResult.fileName }}</span>
          </div>
        </li>
        <li class="detail-list-li-input">
          <div class="result-item">
            <span class="label">物资条数：</span>
            <span class="value">{{ uploadResult.number }}</span>
          </div>
        </li>
        <li class="detail-list-li-input">
          <div class="result-item">
            <span class="label">文件大小：</span>
            <span class="value">{{ formatFileSize(uploadResult.fileSize) }}</span>
          </div>
        </li>
        <li class="detail-list-li-input">
          <div class="result-item">
            <span class="label">状态：</span>
            <span class="value" :class="{'status-success': uploadResult.status === '上传成功', 'status-fail': uploadResult.status !== '上传成功'}">{{ uploadResult.status }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="detail-base-info detail-base-info-edited" v-if="uploadResult && uploadResult.reason && uploadResult.reason.length > 0">
      <div class="detail-title-content" style="color: #fa4343;">
        <van-icon name="warning-o" size="18" style="margin-right: 5px;"/>
        <span>异常提示</span>
      </div>
      <div class="error-list-box">
        <div v-for="(item, idx) in uploadResult.reason" :key="idx" class="error-item">
          {{ idx + 1 }}. {{ item }}
        </div>
      </div>
    </div>

    <div class="default-button-container">
      <van-button class="button-info" round block type="info" @click="onConfirm" :disabled="loading">确认导入并返回</van-button>
    </div>
    
    <van-overlay :show="loading" style="display: flex; align-items: center; justify-content: center;">
      <van-loading type="spinner" color="#1989fa" vertical>正在解析...</van-loading>
    </van-overlay>
  </div>
</template>

<script>
import { batchImport } from '@/api/prodmgr-inv/SelfBuying'

export default {
  name: 'PerfectContractBatchUpload',
  data() {
    return {
      loading: false,
      uploaderList: [], // Vant uploader 绑定的文件列表
      uploadResult: null, // 存储接口返回的 data 对象
    }
  },
  computed: {
    projectId() {
      return this.$route.query.id
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    
    formatFileSize(fileSize) {
      if (!fileSize) return '0 KB'
      const sizeInMB = fileSize / (1024 * 1024)
      if (sizeInMB < 1) {
        const sizeInKB = fileSize / 1024
        return sizeInKB.toFixed(2) + ' KB'
      } else {
        return sizeInMB.toFixed(2) + ' MB'
      }
    },

    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.name.endsWith('.xlsx') || 
                      file.name.endsWith('.xls');
      const isLt100M = file.size / 1024 / 1024 < 100;

      if (!isExcel) {
        this.$toast.fail('只能上传 Excel 文件');
        return false;
      }
      if (!isLt100M) {
        this.$toast.fail('文件大小不能超过 100MB');
        return false;
      }
      return true;
    },

    handleUpload(fileDetail) {
      // fileDetail.file 是实际的 File 对象
      const formData = new FormData();
      formData.append('file', fileDetail.file);
      formData.append('projectId ', this.projectId || ''); // 注意：原代码 projectId 后面有个空格，我保留了，请确认接口是否真的需要这个空格
      
      this.loading = true;
      this.uploadResult = null; // 重置结果

      batchImport(formData).then(res => {
        if(res && res.data) {
           this.uploadResult = res.data;
           // 只要上传过，清理掉uploader显示，强制显示结果区域
           this.uploaderList = []; 
           if(this.uploadResult.reason && this.uploadResult.reason.length === 0) {
            console.log(this.uploadResult,'result')
            this.$toast.success('解析成功');
           } else {
             this.$toast.fail('解析存在异常，请查看详情');
           }
        }
      }).catch(err => {
        this.$toast.fail('上传失败');
        this.uploaderList = [];
      }).finally(() => {
        this.loading = false;
      })
    },

    onConfirm() {
      if (!this.uploadResult || !this.uploadResult.list || !this.uploadResult.list.length) {
        this.$toast('请先上传文件并确保解析成功');
        return;
      }

      if (this.uploadResult.reason && this.uploadResult.reason.length > 0) {
         this.$dialog.confirm({
          title: '提示',
          message: '当前文件存在异常提示，确认要强制导入吗？',
        }).then(() => {
           this.doReturnData();
        }).catch(() => {});
      } else {
        this.doReturnData();
      }
    },

    doReturnData() {
      // 核心：页面通信
      // 将数据存入 sessionStorage，key 建议加上 projectId 或特定标识防止冲突
      const dataToPass = this.uploadResult.list;
      sessionStorage.setItem('perfectContract_imported_details', JSON.stringify(dataToPass));
      
      this.$toast.success('导入成功');
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    }
  }
}
</script>

<style lang="less" scoped>
.batch-upload-page {
  background-color: #f5f6f7;
  padding-bottom: 80px; // 给底部按钮留位置
    display: flex;
  flex-direction: column;

  .detail-base-info-edited {
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 5px;
      padding-right: 5px;
      margin-top: 5px;
      margin-bottom: 5px;
      color: #7F8397;
      font-weight: 600;

    

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
        font-size: 13px;
      }
    }

    .detail-ul {
      padding-left: 16px;
      padding-right: 30px;
      border-top: 0.5px solid #e3e3e3;

      .detail-ul-p {
        display: flex;
        align-items: center;

        & :nth-child(1) {
          margin-right: 3px;
        }

        & :nth-child(2) {
          margin-right: 3px;
        }
      }
    }

    .detail-base-info-edited-div {
      justify-content: space-between;

      .detail-base-info-edited-img {
        display: flex;
        align-items: center;
      }
    }
  }

  .upload-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    
    .custom-upload-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 280px;
      height: 150px;
      background-color: #f7f8fa;
      border: 1px dashed #dcdee0;
      border-radius: 8px;
      
      .upload-text {
        margin-top: 10px;
        font-size: 14px;
        color: #323233;
      }
      
      .upload-tip {
        margin-top: 5px;
        font-size: 12px;
        color: #969799;
      }
    }
  }

  .template-download {
    padding: 0 20px 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  .detail-list-ul-edited {
    padding: 0 16px;
    
    .detail-list-li-input {
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }
      
      .result-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        font-size: 14px;
        
        .label {
          color: #666;
        }
        .value {
          color: #333;
          max-width: 70%;
          word-break: break-all;
          text-align: right;
          
          &.status-success {
            color: #07c160;
          }
          &.status-fail {
            color: #ee0a24;
          }
        }
      }
    }
  }

  .error-list-box {
    padding: 10px 16px 20px;
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    
    .error-item {
      font-size: 13px;
      color: #ee0a24;
      line-height: 1.5;
      margin-bottom: 4px;
    }
  }

  .default-button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    z-index: 99;
  }
}
</style>