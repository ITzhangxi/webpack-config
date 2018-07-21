<template>
  <div>
    <notification></notification>
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
    }
  }
</script>
<style>
  .text {
    font-size: 30px;
    color: linen;
  }
</style>


