<template>
    <div class="play-list">
        <header-bar :isSearch="false" :title="title" :right="headerRight"></header-bar>
        
        <div class="play-list-con">
            <a href="javascript:;" class="db list-link" v-for="item in list" @click="play(item)">
                <div class="list-order"></div>
                <div class="list-con">
                    <h4>{{item.songname}}</h4>
                    <span class="f1s">{{item.singer}}</span>
                </div>
                <div class="list-icon" @click="showDialog($event,item)"></div>
            </a>
        </div>
        <music-dialog v-if="dialog.isShow" :title="dialog.title" :options="dialog.options" @dialog-selected="dialogSelected"></music-dialog>
    </div>
</template>

<style>
    .play-list{display:-webkit-flex;display:flex;flex-direction:column;position:absolute;z-index:5;left:0;top:0;width:100%;height:100%;background:#2F2D3B;}
    .play-list>.header{position:static;}
    .play-list-con{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;}
</style>

<script>
    import HeaderBar from "./HeaderBar.vue"
    import MusicDialog from "./MusicDialog.vue"

    export default{
        data(){
            return {
                title:"播放列表",
                headerRight:'<a href="javascript:;">清空</a>',
                list:[],
                dialog:{
                    isShow:false,
                    title:"",
                    options:["立即播放","删除"]
                }
            }
        },
        methods:{
            back:function(e){
              e.preventDefault();
              this.$emit("close-click");
            },
            clear:function(e){
                var music=this.musicModule,
                    el=music.vue.$el;

                 e.preventDefault();
                this.list.splice(0,this.list.length);
                music.target.pause();
                el.classList.remove("fullscreen");
                music.list.length=0;
            },
            play(item){
                var music=this.musicModule;
                if(music.list[music.currentIndex]===item)return;
                music.play(item);
            },
            showDialog(e,item){
                e.preventDefault();
                e.stopPropagation();       
                this.dialog.isShow=true;
                this.dialog.title=item.songname;
                this.dialog.song=item; 
            },
            dialogSelected(index){                
                if(index===1){
                    this.delSong(this.dialog.song);
                }
                else if(index===0)
                {
                    this.play(this.dialog.song);
                }
                //-1
                this.dialog.isShow=false;
            },
            delSong(song){
                var music=this.musicModule,list=music.list,i=list.length,ii=i,cIdx=music.currentIndex;
                while(i--){
                    if(list[i]===song){
                        break;
                    }
                }
                if(i===cIdx){
                    if(ii>1){                       
                        music.play(list[i?i-1:ii-1]);                                         
                    }
                    else
                    {
                        music.target.pause();
                        music.vue.$el.classList.remove("fullscreen");
                    }
                }
                else if(ii===1){
                    music.target.pause();
                    music.vue.$el.classList.remove("fullscreen");
                }
                list.splice(i,1); 
                this.list.splice(i,1);
            }
        },        
        mounted:function(){
            $(".back-btn",this.$el).on("click",this.back.bind(this));
            $(".header-right>a",this.$el).on("click",this.clear.bind(this));
            
            this.list.push.apply(this.list,this.musicModule.list);
        },
        components:{
            HeaderBar,
            MusicDialog
        }
    }
</script>