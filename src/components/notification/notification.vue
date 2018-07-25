<template>
  <!-- 组件 -->
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div
      class="notification"
      :style="style"
      v-show="flag"
      @mouseenter="clearTimer"
      @mouseleave="setTimer">
      <span>{{content}}</span>
      <button class="btn" @click.prevent="closeTip">关闭</button>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'notification',
    data () {
      return {
        flag: false
      }
    },
    props: {
      content: {
        type: String,
        default: '温馨提示'
      }
    },
    computed: {
      style () {
        return {}
      }
    },
    methods: {
      closeTip () {
        this.$emit('close')
      },
      afterLeave () {
        this.$emit('closed')
      },
      afterEnter () {},
      clearTimer () {},
      setTimer () {}
    }
  }
</script>

<style scoped>
  .notification {
    position: fixed;
    /*top: 50%;*/
    right: 20px;
    width: 250px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .btn {
    background-color: rgba(0, 0, 0, .8);
    color: linen;
    border: transparent;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    /* outline 删除button点击高亮 */
    outline: none;
    -webkit-tap-highlight-color: #000000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter {
    transform: translate3d(270px, 0, 0)
  }

  .fade-enter-to {
    transform: translate3d(0, 0, 0)
  }

  .fade-leave {
    opacity: 1;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
