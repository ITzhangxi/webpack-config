<template>
  <div>
        <span class="text">
          {{num}}
          <router-view/>
        </span>
  </div>
</template>
<script>
  export default {
    metaInfo: {
      title: 'app'
    },
    data () {
      return {
        num: 0
      }
    },
    mounted () {
      this.num = this.$store.state.num
    }
  }
</script>
<style>
  .text {
    font-size: 30px;
    color: linen;
  }
</style>


