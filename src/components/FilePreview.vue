<template>
    <div class="app">
        <div v-show="fileType == 'img' && showType">
            <van-image-preview v-model="showImg" :images="images" :startPosition="startPosition" :loop="false"/>
        </div>
        <div v-show="fileType == 'pdf' && showType">
            <div class="pass_bullet_mark" @click.self="handleClose">
                <div class="pass_bullet">
                    <div class="pass_bottom">
                        <div class="pdfContainer">
                            <div class="pdf">
                                <pdf ref="pdf" :src="pdfUrl" :page="currentPage" :rotate="pageRotate"
                                    @num-pages="pageCount = $event" @page-loaded="currentPage = $event"
                                    @loaded="loadPdfHandler"></pdf>
                            </div>
                            <div class="button">
                                <button type="success" @click="prev()">上一页</button>
                                <button type="success" @click="next()">下一页</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="fileType == 'excel' && showType">
            <div class="pass_bullet_mark" @click.self="handleClose">
                <div class="pass_bullet">
                    <div class="pass_bottom">
                        <vue-office-excel 
                            :src="excelUrl" 
                            style="border: none;width: 96vw;height: 80vh;"
                            @rendered="renderedHandler" 
                            @error="errorHandler" />
                    </div>
                </div>
            </div>
        </div>
        <div v-show="fileType == 'word' && showType">
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
import { minioDownload } from '@/api/carRental';
import { ImagePreview  } from 'vant';
import 'vant/es/image-preview/style';

export default {
    components: {
        VueOfficeExcel,
        Pdf,
        ImagePreview,
    },
    props: {
        fileType: {
            type: String,
            default: '',
        },
    },
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
            showType:false,
            showImg:false,
        };
    },
    methods: {
        //预览pdf
        showPdf(fileName) {
            this.showType = true;
            
            minioDownload(fileName).then((data) => {
                let url = window.URL.createObjectURL(new Blob([data]));
                this.pdfUrl = url;
            }).catch((err) => {
                
            })
        },
        //预览excel
        showXlsx(fileName) {
            this.showType = true;
            
            minioDownload(fileName).then((data) => {
                let url = window.URL.createObjectURL(new Blob([data]));
                this.excelUrl = url;
            }).catch((err) => {
                
            })
        },
        //预览图片
        async showImage(imgItem,dataList) {
            await dataList.forEach((item) => {
                minioDownload(item.fileName).then((data) => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    this.images.push(url);
                }).catch((err) => {
                    
                })
            })
            this.startPosition = dataList.findIndex((item) => {
                return imgItem.fileName == item.fileName;
            });
            this.showType = true;
            this.showImg = true;
        },
        //预览word
        showWord(fileName) {
            minioDownload(fileName).then((data) => {

                this.$nextTick(() => {
                    renderAsync(data,this.$refs.file,null);

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
        handleClose(){
            this.fileType = '';
            this.showType = false;
        },
        rendered() {
            console.log("渲染完成")
        },
        renderedHandler() {
            console.log("渲染完成")
        },
        errorHandler() {
            this.fileType = '';
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
            width: 670rpx;
            height: 578rpx;
            box-shadow: 0px -5rpx 10rpx 0rpx rgba(13, 36, 105, 0.22);
            border-radius: 8rpx;
            z-index: 20;
            background: #FFFFFF;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .close_btn {
                margin-top: 20px;
                width: 100%;
            }
        }
    }
}
.imgContainer {
    max-width: 98vw;
    max-height:  85vh;
}
.pdfContainer {
    width: 98vw;
    height: 85vh;

    .button {
        position: absolute;
        top: 77vh;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
            margin-right: 10px;
        }
    }
}
.docx-container ::v-deep .docx-wrapper {
    background-color: #fff;
    padding: 20px 20px;
    height: 80vh !important;
    width: 85vw !important;
}

.docx-container ::v-deep .docx-wrapper>section.docx {
    width: 85vw !important;
    padding: 0rem !important;
    min-height: auto !important;
    box-shadow: none;
    margin-bottom: 0;
    overflow-y: scroll;
    height: 80vh;
}

.docx-container ::v-deep .docx-wrapper>section.docx::-webkit-scrollbar {
    display: none;
}
</style>