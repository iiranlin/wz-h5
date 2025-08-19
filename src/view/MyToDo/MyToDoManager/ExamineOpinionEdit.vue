<template>
    <div class="edit-container">
        <span class="title">审核意见：</span>
        <van-field
                v-model="opinion"
                type="textarea"
                maxlength="200"
                rows="2"
                autosize
                placeholder="请输入审核意见"
                show-word-limit/>
        <div class="default-button-container">
            <van-button class="button-info" block type="default" round @click="handleCancel()">取消</van-button>
            <van-button class="button-info" block type="info" round @click="handleConfirm()">确定</van-button>
        </div>
    </div>
</template>
<script>
import eventBus from '@/utils/eventBus.js'

export default {
    name: 'ExamineOpinionEdit',

    data () {
        return {
            opinion: '',
            type: '',
        }
    },
    created () {
        this.type = this.$route.params.type;
        
        if(this.type == 'reject'){
            this.opinion = '不通过'
        }else if(this.type == 'editAdopt'){
            this.opinion = '修改后通过'
        }else if(this.type == 'adopt'){
            this.opinion = '通过'
        }
    },
    methods: {
        //取消
        handleCancel(){
            this.$router.back();
        },
        //确定
        handleConfirm(){
            if(!this.opinion){
                this.$notify({
                    type: 'warning',
                    message: '请填写审核意见!',
                });
                return
            }
            eventBus.$emit('examineOpinionEdit',this.opinion,this.type);
            this.$router.back();
        },
    }
}
</script>
<style lang="less" scoped>

</style>