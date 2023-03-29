<template>
  <div>
    <div class='container'>
      <!-- <img
        src="https://s1-imfile.feishucdn.com/static-resource/v1/v2_b33e03ba-ba9c-4ab9-933c-d6c51450bb9g~?image_size=noop&amp;cut_type=&amp;quality=&amp;format=image&amp;sticker_format=.webp"
        alt="banner"> -->
      <div class='title'>
        <p>手机号管理</p>
      </div>


      <div class="phonecontainer">
        <div v-for='(item, index) in phoneList' :key='item.id' class='phoneitem' @click='selectPhone(item, index)'
          :class="{ 'opened': item.isfOpen === 1, 'seleted': item.selected }"
          v-show='index < page * 100 && index > (page - 1) * 100 - 1'>
          <p>{{ item.phone }}</p>
          <p class='name'>姓名:{{ item.name || '保密' }}</p>
          <p class='status' :class="{ 'openedstatus': item.isfOpen === 1 }">状态:{{ item.isfOpen === 0 ? '未开通' : '已开通' }}
          </p>
        </div>
      </div>
      <div class='handle'>

        <el-button type="warning" @click='reset'>刷新/重选</el-button>
        <el-button type="primary" @click='confirm'>开 卡</el-button>
      </div>
      <div class='page'>
        <el-pagination :current-page='page' @current-change='pageChage' background layout="prev, pager, next"
          :page-size='100' :total="phoneList.length">
        </el-pagination>
      </div>

    </div>






  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '../request'
export default {
  name: 'index-page',
  components: {

  },
  data() {
    return {
      dialogVisible: false,
      showsuccess: false,
      successPhone: [],
      page: 1,
      form: {
        jobNum: '',
        name: ''
      },


      phoneList: [],

    }
  },
  created() {


    this.getAll()

  },
  computed: {
    seleted() {
      return this.phoneList.filter( item => {
        return item.selected === true
      } )

    },
    totalPage() {
      return 6
    },
  },
  methods: {
    reset() {
      this.page = 1

      this.getAll()
    },
    submit() {




      this.$confirm( `确定开通这${ this.seleted.length }个号码吗？` )
        .then( () => {
          let data = this.seleted.map( item => {
            return Object.assign( item, { gwmCode: this.form.jobNum, name: this.form.name } )
          } )

          console.log( data, 'data======' )
          request( {
            url: '/phone/add',
            method: 'post',
            data
          } ).then( res => {
            this.showsuccess = true
            this.successPhone = res.data
            this.dialogVisible = false
            this.getAll()
            console.log( res, '====' )
          } )
        } )





    },
    confirm() {
      if ( this.seleted.length ) {
        this.$confirm( `确定开通这${ this.seleted.length }个号码吗？` )
          .then( () => {
            let data = this.seleted

            console.log( data, 'data======' )
            request( {
              url: 'phone/batchOpen',
              method: 'post',
              data
            } ).then( res => {
              this.showsuccess = true
              this.successPhone = res.data
              this.dialogVisible = false
              this.getAll()
              console.log( res, '====' )
            } )
          } )


      }

    },
    pageChage( e ) {
      this.page = e
    },
    getAll( params ) {
      request( {
        url: '/phone/queryByStatus',
        method: 'get',
        params
      } ).then( res => {
        this.phoneList = res.data
        console.log( res, '====' )
      } )
    },

    selectPhone( item, index ) {
      console.log( item, )

      if ( item.isfOpen === 0 ) {

        if ( this.phoneList[ index ].selected ) {
          this.$set( this.phoneList[ index ], 'selected', false )
        } else {
          this.$set( this.phoneList[ index ], 'selected', true )
        }

        // this.phoneList[ index ].selected = true

      } else {
        Message( {
          message: '已开通',
          type: 'error',
          duration: 2 * 1000
        } )
      }

    },
    // 生成指定位数的随机整数
    randomInteger( length ) {
      return Math.floor( Math.random() * Math.pow( 10, length ) );
    },

    // 生成中国手机号数组
    generatePhoneNumbers( num ) {
      const phoneNumbers = [];
      for ( let i = 0; i < num; i++ ) {
        const phoneNumber = `1${ this.randomInteger( 2 ) }${ this.randomInteger( 8 ) }`;
        phoneNumbers.push( { phone: phoneNumber } );
      }
      return phoneNumbers;
    }

  }
}
</script>

<style lang='less' >
.el-message-box {
  width: auto;
}

html,
body {
  // margin: 0;
  // padding: 0;
  // width: 100%;
  // background-color: rgba(51, 112, 255, .1);
  // min-height: 100%;
  // padding-bottom: 20px;
}

#app {


  // position: relative;
  // padding: 0;
  // width: 100%;
  // font-family: Avenir,
  //   Helvetica,
  //   Arial,
  //   sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin: 0 auto;
  // display: flex;
  // // justify-content: center;
  // background-color: #fff;
  // box-shadow: 0 6px 24px 0 rgb(31 35 41 / 8%);
  // border-radius: 12px;
  // min-height: 100%;
  // margin-bottom: 20px;

  .container {


    .title {
      p {
        margin-left: 20px;
      }

      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
      display: flex;
      justify-content: left;
      width: 100%;
      line-height: 1.5;

    }

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .page {
      height: 100px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .handle {
      padding-right: 30px;
      height: 100px;
      width: calc(100%-30px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    img {
      width: 100%;
    }

    .phonecontainer {
      float: left;
    }

    .phoneitem {
      &.seleted {
        border: 1px solid #329d5d;
        background: #a8efc4;
        // color: #329d5d;
        // color: rgb(40, 97, 28);
      }

      &.reserved {
        border: 1px solid #b01515;
        color: #b01515;
      }

      P {
        margin: 0;
      }

      .name {
        color: gray;
        font-size: 14px;

      }

      .status {
        color: saddlebrown;
        font-size: 14px;

        &.openedstatus {
          color: #329d5d;
        }
      }

      padding: 11px 16px;
      margin-left: 16px;
      margin-top: 18px;
      display: inline-block;
      cursor: pointer;
      border: 1px solid #dee0e3;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      position: relative;
      border-radius: 4px;
      transition: all .2s;
      width: 100px;
    }
  }
}
</style>

