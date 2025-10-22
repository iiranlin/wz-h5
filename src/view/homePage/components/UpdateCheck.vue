    <template>
        <div>
            <!-- "智能更新" 弹窗 (Vant Dialog) -->
            <van-dialog v-model="showSmartUpdate" :title="`发现新版本`" :message="versionInfo.updateDescription"
                message-align="left"  confirm-button-text="立即更新" :show-confirm-button="false"
                :close-on-click-overlay="false" :show-cancel-button="false"  >
                <div class="force-update-content">
                    <p>您当前版本过旧，必须升级才能继续使用</p>
                    <p class="update-description">{{ versionInfo.updateDescription }}</p>
                    <!-- 关键：这是一个标准的HTML下载链接，样式化成一个按钮 -->
                    <div class="force-update-button" @click="handleSmartUpdateConfirm">
                        立即下载更新
                    </div>
                    <p class="update-tip">
                        下载完成后，请在手机顶部通知栏点击安装
                    </p>
                </div>
            </van-dialog>

            <!-- “强制更新” 弹窗 (Vant Dialog) -->
            <van-dialog v-model="showForceUpdate" title="发现重大版本更新" :show-cancel-button="false"
                :show-confirm-button="false" :close-on-click-overlay="false">
                <div class="force-update-content">
                    <p>您当前版本过低，升级后才能继续使用。</p>
                    <p class="update-description">{{ versionInfo.updateDescription }}</p>
                    <!-- 关键：这是一个标准的HTML下载链接，样式化成一个按钮 -->
                    <div class="force-update-button">
                        立即下载更新
                    </div>
                    <p class="update-tip">
                        下载完成后，请在手机顶部通知栏找到文件并点击安装。
                    </p>
                </div>
            </van-dialog>
            <van-overlay :show="isLoading" >
                <div class="loading-wrapper">
                    <van-loading size="24px" vertical>正在下载更新，请稍候...</van-loading>
                </div>
            </van-overlay>
        </div>
    </template>

<script>
import { Dialog, Overlay, Loading } from 'vant';
import Vue from 'vue';
Vue.use(Dialog);
Vue.use(Overlay);
Vue.use(Loading);

export default {
    dicts: ['currency'],
    data() {
        return {
            isLoading: false,
            // 控制“智能更新”弹窗的显示
            showSmartUpdate: false,
            // 控制“强制更新”弹窗的显示
            showForceUpdate: false,
            // 从服务器获取的版本信息
            versionInfo: {
                latestVersionCode: 0,
                updateDescription: '',
                downloadUrl: '',
            },
        };
    },
    mounted() {
        console.log('UpdateChecker 组件已挂载，开始检查更新...');
        // 组件加载后，延迟一点执行更新检查，以确保原生App的JSBridge已经准备好
        setTimeout(this.initiateUpdateCheck, 1500);
    },
    methods: {
        // onDownload() {
        //     try {
        //         const url = this.versionInfo.downloadUrl;

        //         axios.get(url, {
        //             responseType: 'blob',
        //         }).then(response => {
        //             const blob = new Blob([response.data])
        //             console.log(isAndroid())
        //             if (isAndroid()) {
        //                 let reader = new FileReader()
        //                 reader.readAsDataURL(blob)
        //                 reader.onloadend = function () {
        //                     const base64data = reader.result
        //                     Android.getBase64FromBlobData(base64data, '更新安装包.apk')
        //                 }
        //             }
        //         })
        //     } catch (e) {
        //         console.log(e)
        //     }
        // },
        /**
         * 核心方法：开始执行更新检查
         */
        async initiateUpdateCheck() {
            // 1. 定义你的版本检查接口地址
            // const versionApiUrl = 'https://your-server.com/path/to/version.json';
            try {
                // 2. 从服务器获取最新版本信息
                // const response = await fetch(versionApiUrl, { cache: 'no-cache' });
                // if (!response.ok) {
                //     console.error('获取版本信息失败:', response.statusText);
                //     return;
                // }
                // const latestVersionInfo = await response.json();
                // // 将版本描述中的换行符 \n 替换为 <br> 以便HTML正确显示
                // latestVersionInfo.updateDescription = latestVersionInfo.updateDescription.replace(/\\n/g, '\n');
                // this.versionInfo = latestVersionInfo;
                const latestVersionInfo = JSON.parse(this.dict.currency.find(x => x.code === 'androidVersion')?.remark || '{}');
                console.log('获取版本信息',latestVersionInfo)
                this.versionInfo = latestVersionInfo;
                // 3. 从原生App获取当前版本信息
                let currentVersionCode = 0;
                if (window.Android && typeof window.Android.getVersionCode === 'function') {
                    currentVersionCode = window.Android.getVersionCode();
                    console.log(currentVersionCode)
                } else {
                    console.warn('无法获取当前App版本号，判定为旧版。');
                }

                console.log(`最新版本: ${latestVersionInfo.latestVersionCode}, 当前版本:  ${currentVersionCode}`);

                // 4. 比较版本，决策是否更新
                if (latestVersionInfo.latestVersionCode > currentVersionCode) {
                    console.log('需要更新！');
                    // 5. 探测环境，判断是“智能版”还是“哑巴版”
                    if (window.UpdateAndroidBridge && typeof window.UpdateAndroidBridge?.startDownload === 'function') {
                        // a. 是“智能版”：显示Vant的智能更新弹窗
                        console.log('检测到新版App环境，执行智能更新。');
                        this.showSmartUpdate = true;
                    } else {
                        // b. 是“哑巴版”：显示Vant的强制手动更新弹窗
                        console.log('检测到旧版App环境，执行强制更新。');
                        // this.showForceUpdate = true;
                    }
                } else {
                    console.log('当前已是最新版本。');
                }
            } catch (error) {
                console.error('更新检查过程中发生错误:', error);
            }
        },

        /**
         * “智能更新”弹窗的确认按钮点击事件
         */
        handleSmartUpdateConfirm() {
            console.log('用户点击了“立即更新”，调用原生下载...');
            this.isLoading = true;
            // 调用我们预留的新版更新接口
            window.UpdateAndroidBridge.startDownload(this.versionInfo.downloadUrl);
            this.showSmartUpdate = false; // 点击后关闭弹窗
        },

        /**
         * 原生App下载完成后调用此方法
         */
        onDownloadComplete() {
            this.isLoading = false;
        },
    },
};
</script>

<style scoped>
.loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.force-update-content {
    padding: 16px 24px 24px;
    text-align: center;
}

.force-update-content p {
    margin: 0;
    color: #646566;
    font-size: 14px;
    line-height: 20px;
}

.force-update-content .update-description {
    margin-top: 16px;
    margin-bottom: 24px;
    text-align: left;
    white-space: pre-wrap;
    /* 保留换行符 */
}

.force-update-content .force-update-button {
    display: block;
    width: 100%;
    padding: 10px 0;
    background-color: #ee0a24;
    /* Vant的危险按钮红色 */
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}

.force-update-content .update-tip {
    margin-top: 16px;
    font-size: 12px;
    color: #969799;
}
</style>