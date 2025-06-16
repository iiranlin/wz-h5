<template>
  <div class="requirement-filling">
    <div class="box-container">
      <ul class="list-ul">
        <li>
          <span class="list-ul-name">选择合同</span>
          <span class="list-ul-num">0</span>
        </li>
        <li class="li-status">
          <van-tag type="primary" round size="medium" @click="selectClick">选择合同</van-tag>
        </li>
      </ul>
    </div>
    <div class="box-container">
      <ul class="list-ul">
        <li>
          <span class="list-ul-name">已选物资</span>
          <span class="list-ul-num">0</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RequirementFilling',
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    selectClick () {
      this.$router.push({ name: 'SelectContract' })
    }
  }
}
</script>
<style lang="less" scoped>
.requirement-filling{
  padding-top: 10px;
  .list-ul-num{
    color: #1989fa;
  }
  .li-status{
    span{
      background-color: #edf2ff;
      border: 1px solid #289fec;
      color: #1d93ff;
    }
  }
}
</style>