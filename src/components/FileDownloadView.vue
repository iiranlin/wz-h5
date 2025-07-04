<template>
    <div>
        <div class="file-download-title">
            <span class="title">{{uploadTitle}}</span>
        </div>
        <div>
            <ul>
                <li v-for="(item,index) in fileList" :key="index">
                    <div class="file-info">
                        <img :src="checkFileImage(item.fileName)"/>
                        <span @click="previewClick(item)">{{item.fileName}}</span>
                        <img class="file-delete" src="/static/icon_file_download.png" @click="handleFileDwonLoad(index)"/>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 附件预览 -->
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import {minioDownload} from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";

export default {
    components: {FilePreview},

    props: {
        uploadTitle:{
            type: String,
            default: '',
        },
        fileList:{
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            
        }
    },
    methods:{
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
        handleFileDwonLoad(index){
            
        },
        //预览点击
        previewClick(item){
            this.$refs.filePreview.init(item.fileName, item.filePath)
        },
    },
}
</script>
<style lang="less" scoped>
.file-download-title {
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 25px;

    .title {
        font-size: 14px;
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
.file-info {
    box-sizing: border-box;
    min-height: 50px;
    background: #f6f6f6;
    border-radius: 3px;
    margin-left: 25px;
    display: flex;
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
</style>