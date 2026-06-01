<template>
  <div class="default-container default-scroll">
    <do-accept isView/>
    <back-to-top className=".default-scroll"></back-to-top>
  </div>
</template>
<script>
import DoAccept from '@/view/AcceptanceReturn/AcceptanceReturnChild/DoAccept.vue'
import BackToTop from '@/components/BackToTop'
import keepPages from '@/view/mixins/keepPages'
export default {
  name: 'DoAcceptDetail',
  mixins: [keepPages],
  components: {DoAccept,BackToTop}

}
</script>
