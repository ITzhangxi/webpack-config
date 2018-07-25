<template>
  <div>
    <!--<notification></notification>-->
    <button @click="showNotify">show notify</button>
    <span class="text">
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
      return {}
    },
    methods: {
      showNotify () {
        this.$notify({
          content: 'hah'
        })
      }
    }
  }
</script>
<style>
  .text {
    font-size: 30px;
    color: linen;
  }
</style>


