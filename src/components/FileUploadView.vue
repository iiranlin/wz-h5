<template>
    <div>
        <div class="file-upload-title" v-if="title">
            <span class="title">{{ title }}</span>
        </div>
        <div class="file-upload-content" v-if="isFileList">
            <ul>
                <li v-for="(item, index) in fileList" :key="index">
                    <div class="file-info" :class="{ 'file-info-a': !isShowButton }">
                        <img :src="checkFileImage(item.fileName)" />
                        <span @click="previewClick(item)">{{ item.fileName }}</span>
                        <img class="file-delete" src="/static/icon_file_delete.png" @click="handleFileDelete(index)" />
                    </div>
                </li>
            </ul>
        </div>
        <div class="file-add" v-if="fileList.length < maxCount && isShowButton">
            <van-button class="button-info" type="default" round block @click="showUploadPopup = true"><img class="file-download"
                    src="@/assets/img/Icon-download.png" /><span>上传附件</span></van-button>
            <van-uploader ref="fileUploader" class="hidden-uploader" :preview-imag='false' :after-read="afterReadTransfer" :before-read="beforeRead"
                :accept="uploaderAccept || accept" multiple />
            <van-uploader ref="cameraUploader" class="hidden-uploader" :preview-imag='false' :after-read="afterReadTransfer" :before-read="beforeRead"
                accept="image/*" capture="camera" />
        </div>
        <van-popup v-model="showUploadPopup" position="bottom" round class="upload-source-popup">
            <div class="upload-source-panel">
                <div class="upload-source-title">上传附件</div>
                <div class="upload-source-subtitle">请选择上传方式</div>
                <div class="upload-source-options">
                    <button type="button" class="upload-source-option" @click="handleChooseFile">
                        <span class="upload-source-icon upload-source-icon-file"></span>
                        <span class="upload-source-text">
                            <strong>选择附件</strong>
                            <em>从手机文件或相册中选择</em>
                        </span>
                    </button>
                    <button type="button" class="upload-source-option" @click="handleTakePhoto">
                        <span class="upload-source-icon upload-source-icon-camera"></span>
                        <span class="upload-source-text">
                            <strong>拍照上传</strong>
                            <em>调用相机拍照后上传</em>
                        </span>
                    </button>
                </div>
                <button type="button" class="upload-source-cancel" @click="showUploadPopup = false">取消</button>
            </div>
        </van-popup>
        <!-- 附件预览 -->
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import { minioUpload, minioImageToPdf } from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import { compressImage } from "@/utils/index.js";
import { Notify } from 'vant';

export default {
    components: { FilePreview },

    props: {
        title: {
            type: String,
            default: '',
        },
        fileList: {
            type: Array,
            default: [],
        },
        businessType: {
            type: String,
            default: '',
        },
        maxCount: {
            type: Number,
            default: 1,
        },
        accept: {
            type: String,
            default: '.pdf',
        },
        uploaderAccept: {
            type: String,
            default: '',
        },
        isFileList: {
            type: Boolean,
            default: true,
        },
        isShowButton: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            uploadingNotify: null,  // 保存上传中的提示实例
            showUploadPopup: false,
        }
    },
    methods: {
        handleChooseFile() {
            this.showUploadPopup = false;
            this.$nextTick(() => {
                this.$refs.fileUploader && this.$refs.fileUploader.chooseFile();
            });
        },
        handleTakePhoto() {
            this.showUploadPopup = false;
            this.$nextTick(() => {
                this.$refs.cameraUploader && this.$refs.cameraUploader.chooseFile();
            });
        },
        //附件上传前
        beforeRead(file) {
            // 🔑 统一处理为数组（兼容单个文件和多个文件）
            const files = Array.isArray(file) ? file : [file];
            
            const types = this.accept.split(",");
            const extensions = this.accept.replaceAll(".", "").toUpperCase(); // PDF,JPG
            
            // 验证每个文件
            for (const f of files) {
                const fileName = f.name || (f.file && f.file.name);
                
                if (!fileName) {
                    this.$notify({
                        type: 'warning',
                        message: '文件格式错误，请重新选择',
                    });
                    return false;
                }
                
                // 验证文件类型
                const fileExt = `.${fileName.split('.').pop().toLowerCase()}`;
                if (!types.includes(fileExt)) {
                    this.$notify({
                        type: 'warning',
                        message: `仅支持上传 ${extensions} 文件!`,
                    });
                    return false;
                }
                
                // 验证文件大小
                const fileSize = f.size || (f.file && f.file.size);
                
                
                // 检查文件是否为空
                if (fileSize === 0) {
                    this.$notify({
                        type: 'warning',
                        message: `文件"${fileName}"大小为0，不允许上传`,
                    });
                    return false;
                }
                
                // 检查文件是否超过500MB
                const fileSizeMB = fileSize / 1024 / 1024;
                if (fileSizeMB >= 500) {
                    this.$notify({
                        type: 'warning',
                        message: `文件"${fileName}"大小为 ${fileSizeMB.toFixed(2)}MB，超过500MB限制`,
                    });
                    return false;
                }
                
                // 验证文件名长度
                const isFileName = fileName.length < 90;
                if (!isFileName) {
                    this.$notify({
                        type: 'warning',
                        message: '上传文件名过长!',
                    });
                    return false;
                }
            }
            
            return true;
        },
        //校验附件上传
        async afterReadTransfer(files) {
            // 🔑 统一处理为数组（兼容单个文件和多个文件）
            const fileList = Array.isArray(files) ? files : [files];
            const totalCount = fileList.length;
            
            console.log(`[多文件上传] 开始上传 ${totalCount} 个文件`);
            
            // 显示开始提示（一直显示，直到上传完成）
            if (totalCount > 1) {
                this.uploadingNotify = this.$notify({ 
                    type: 'primary', 
                    message: `开始上传 ${totalCount} 个文件，上传未完成请勿上传其他文件`,
                    duration: 0  // 持续显示，不自动消失
                });
            }
            
            let successCount = 0;
            let failCount = 0;
            const failedFiles = []; // 记录失败的文件名
            
            // 依次上传每个文件
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const currentIndex = i + 1;
                const fileName = file.file.name;
                
                console.log(`[多文件上传] 正在上传第 ${currentIndex}/${totalCount} 个文件: ${fileName}`);
                
                // 显示上传进度
                const Toast = this.$toast.loading({
                    message: `上传中 ${currentIndex}/${totalCount}...\n${fileName}`,
                    duration: 0,
                    forbidClick: true,
                });
                
                try {
                    file.status = 'uploading';
                    file.message = '上传中...';
                    
                    const fileType = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
                    const imageTypes = ['jpg', 'jpeg', 'png', 'bmp'];
                    
                    // 压缩配置
                    const compressConfig = {
                        limitSizeMB: 0,  // >20MB 才压缩, 设置 0 表示所有文件都压缩
                        quality: 0.1      // 压缩比 80%
                    };
                    
                    // 压缩处理（可选）
                    let processedFile = file.file;
                    if (imageTypes.includes(fileType)) {
                        processedFile = await compressImage(file.file, compressConfig);
                    }
                    
                    // 构建上传数据
                    let formData = new FormData();
                    formData.append("file", processedFile);
                    formData.append("businessType", this.businessType);
                    formData.append("key", processedFile.name);
                    
                    // 选择上传 API
                    const uploadApi = imageTypes.includes(fileType) ? minioImageToPdf : minioUpload;
                    
                    // 上传文件
                    const { data } = await uploadApi(formData);
                    
                    // 上传成功
                    let uploadedFile = { 
                        fileName: data.fileName, 
                        filePath: data.filePath || data.path 
                    };
                    this.fileList.push(uploadedFile);
                    successCount++;
                    
                    console.log(`[多文件上传] ✅ 第 ${currentIndex}/${totalCount} 个文件上传成功`);
                    
                    // 单个文件上传成功提示（仅在上传单个文件时）
                    if (totalCount === 1) {
                        this.$notify({ type: 'success', message: "上传成功" });
                    }
                    
                } catch (error) {
                    failCount++;
                    failedFiles.push(fileName);
                    console.error(`[多文件上传] ❌ 第 ${currentIndex}/${totalCount} 个文件上传失败: ${fileName}`, error);
                    
                    // 单个文件上传失败提示
                    this.$notify({ 
                        type: 'warning', 
                        message: `${fileName} 上传失败`,
                        duration: 2000
                    });
                } finally {
                    Toast.clear();
                }
                
                // 延时，避免触发重复提交检测（H5端有1秒限制）
                if (i < fileList.length - 1) {
                    console.log('[多文件上传] 等待 1500ms 后上传下一个文件');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
            
            // 所有文件上传完成，显示汇总结果
            console.log(`[多文件上传] 全部完成：成功 ${successCount}，失败 ${failCount}`);
            
            // 关闭开始上传的提示
            if (this.uploadingNotify) {
                Notify.clear();  // 使用 Vant 的静态方法关闭所有通知
                this.uploadingNotify = null;
            }
            
            if (totalCount > 1) {
                if (failCount === 0) {
                    this.$notify({ 
                        type: 'success', 
                        message: `✅ 成功上传 ${successCount} 个文件`,
                        duration: 3000
                    });
                } else if (successCount > 0) {
                    this.$notify({ 
                        type: 'warning', 
                        message: `上传完成：成功 ${successCount} 个，失败 ${failCount} 个\n失败文件：${failedFiles.join(', ')}`,
                        duration: 4000
                    });
                } else {
                    this.$notify({ 
                        type: 'danger', 
                        message: `全部上传失败（${failCount} 个）`,
                        duration: 3000
                    });
                }
            }
        },
        //匹配附件图标
        checkFileImage(fileName) {
            let type = fileName.substr(fileName.lastIndexOf('.') + 1);

            if (type == 'xlsx' || type == 'xls') {
                return '/static/file-excel.png'
            } else if (type == 'pdf') {
                return '/static/file-pdf.png'
            } else if (type == 'jpg' || type == 'png' || type == 'jpeg' || type == 'bmp') {
                return '/static/file-img.png'
            } else if (type == 'docx' || type == 'doc') {
                return '/static/file-doc.png'
            } else if (type == 'txt') {
                return '/static/file-txt.png'
            } else if (type == 'ppt') {
                return '/static/file-ppt.png'
            } else {
                return '/static/file-txt.png'
            }
        },
        //附件删除
        handleFileDelete(index) {
            this.fileList.splice(index, 1)
        },
        //预览点击
        previewClick(item) {
            this.$refs.filePreview.init(item.fileName, item.filePath)
        },
    },
    
    mounted() {
        console.log('[FileUploadView] 组件挂载（新版H5队列管理）');
    },
    
    beforeDestroy() {
        console.log('[FileUploadView] 组件销毁（新版H5队列管理）');
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
        // color: #0571ff;
        margin-left: 10px;
        // font-weight: 600;
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

.file-info-a {
    margin-left: 20px;
    margin-right: 20px;
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

    .van-button__text {
        span {
            vertical-align: middle;
        }

        .file-download {
            width: 24px;
            height: 24px;
            vertical-align: middle;
        }
    }

    .hidden-uploader {
        width: 0;
        height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
    }
}

.upload-source-popup {
    background: transparent;
}

.upload-source-panel {
    padding: 18px 18px 12px;
    background: #fff;
    border-radius: 16px 16px 0 0;
    box-sizing: border-box;
}

.upload-source-title {
    font-size: 18px;
    line-height: 25px;
    font-weight: 600;
    color: #111827;
    text-align: center;
}

.upload-source-subtitle {
    margin-top: 4px;
    margin-bottom: 14px;
    font-size: 13px;
    line-height: 18px;
    color: #8a94a6;
    text-align: center;
}

.upload-source-options {
    display: flex;
    flex-direction: column;
}

.upload-source-option {
    width: 100%;
    min-height: 68px;
    border: 1px solid #e6edf7;
    border-radius: 10px;
    background: #f8fbff;
    display: flex;
    align-items: center;
    padding: 12px;
    box-sizing: border-box;
    text-align: left;
}

.upload-source-option + .upload-source-option {
    margin-top: 10px;
}

.upload-source-option:active {
    background: #eef6ff;
}

.upload-source-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    position: relative;
    flex: 0 0 40px;
}

.upload-source-icon-file {
    background: #eaf3ff;
}

.upload-source-icon-file::before {
    content: '';
    width: 18px;
    height: 22px;
    border: 2px solid #0571ff;
    border-radius: 3px;
    position: absolute;
    left: 10px;
    top: 8px;
    box-sizing: border-box;
}

.upload-source-icon-file::after {
    content: '';
    width: 9px;
    height: 2px;
    background: #0571ff;
    position: absolute;
    left: 15px;
    top: 18px;
    box-shadow: 0 5px 0 #0571ff;
}

.upload-source-icon-camera {
    background: #eaf8f1;
}

.upload-source-icon-camera::before {
    content: '';
    width: 22px;
    height: 16px;
    border: 2px solid #12a86b;
    border-radius: 5px;
    position: absolute;
    left: 9px;
    top: 13px;
    box-sizing: border-box;
}

.upload-source-icon-camera::after {
    content: '';
    width: 7px;
    height: 7px;
    border: 2px solid #12a86b;
    border-radius: 50%;
    position: absolute;
    left: 16px;
    top: 17px;
    box-sizing: border-box;
}

.upload-source-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.upload-source-text strong {
    font-size: 15px;
    line-height: 21px;
    color: #1f2937;
    font-weight: 600;
}

.upload-source-text em {
    margin-top: 3px;
    font-size: 12px;
    line-height: 17px;
    color: #8a94a6;
    font-style: normal;
}

.upload-source-cancel {
    width: 100%;
    height: 44px;
    margin-top: 12px;
    border: 0;
    border-radius: 22px;
    background: #f2f4f7;
    color: #4b5563;
    font-size: 15px;
}

.upload-source-cancel:active {
    background: #e8ebf0;
}

.file-add-a {
    display: none;
}
</style>
