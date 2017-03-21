<template> 
   <div clsss="page">   
    <ul class="home-list" v-if="isLoad">
        <li class="home-item" v-for="item in list">
            <router-link :to="'/list/'+item.id" class="home-item-link">
              <div class="item-poster" :style="getBackBg(item.picUrl)">
              </div>
              <div class="item-content">
                  <h3>{{item.topTitle}}</h3>
                  <p class="e" v-for="song in item.songList">
                    {{song.songname}}
                    <span class="c3">{{song.singername}}</span>
                  </p>
                  <span>{{disposeCount(item.listenCount)}}万</span>
              </div>
            </router-link>
        </li>
      </ul>
      <p class="load-fail" v-else v-html="message"></p>
    </div>
</template>

<style>
  .home-list {list-style-type:none;margin:0 0 3em;padding: 0;}

  .home-item{margin:1em 0;background:rgba(0,0,0,.1);}
  .home-item-link{position:relative;display:-webkit-box;display:flex;height:39vw;font-size:1rem;}
  .home-item-link:after{position:absolute;content:"";right:5%;top:50%;width:1.6em;height:1.6em;margin-top:-0.8em;box-sizing:border-box;border-top:1px solid currentColor;border-right:1px solid currentColor;-webkit-transform:rotate(45deg);transform:rotate(45deg);}
  .item-poster{width:39%;height:100%;margin-right:3%;background:#000 none no-repeat 50% 50%;background-size:cover;}
  .item-content{width:56%;}
  .item-content>h3{font-size:1.2rem;margin:.8em 0;font-weight:500;}
  .item-content>.e{width:100%;margin:.2em 0;}
  .item-content>.e>.c3{margin-left:1em;}
  .item-content>span{display:block;margin-top:1em;}
  .item-content>span:before{display:inline-block;content:"";width:1.2em;height:1.2em;vertical-align:text-bottom;margin-right:1em;background:url(data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEtZmxhdC0yMDAzMDExNC5kdGQiPgo8c3ZnIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBzdHJva2U9IiNGRkYiPgo8bGluZSB4MT0iMTUiIHkxPSIwIiB4Mj0iMTUiIHkyPSIzMCIgIC8+CjxsaW5lIHgxPSI2IiB5MT0iNyIgeDI9IjYiIHkyPSIzMCIgLz4KPGxpbmUgeDE9IjI0IiB5MT0iMTUiIHgyPSIyNCIgeTI9IjMwIiAvPgo8L2c+Cjwvc3ZnPg==) no-repeat 50% 50%;background-size:contain;}
</style> 

<script>

export default {
  data () {
    return {
      isLoad:false,
      message:"<i class=\"loading\"></i>",
      list:[]
    }
  },
  props:["api"],
  created(){

     this.jsonp(this.api).then(function(){
         var result=MusicJsonCallback.data;
         MusicJsonCallback.data=null;

        this.isLoad=result.code===0;
        this.message=result.message||"页面加载失败...";
         if(this.isLoad){
           this.list.push.apply(this.list,result.data.topList);
         }

     })
  },
  methods:{
     disposeCount:function(count){
         return (count/1e3|0)/10;
     }
  }
}
</script>

