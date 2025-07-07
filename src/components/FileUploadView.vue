<template>
    <div>
        <div class="file-upload-title">
            <span class="title">{{title}}</span>
        </div>
        <div class="file-upload-content">
            <ul>
                <li v-for="(item,index) in fileList" :key="index">
                    <div class="file-info">
                        <img :src="checkFileImage(item.fileName)"/>
                        <span @click="previewClick(item)">{{item.fileName}}</span>
                        <img class="file-delete" src="/static/icon_file_delete.png" @click="handleFileDelete(index)"/>
                    </div>
                </li>
            </ul>
        </div>
        <div class="file-add" v-if="fileList.length < maxCount">
            <van-uploader 
                :preview-imag='false'
                :after-read="afterReadTransfer"
                :before-read="beforeRead"
                :accept="accept">
                <van-button class="button-info" icon="plus" type="default" round block>上传文件</van-button>
            </van-uploader>
        </div>
        <!-- 附件预览 -->
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import {minioUpload} from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";

export default {
    components: {FilePreview},

    props: {
        title:{
            type: String,
            default: '',
        },
        fileList:{
            type: Array,
            default: [],
        },
        businessType:{
            type: String,
            default: '',
        },
        maxCount:{                 
            type: Number,
            default: 1,
        },
        accept:{
            type: String,
            default: '',
        }
    },
    data() {
        return {
            
        }
    },
    methods:{
        //附件上传前
        beforeRead(file){
            const isLt10M = file.size / 1024 / 1024 < 10;
            const isFileName = file.name.length < 90;

            if (!isLt10M) {
                this.$notify({
                    type: 'warning',
                    message: '上传文件大小不能超过 10MB!',
                });
                return false;
            }
            if (!isFileName) {
                this.$notify({
                    type: 'warning',
                    message: '上传文件名过长!',
                });
                return false;
            }
            return true;
        },
        //校验附件上传
        afterReadTransfer(file){
            let formData = new FormData();
            formData.append("file", file.file);
            formData.append("businessType",this.businessType);
            formData.append("key",file.file.name);
            
            file.status = 'uploading';
            file.message = '上传中...';

            minioUpload(formData).then(({data}) => {
                this.$notify({
                    type: 'success',
                    message: "上传成功"
                });
                let file = {
                    fileName: data.fileName,
                    filePath: data.filePath,
                }
                this.fileList.push(file);
            }).catch((err) => {
                this.$notify({
                    type: 'warning',
                    message: "上传失败"
                });
            })
        },
         //匹配附件图标
        checkFileImage(fileName){
            let type = fileName.substr(fileName.lastIndexOf('.') + 1);

            if(type == 'xlsx' || type =='xls'){
                return '/static/file-excel.png'
            }else if(type == 'pdf'){
                return '/static/file-pdf.png'
            }else if(type == 'jpg' || type == 'png' || type == 'jpeg' || type == 'bmp'){
                return '/static/file-img.png'
            }else if(type == 'docx' || type == 'doc'){
                return '/static/file-doc.png'
            }else if(type == 'txt'){
                return '/static/file-txt.png'
            }else if(type == 'ppt'){
                return '/static/file-ppt.png'
            }else{
                return '/static/file-txt.png'
            }
        },
        //附件删除
        handleFileDelete(index){
            this.fileList.splice(index, 1)
        },
        //预览点击
        previewClick(item){
            this.$refs.filePreview.init(item.fileName, item.filePath)
        },
    },
}
</script>
<style lang="less" scoped>
.file-upload-title {
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 25px;

    .title {
        font-size: 13px;
        color: #1c1c1c;
        font-weight: 600;
    }
    .title::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 25%;
        background: #028bff;
        position: absolute;
        left: 10px;
        top: 18px;
    }
}
.file-upload-content {
    box-sizing: border-box;
    padding-bottom: 5px;
}
.file-info {
    box-sizing: border-box;
    min-height: 50px;
    background: #f6f6f6;
    border-radius: 3px;
    display: flex;
    margin-left: 25px;
    margin-right: 16px;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    padding-top: 5px;
    padding-bottom: 5px;

    img {
        width: 36px;
        height: 36px;
        margin-left: 10px;
    }
    span {
        font-size: 14px;
        color: #0571ff;
        margin-left: 10px;
        font-weight: 600;
        margin-right: 35px;
        word-break: break-all;
    }
    .file-delete {
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0px;
    }
}
.file-add {
    text-align: center;
    margin: 0px 45px 0px 45px;
    padding-bottom: 20px;

    ::v-deep .van-uploader {
        width: 100%;
    }
    ::v-deep .van-uploader__input-wrapper {
        width: 100%;
    }
    ::v-deep .van-button {
        height: 36px;
    }
}
</style>