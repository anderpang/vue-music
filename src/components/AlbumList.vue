<template>
    <div class="page">
        <header-bar></header-bar>
        <dl v-if="isLoad">
            <dt class="list-header" :style="getBackBg(pic)">
                <div>
                    {{result.name}}<br />
                    <span class="f1s c3">
                        歌手：{{result.singername}}<br />
                        发行公司：{{result.company}}<br />
                        发行时间：{{result.aDate}}
                    </span>                   
                </div>
            </dt>
            <dd class="list-dd">
                <a href="javascript:;" class="db list-link" v-for="item in result.list" @click="play(item)">
                    <div class="list-order"></div>
                    <div class="list-con">
                        <h4>{{item.songname}}</h4>
                        <span class="f1s">{{item.songorig}}</span>
                    </div>
                    <div class="list-icon" @click="showDialog($event,item)"></div>
                </a>
                <details class="album-desc-wrap">
                    <summary>简介</summary>
                    <div class="album-desc">
                        {{result.desc}}
                    </div>
                </details>                
            </dd>            
        </dl> 
        <dl v-else>              
             <dd class="load-fail" v-html="message"></dd>
        </dl>
        <music-dialog v-if="dialog.isShow" :title="dialog.title" :options="dialog.options" @dialog-selected="dialogSelected"></music-dialog>
    </div>
</template>

<style>
  .album-desc-wrap{margin:.5em 3% 3em;}
  .album-desc{text-indent:2em;}
</style>

<script>
import HeaderBar from "./HeaderBar.vue"
import MusicDialog from "./MusicDialog.vue"

export default {
  data () {
    return {
      result:null,
      isLoad:false,
      message:"<i class=\"loading\"></i>",
      pic:"",
      dialog:{
          isShow:false,
          title:"",
          options:["立即播放","加入播放列表"]
      }
    }
  },
  created(){
     var api="http://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg?jsonpCallback=MusicJsonCallback&albummid=";
     this.jsonp(api+this.$route.params.id).then(function(){
         var result=MusicJsonCallback.data;
         if(!result) this.message="页面加载失败...";
         MusicJsonCallback.data=null;

         this.isLoad=result.code===0;
         if(this.isLoad){
            this.result=result.data;
            this.pic="http://y.gtimg.cn/music/photo_new/T002R300x300M000"+result.data.mid+".jpg?max_age=2592000";
         }
     })
  },
  methods:{
     formatSong(item){
        return {
             id:item.songid,
             songname:item.songname,
             singer:item.singer[0].name
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
