import dt from '@/assets/img/img.png'

export default {
  data() {
    return {
      showPopup: false,
      showImg: false,
      images: [dt],
      startPosition: 0
    }
  },
  methods: {
    imgClick() {
      this.showImg = true
      this.showPopup = true
    }
  }
}
