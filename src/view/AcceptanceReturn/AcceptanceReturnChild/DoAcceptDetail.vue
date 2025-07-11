<template>
  <div class="default-container default-scroll">
    <do-accept isView/>
    <back-to-top className=".default-scroll"></back-to-top>
  </div>
</template>
<script>
import DoAccept from '@/view/AcceptanceReturn/AcceptanceReturnChild/DoAccept.vue'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'DoAcceptDetail',
  components: {DoAccept,BackToTop}

}
</script>
