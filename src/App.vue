<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view></router-view> -->
    <!-- <div class="header">header</div> -->
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/" exact>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view> 
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from '@/common/js/util'
import header from '@/components/header/header.vue'
const ERR_OK = 0
export default {
  data() {
    return {
      seller: {
        id: (function() {
          var queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then(function(response) {
      response = response.body
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data)
      }
    }, function(response) {
      console.log(response)
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="less">
  @import "./common/less/mixin.less";
  .tab{
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .border-1px(rgba(7, 17, 27, 0.1));
  }
  .tab-item{
    flex: 1;
    text-align: center;
  }
  .tab-item>a{
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }
  .tab-item>a.active{
    color:red;
  }
</style>
