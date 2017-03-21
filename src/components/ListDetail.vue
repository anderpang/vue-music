<template>
    <div class="page">
        <header-bar></header-bar>
        <dl v-if="isLoad">
            <dt class="list-header" :style="getBackBg(pic)">
                <div>
                    {{listname}}
                    <span class="r f1s">{{update_date}}</span>
                </div>
            </dt>
            <dd class="list-dd">
                <a href="javascript:;" class="db list-link" v-for="item in list" @click="play(item)">
                    <div class="list-order"></div>
                    <div class="list-con">
                        <h4>{{item.data.songname}}</h4>
                        <span class="f1s">{{item.data.singer[0].name}}-{{item.data.albumname}}</span>
                    </div>
                    <div class="list-icon" @click="showDialog($event,item)"></div>
                </a>
            </dd>            
        </dl> 
        <dl v-else>
             <dd class="load-fail" v-html="message"></dd>
        </dl>
        <music-dialog v-if="dialog.isShow" :title="dialog.title" :options="dialog.options" @dialog-selected="dialogSelected"></music-dialog>
    </div>
</template>

<style>
.list-header{display:-webkit-flex;display:flex;align-items:flex-end;flex-wrap:wrap;height:46.875vw;background:none no-repeat 50% 50%/cover;}
.list-header>div{flex:1;padding:1em 3% 0;background-color:rgba(0,0,0,.5);}
.list-header>div:after{display:block;content:"";width:100%;height:3px;margin-top:1em;background:-webkit-linear-gradient(left,rgba(100,100,100,.2),rgba(200,200,200,1),rgba(100,100,100,.2));background:linear-gradient(left,rgba(100,100,100,.2),rgba(200,200,200,1),rgba(100,100,100,0.2));}

.list-dd{counter-reset:order;}
.list-link{display:-webkit-flex;display:flex;align-items:center;padding-top:.5em;flex-wrap:wrap;}
.list-link:after{display:block;content:"";width:100%;height:1px;margin-top:.5em;background:-webkit-linear-gradient(left,rgba(100,100,100,.2),rgba(100,100,100,1),rgba(100,100,100,.2));background:linear-gradient(left,rgba(100,100,100,.2),rgba(100,100,100,1),rgba(100,100,100,0.2));}
.list-order{width:2em;margin-left:3%;}
.list-order:before{content:counter(order);counter-increment:order;}
.list-con{flex:1;}
.list-icon{width:4em;margin-right:3%}
.list-con>h4{margin:0;font-weight:normal;word-break:break-all;}
.list-con>.f1s{color:#c2c8d2;}
.list-icon{height:2em;background:url(data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEtZmxhdC0yMDAzMDExNC5kdGQiPgo8c3ZnIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkYiIC8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRiIgLz4KPGNpcmNsZSBjeD0iNSIgY3k9IjE1IiByPSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkYiIC8+Cjwvc3ZnPg==) no-repeat 100% 0/auto 100%;}
</style>

<script>
import HeaderBar from "./HeaderBar.vue"
import MusicDialog from "./MusicDialog.vue"

export default {
  data () {
    return {
      isLoad:false,
      message:"<i class=\"loading\"></i>",
      listname:"",
      update_date:"",
      pic:"",
      list:[],
      dialog:{
          isShow:false,
          title:"",
          options:["立即播放","加入播放列表"]
      },
    }
  },
  created(){
     var that=this,
         api="https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?format=jsonp&&jsonpCallback=MusicJsonCallback&topid=";

     this.jsonp(api+this.$route.params.id).then(function(){
         var result=MusicJsonCallback.data;
         if(!result) that.message="页面加载失败...";
         MusicJsonCallback.data=null;

         that.isLoad=true;

        that.pic=result.topinfo.pic_h5;
        that.listname=result.topinfo.ListName;
        that.update_date=result.update_time;
        that.list.push.apply(that.list,result.songlist);         
     })
  },
  methods:{
     disposeCount(count){
         return (count/1e3|0)/10;
     },
     formatSong(item){
        return {
             id:item.data.songid,
             songname:item.data.songname,
             singer:item.data.singer[0].name
        };
     },
     play(item){
         var music=this.musicModule;
         music.play(this.formatSong(item));
     },
     showDialog(e,item){
         e.preventDefault();
         e.stopPropagation();       
         this.dialog.isShow=true;           
         this.dialog.title=item.data.songname;
         this.dialog.item=item;   
         
     },
     dialogSelected(index){
          if(index===1){
              this.musicModule.list.push(this.formatSong(this.dialog.item));
          }
          else if(index===0)
          {
              this.play(this.dialog.item);
          }
          //-1
          this.dialog.isShow=false;
     }
  },
  components:{
      HeaderBar,
      MusicDialog
  }
}
</script>
