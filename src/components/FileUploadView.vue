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
            <van-uploader :preview-imag='false' :after-read="afterReadTransfer" :before-read="beforeRead"
                :accept="accept">
                <van-button class="button-info" type="default" round block><img class="file-download"
                        src="@/assets/img/Icon-download.png" /><span>上传附件</span></van-button>
            </van-uploader>
        </div>
        <!-- 附件预览 -->
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import { minioUpload, minioImageToPdf, getOssStsToken } from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import { compressPDF, compressImage } from "@/utils/index.js";
import OSS from "ali-oss";

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
        // 🔹 新增阿里云参数
        useOss: { type: Boolean, default: false },
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
            // 上传进度
            uploadProgress: 0,
            // OSS客户端实例
            ossClient: null,
            // STS临时凭证缓存
            stsCredentials: null,
            // STS凭证过期时间
            stsExpiration: null,
            // OSS配置
            ossConfig: {
                bucket: "yc-mat",
                region: 'cn-beijing',
                secure: true,
                endpoint: 'https://oss-cn-beijing.aliyuncs.com'
            }
        }
    },
    methods: {
        /**
 * 获取或刷新STS临时凭证
 * @returns {Promise<Object>} STS凭证对象
 */
        async getStsCredentials() {
            try {
                // 从后端API获取STS凭证
                const response = await getOssStsToken();
                if (!response.success) {
                    throw new Error(response.message || '获取STS凭证失败');
                }
                const credentials = JSON.parse(response.data);

                // 缓存凭证和过期时间（STS凭证通常有效期为1小时）
                this.stsCredentials = credentials
                return this.stsCredentials;
            } catch (error) {
                console.error('获取STS凭证失败:', error);
                throw new Error('获取OSS上传凭证失败，请重试');
            }
        },

        /**
         * 创建或更新OSS客户端
         * @returns {Promise<OSS>} OSS客户端实例
         */
        async getOssClient() {
            try {
                const credentials = await this.getStsCredentials();

                // 创建新的OSS客户端实例
                this.ossClient = new OSS({
                    ...this.ossConfig,
                    accessKeyId: credentials.accessKeyId,
                    accessKeySecret: credentials.secretAccessKey,
                    stsToken: credentials.securityToken
                });

                return this.ossClient;
            } catch (error) {
                console.error('创建OSS客户端失败:', error);
                throw error;
            }
        },
        //附件上传前
        beforeRead(file) {
            const types = this.accept.split(",");

            const extensions = this.accept.replaceAll(".", "").toUpperCase()// PDF,JPG
            if (!types.includes(`.${file.name.split('.').pop().toLowerCase()}`)) {
                this.$notify({
                    type: 'warning',
                    message: `仅支持上传 ${extensions} 文件!`,
                });
                return false;
            }
            const isLt500M = file.size / 1024 / 1024 < 500;
            const isFileName = file.name.length < 90;

            if (!isLt500M) {
                this.$notify({
                    type: 'warning',
                    message: '上传文件大小不能超过 500MB!',
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
        async afterReadTransfer(file) {

            file.status = 'uploading';
            file.message = '上传中...';
            const Toast = this.$toast.loading({
                message: '上传中...',
                duration: 0,
                forbidClick: true,
            });

            this.uploadProgress = 0; // 重置进度

            try {
                if (this.useOss) {
                    // 🔹 走 OSS STS 上传逻辑
                    const ossClient = await this.getOssClient();

                    // 生成OSS Key
                    const ossKey = `${this.businessType}/${Date.now()}_${file.file.name}`;

                    // 使用分片上传，支持大文件和断点续传
                    await ossClient.multipartUpload(ossKey, file.file, {
                        progress: (p) => {
                            // 更新上传进度
                            this.uploadProgress = Math.floor(p * 100);
                        },
                        partSize: 1024 * 1024, // 1MB分片大小
                        parallel: 4, // 并发上传数
                        meta: {
                            businessType: this.businessType,
                            uploadTime: new Date().toISOString()
                        }
                    });

                    // 构造与MinIO兼容的数据结构
                    // 手动拼接OSS文件URL地址（OSS上传成功后不返回完整URL，需要手动拼接）
                    const ossFileUrl = `https://${this.ossConfig.bucket}.${this.ossConfig.endpoint.replace('https://', '')}/${ossKey}`;

                    this.$notify({ type: 'success', message: "上传成功" });
                    let fileObj = {
                        fileName: file.file.name,
                        filePath: ossFileUrl, // 使用工具函数拼接的OSS URL，保持与MinIO数据结构一致
                        ossKey: ossKey,
                        uploadType: 'oss' // 标识上传类型，便于后续区分处理
                    };
                    this.fileList.push(fileObj);
                } else {
                    // 🔹 走 MinIO 上传逻辑

                    const fileName = file.file.name;
                    const fileType = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
                    const imageTypes = ['jpg', 'jpeg', 'png', 'bmp'];

                    // 压缩配置
                    const compressConfig = {
                        limitSizeMB: 0,  // >20MB 才压缩, 设置 0 表示所有文件都压缩
                        quality: 0.1      // 压缩比 80%
                    };

                    let processedFile = file.file;
                    if (imageTypes.includes(fileType)) {
                        processedFile = await compressImage(file.file, compressConfig);
                    }
                    // else if (fileType === 'pdf') {
                    //     processedFile = await compressPDF(file.file, compressConfig);
                    // }

                    let formData = new FormData();
                    formData.append("file", processedFile);
                    formData.append("businessType", this.businessType);
                    formData.append("key", processedFile.name);

                    const uploadApi = imageTypes.includes(fileType) ? minioImageToPdf : minioUpload;

                    uploadApi(formData).then(({ data }) => {
                        this.$notify({ type: 'success', message: "上传成功" });
                        let file = { fileName: data.fileName, filePath: data.filePath };
                        this.fileList.push(file);
                    }).catch(() => {
                        this.$notify({ type: 'warning', message: "上传失败" });
                    }).finally(() => {
                        Toast.clear();
                    });
                }
            } catch (error) {
                this.$notify({ type: 'warning', message: "上传失败" });
            } finally {
                Toast.clear();
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
            this.$refs.filePreview.init(item.fileName, item.filePath, item?.uploadType)
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
}

.file-add-a {
    display: none;
}
</style>