<template>
  <div>
    <div class='container'>
      <img
        src="https://s1-imfile.feishucdn.com/static-resource/v1/v2_b33e03ba-ba9c-4ab9-933c-d6c51450bb9g~?image_size=noop&amp;cut_type=&amp;quality=&amp;format=image&amp;sticker_format=.webp"
        alt="banner">

      <div class="phonecontainer">
        <div v-for='(item, index) in phoneList' :key='item.id' class='phoneitem' @click='selectPhone(item, index)'
          :class="{ 'reserved': item.status === 1, 'seleted': item.selected }"
          v-show='index < page * 100 && index > (page - 1) * 100 - 1'>
          {{ item.phone }}
        </div>
      </div>
      <div class='handle'>

        <el-button type="warning" @click='reset'>刷新/重选</el-button>
        <el-button type="primary" @click='confirm'>确 定</el-button>
      </div>
      <div class='page'>
        <el-pagination :current-page='page' @current-change='pageChage' background layout="prev, pager, next"
          :page-size='100' :total="phoneList.length">
        </el-pagination>
      </div>

    </div>

    <el-dialog title="办理号码" :visible.sync="dialogVisible" width="90%">

      <el-form ref="forms" label-width="100px" :model='form'>
        <el-form-item label="已选号码：" prop='jobNum'>
          <div style="float:left">
            <el-tag style="margin-right: 10px" v-for='(item) in seleted' :key='item.id'>{{ item.phone }}</el-tag>
          </div>

        </el-form-item>
        <el-form-item label="姓名：" :rules="[
          { required: true },

        ]">
          <el-input maxlength='10' v-model="form.name"></el-input>
          <!-- <span>example:GW12345678</span> -->
        </el-form-item>
        <el-form-item label="工号：" :rules="[
          { required: true, message: '工号必填,格式如:GW12345678' },

        ]">
          <el-input maxlength='10' v-model="form.jobNum"></el-input>
          <!-- <span>example:GW12345678</span> -->
        </el-form-item>
      </el-form>



      <!-- <span v-for='(item) in seleted' :key='item.id'>{{ item.phone }}</span>/ -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('forms')">确 定</el-button>
      </span>
    </el-dialog>




    <el-dialog title="提示" :visible.sync="showsuccess" width="90%">
      <p>请截图保存您申请的号码,关闭后不能再看到</p>
      <div>
        <el-tag style="margin-right: 10px" v-for='(item) in successPhone' :key='item.id'>{{ item.phone }}</el-tag>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
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
    submit( formname ) {
      let reg = /^GW[0-9]{8}$/
      if ( reg.test( this.form.jobNum ) ) {
        this.$refs[ formname ].validate( ( valid ) => {
          if ( valid ) {



            this.$confirm( `确定办理这${ this.seleted.length }个号码吗？` )
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




          } else {
            console.log( 'error submit!!' );
            return false;
          }
        } );
      } else {
        Message( {
          message: '请正确输入工号,格式如:GW12345678',
          type: 'error',
          duration: 2 * 1000
        } )
      }

    },
    confirm() {
      if ( this.seleted.length ) {
        this.dialogVisible = true
      } else {
        Message( {
          message: '未选择号码',
          type: 'error',
          duration: 2 * 1000
        } )
      }

    },
    pageChage( e ) {
      this.page = e
    },
    getAll( params ) {
      request( {
        url: '/phone/queryAll',
        method: 'get',
        params
      } ).then( res => {
        this.phoneList = res.data
        console.log( res, '====' )
      } )
    },

    selectPhone( item, index ) {
      console.log( item, )

      if ( item.status !== 1 ) {
        if ( this.seleted.length === 5 && !item.selected ) {
          Message( {
            message: '最多办理5个号码',
            type: 'error',
            duration: 2 * 1000
          } )
          return
        }
        if ( this.phoneList[ index ].selected ) {
          this.$set( this.phoneList[ index ], 'selected', false )
        } else {
          this.$set( this.phoneList[ index ], 'selected', true )
        }

        // this.phoneList[ index ].selected = true

      } else {
        Message( {
          message: '已被占用',
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

<style lang='less' scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: rgba(51, 112, 255, .1);
  min-height: 100%;
  // padding-bottom: 20px;
}

#app {


  position: relative;
  padding: 0;
  width: 100%;
  font-family: Avenir,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  display: flex;
  // justify-content: center;
  background-color: #fff;
  box-shadow: 0 6px 24px 0 rgb(31 35 41 / 8%);
  border-radius: 12px;
  min-height: 100%;
  // margin-bottom: 20px;

  .container {
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
      width: 100%;
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
        color: #329d5d;
        // color: rgb(40, 97, 28);
      }

      &.reserved {
        border: 1px solid #b01515;
        color: #b01515;
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

