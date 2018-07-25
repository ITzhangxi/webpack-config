import Notification from './notification.vue'

export default {
  // 在没有调用 `Vue.extend` 时候继承 Notification 组件
  extends: Notification,
  data () {
    return {
      verticalOffset: 0,
      autoClose: 3000,
      height: 0
    }
  },
  computed: {
    style () {
      return {
        position: 'fixed',
        right: '20px',
        bottom: `${this.verticalOffset}px`
      }
    }
  },
  mounted () {
    this.setTimer()
  },
  methods: {
    setTimer () {
      if (!this.autoClose) return
      this.timer = setTimeout(_ => {
        this.flag = false
      }, this.autoClose)
    },
    clearTimer () {
      clearTimeout(this.timer)
    },
    afterEnter () {
      this.height = this.$el.offsetHeight
    }
  },
  beforeDestroy () {
    this.clearTimer()
  }
}
