<template>
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="(item,index) in navMenu" :key="index" :name="item.link" :to="item.link">
            {{item.title}}
            <template #icon="props">
                <img :src="props.active ? item.activeIcon : item.normalIcon" />
            </template>
        </van-tabbar-item>
    </van-tabbar>
</template>
<script>
export default {
    props: {
        navMenu: {
            type: Array,
            default() {
                return []
            },
        },
    },
    watch: {
        $route: function (route) {
            this.activeIndex(route);
        }
    },
    data () {
        return {
            active: '',
        }
    },
    methods: {
        activeIndex (route) {
            let obj = this.navMenu.find((item) => {
                return route.path.includes(item.link)
            })
            this.active = obj.link;
        },
    },
    created () {
        //清空所有缓存页面
        this.$store.commit('changeKeepPages', 'index') // 经测试include为空值时所有页面都会缓存
        const path = this.$route.path
        this.active = path === '/'?this.navMenu[0].link:path;
        this.$router.push(this.active)
    }
}
</script>
<style lang="less" scoped>
.van-tabbar {
    height: 52px;

    .van-tabbar-item {
        border-right: 1px solid #f2f2f2;
       
        &:last-child{
            border-right: none;
        }
    }
}
</style>