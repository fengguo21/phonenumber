<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1"
          auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码"
          name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import request from '../../request'
export default {
  name: 'Login-page',
  data() {
    const validateUsername = ( rule, value, callback ) => {
      if ( !value.length ) {
        callback( new Error( 'Please enter the correct user name' ) )
      } else {
        callback()
      }
    }
    const validatePassword = ( rule, value, callback ) => {
      if ( value.length < 6 ) {
        callback( new Error( 'The password can not be less than 6 digits' ) )
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [ { required: true, trigger: 'blur', validator: validateUsername } ],
        password: [ { required: true, trigger: 'blur', validator: validatePassword } ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function ( route ) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if ( this.passwordType === 'password' ) {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick( () => {
        this.$refs.password.focus()
      } )
    },
    handleLogin() {
      this.$refs.loginForm.validate( valid => {
        if ( valid ) {
          this.loading = true
          let data = this.loginForm
          console.log( this.loginForm, '9888' )
          request( {
            url: `/phone/login?username=${ data.username }&password=${ data.password }`,
            method: 'post',
          } ).then( res => {
            console.log( res, 'res' );
            this.loading = false
            if ( res.data.code == 200 ) {
              sessionStorage.setItem( 'hasLogin', true )
              this.$router.push( '/admin' )
              console.log( 'success' );
            } else {
              Message( {
                message: res.data.description,
                type: 'error',
                duration: 2 * 1000
              } )
            }

          } )


          // this.$store.dispatch( 'user/login', this.loginForm ).then( () => {
          //   this.$router.push( { path: this.redirect || '/' } )
          //   this.loading = false
          // } ).catch( () => {
          //   this.loading = false
          // } )
        } else {
          console.log( 'error submit!!' )
          return false
        }
      } )
    }
  }
}
</script>



<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {

  min-height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    margin: 0 20px;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    // margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
