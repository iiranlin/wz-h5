<template>
  <div class="app">
    <div v-if="fileType == 'img' && showType">
      <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false" />
    </div>
    <div v-if="fileType == 'pdf' && showType">
      <div class="pass_bullet_mark" @click.self="handleClose">
        <div class="pass_bullet">
          <div class="pass_bottom">
            <div class="pdfContainer">
              <div class="pdf">
                <pdf ref="pdf" :src="pdfUrl" :page="currentPage" :rotate="pageRotate" @num-pages="pageCount = $event"
                  @page-loaded="currentPage = $event" @loaded="loadPdfHandler"></pdf>
              </div>
          </div>
        </div>
      </div>
      <div class="pdf-button-container" @click.self="handleClose">
        <van-button native-type="button" type="success" @click="prev()">上一页</van-button>
        <van-button native-type="button" type="success" @click="next()">下一页</van-button>
      </div>
    </div>
    </div>
    <div v-if="fileType == 'excel' && showType">
      <div class="pass_bullet_mark" @click.self="handleClose">
        <div class="pass_bullet">
          <div class="pass_bottom">
            <vue-office-excel :src="excelUrl" style="border: none;width: 96vw;height: 80vh;" @rendered="renderedHandler"
              @error="errorHandler" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="fileType == 'word' && showType">
      <div class="pass_bullet_mark" @click.self="handleClose">
        <div class="pass_bullet">
          <div class="pass_bottom">
            <div class="docx-container">
              <div ref="file"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueOfficeExcel from '@vue-office/excel'
import Pdf from "vue-pdf";
//引入相关样式
import '@vue-office/excel/lib/index.css'
import { renderAsync } from 'docx-preview'
import { minioDownload } from '@/api/blcd-base/minio'

export default {
  components: { VueOfficeExcel, Pdf },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      scale: 100,  //  开始的时候默认和容器一样大即宽高都是100%
      pageRotate: 0,  // 旋转角度
      startPosition: 0,

      pdfUrl: "",
      images: [],
      excelUrl: '',
      showType: false,
      showImg: false,
      fileType: ''
    };
  },
  methods: {
    init(fileName, filePath) {
      let type = fileName.substr(fileName.lastIndexOf('.') + 1);
      if (type == 'xlsx') {
        this.fileType = 'excel';
        this.showXlsx(fileName, filePath)
      } else if (type == 'pdf') {
        this.fileType = 'pdf';
        this.showPdf(fileName, filePath)
      } else if (type == 'jpg' || type == 'png' || type == 'jpeg' || type == 'bmp') {
        this.fileType = 'img';
        this.showImage(fileName, filePath);
      } else if (type == 'docx') {
        this.fileType = 'word';
        this.showWord(fileName, filePath)
      } else {
        this.$notify({
          type: 'warning',
          message: "该文件类型暂不支持查看"
        });
      }
    },
    //预览pdf
    showPdf(fileName, filePath) {
      this.showType = true;

      minioDownload({ fileName, filePath }).then((data) => {
        let url = window.URL.createObjectURL(new Blob([data]));
        this.pdfUrl = url;
      })
    },
    //预览excel
    showXlsx(fileName, filePath) {
      this.showType = true;

      minioDownload({ fileName, filePath }).then((data) => {
        let url = window.URL.createObjectURL(new Blob([data]));
        this.excelUrl = url;
      }).catch((err) => {

      })
    },
    //预览图片
    async showImage(fileName, filePath) {
      minioDownload({ fileName, filePath }).then((data) => {
        let url = window.URL.createObjectURL(new Blob([data]));
        this.images.push(url);
      })
      this.showType = true;
      this.showImg = true;
    },
    //预览word
    showWord(fileName) {
      minioDownload({ fileName, filePath }).then((data) => {

        this.$nextTick(() => {
          renderAsync(data, this.$refs.file, null);

          setTimeout(() => {
            this.showType = true
          }, 30)
        })
      }).catch((err) => {

      })
    },
    //pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
      this.$refs.pdf.$el.style.width = parseInt(this.scale) + "%";
      this.$refs.pdf.$el.style.height = parseInt(this.scale) + "%";
    },
    //上一页
    prev() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    //下一页
    next() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    //关闭
    handleClose() {
      this.showType = false;
    },
    rendered() {
      console.log("渲染完成")
    },
    renderedHandler() {
      console.log("渲染完成")
    },
    errorHandler() {
      this.showType = false;
      this.$notify({
        type: 'warning',
        message: "该文件暂无法查看"
      });
      console.log("渲染失败")
    },
    //回调
    noLoading() {
      this.$emit("noLoading")
    },
  },
};
</script>
<style lang="less" scoped>
#app {

  .pass_bullet_mark {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    z-index: 10;

    .pass_bullet {
      width: 90%;
      height: 80%;
      box-shadow: 0px -5px 10px 0px rgba(13, 36, 105, 0.22);
      border-radius: 8px;
      z-index: 20;
      background: #FFFFFF;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow-y: auto;

      // .close_btn {
      //   margin-top: 20px;
      //   width: 100%;
      // }
    }
  }
}

.imgContainer {
  max-width: 98%;
  max-height: 85%;
}

.pdfContainer {
  width: 98%;
  height: 85%;
}
.pdf-button-container {
  position: absolute;
  bottom: 15px;
  width: 100%;
  height: 30px;
  display: flex;
  align-items:center;
  justify-content: center;

  .van-button {
    width: 80px;
    height: 30px;
    margin-right: 20px;
  }
}

.docx-container ::v-deep .docx-wrapper {
  background-color: #fff;
  padding: 20px 20px;
  height: 80% !important;
  width: 85% !important;
}

.docx-container ::v-deep .docx-wrapper>section.docx {
  width: 85% !important;
  padding: 0 !important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
  overflow-y: scroll;
  height: 80%;
}

.docx-container ::v-deep .docx-wrapper>section.docx::-webkit-scrollbar {
  display: none;
}
</style>