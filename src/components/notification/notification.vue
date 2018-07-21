<template>
  <!-- 组件 -->
  <transition name="fade">
    <div class="notification" v-if="flag">
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
        flag: true
      }
    },
    props: {
      content: {
        type: String,
        default: '温馨提示'
      }
    },
    methods: {
      closeTip () {
        this.flag = !this.flag
      }
    }
  }
</script>

<style scoped>
  .notification {
    position: fixed;
    top: 50%;
    left: 0;
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
    transition: transform .5s;
  }

  .fade-enter, .fade-leave-to {
    transform: translate3d(-250px, 0, 0)
  }
</style>
