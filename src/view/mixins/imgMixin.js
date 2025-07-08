export default {
  data() {
    return {
      showPopup: false,
      showImg: false,
      images: [],
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
