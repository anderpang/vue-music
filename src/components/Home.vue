<template>
    <div class="page">
        <header-bar isSearch="1" @back-click="hideSearch" @in-search="showSearch" :value="searchValue"></header-bar>
        <slider api="http://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?format=jsonp&jsonpCallback=MusicJsonCallback"></slider>
        <home-list api="http://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?format=jsonp&jsonpCallback=MusicJsonCallback"></home-list>
        <search-list v-if="isSearch" :result="searchResult"></search-list>
        <hot-list v-show="isHot" :isHotTrigger="isHot" @hot-search="putSearchValue" api="http://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=jsonp&jsonpCallback=MusicJsonCallback"></hot-list>
    </div>
</template>

<script>
import HeaderBar from "./HeaderBar.vue"
import Slider from "./Slider.vue"
import HomeList from "./HomeList.vue"
import SearchList from "./SearchList.vue"
import HotList from "./HotList.vue"

export default {
   data(){
      return {
          isSearch:false,
          isHot:false,
          searchResult:null,
          searchValue:""
      }
   },
   methods:{
      hideSearch:function(){
         this.isSearch=this.isHot=false;
      },
      showSearch:function(bl,key){
          this.isSearch=bl;
          this.isHot=!bl;
          bl&&this.doSearch(key);
      },
      putSearchValue:function(key){
         this.searchValue=key;
         this.showSearch(true,key);
      },
      doSearch:function(key){
          var that=this,
              api="https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?format=jsonp&jsonpCallback=MusicJsonCallback&key="+encodeURIComponent(key);
          this.jsonp(api).then(function(){
            var result=MusicJsonCallback.data;
            if(!result)return;
            MusicJsonCallback.data=null;
            if(result.code===0)
              that.searchResult=result.data;            
        })
      }
   },
   components:{
       HeaderBar,
       Slider,
       HomeList,
       SearchList,
       HotList
   }
}
</script>