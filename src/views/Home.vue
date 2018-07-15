<template>
  <form class="login-form">
    <h1>
      <span>Login</span>
      <span class="error-msg" v-show="errorMsg">{{errorMsg}}</span>
    </h1>
    <input
      type="text"
      class="login-input"
      placeholder="User Name"
      v-model="username"
    >
    <input
      type="password"
      class="login-input"
      placeholder="Password"
      autocomplete="new-password"
      v-model="password"
    >
    <button type="submit" class="login-btn">登 录</button>
  </form>
</template>

<script>
  export default {
    metaInfo: {
      title: 'Login Page'
    },
    data () {
      return {
        username: '',
        password: '',
        errorMsg: ''
      }
    },
    methods: {}
  }
</script>

<style lang="stylus" scoped>
</style>
