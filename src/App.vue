<template>
  <div id="app">  
     <transition :name="transitionName">
        <router-view></router-view>
     </transition>
    <music-player></music-player>
  </div>
</template>

<script>
import MusicPlayer from "./components/MusicPlayer.vue"

export default {
  name: 'app',
  data () {
    return {
      transitionName:"slide-right"
    }
  },
  watch:{
    "$route":function(to,from){
       this.transitionName=to.path.split("/").length<from.path.split("/").length?"slide-left":"slide-right";
    }
  },
  components:{
       MusicPlayer
  }
}
</script>

<style>
.l{float:left;}.r{float:right;}.cl{clear:both;}
.n{font-weight:normal;font-style:normal;}.b{font-weight:bold;}.i{font-style:italic;}
.tl{text-align:left;}.tc{text-align:center;}.tr{text-align:right;}
.f1s{font-size:0.857em;}
.c0{color:#000;}.c1{color:#333;}.c2{color:#666;}.c3{color:#999;}.c4{color:#CCC;}
.vt{vertical-align:top;}.vm{vertical-align:middle;}.vb{vertical-align:bottom;}
.m0{margin:0;}.ml1{margin-left:1em;}.mr1{margin-right:1em;}
.p0{padding:0;}.pl1{padding-left:1em;}.pr1{padding-right:1em;}
.pr{position:relative;}.pa{position:absolute;}.ps{position:static;}.pf{position:fixed;}
.dn{display:none;}.db{display:block;}.dib{display:inline-block;}.di{display:inline;}
.oh{overflow:hidden;}.os{overflow:scroll;}
.vh{visibility:hidden;}.vv{visibility:visible;}
.cf:after{display:block;content:""; height:0;clear:both;overflow:hidden;visibility:hidden;}
.m{background:none no-repeat 50% 50%;}
.e{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

html{font-size:10px;font-size:calc(100vw / 32);width:100%;height:100%;-webkit-text-size-adjust:none;}
body{width:100%;height:100%;min-height:100%;min-width:320px;color:#222;font:normal 14px/1.6 "Microsoft YaHei",Verdana,Tahoma;color:#DCDDE0;background-color:#2F2D3B;overflow-x:hidden;}
body,dl,dt,dd,ul{margin:0;padding:0;}
ul{list-style-type:none;}
input, select, textarea{font:normal 14px/1.6 "Microsoft YaHei",Verdana,Tahoma;outline:0;-webkit-user-modify: read-write-plaintext-only;}
ins{display:block;height:0;}

input{-webkit-appearance:none}
a{color:currentColor;text-decoration:none;}
.load-fail{color:#999;text-align:center;margin-top:8em;}
.loading{display:inline-block;width:2.4em;height:2.4em;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHN0eWxlPmNpcmNsZXtzdHJva2UtZGFzaG9mZnNldDoxNjA7YW5pbWF0aW9uOmEgMS42cyBpbmZpbml0ZTt9QGtleWZyYW1lcyBhezEwMCV7c3Ryb2tlLWRhc2hvZmZzZXQ6LTE2MDt9fTwvc3R5bGU+CjxjaXJjbGUgY3g9IjMwLjMxMDI1IiBjeT0iMjkuODMyOTMiIHI9IjIyLjkxMTY5IiBmaWxsPSJub25lIiBzdHJva2U9IiNDQ0MiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWRhc2hhcnJheT0iMTYwLDE2MCIgLz4KPC9zdmc+) no-repeat 50% 50%;background-size:contain;}

#ap{height:100%;}
.page{position:relative;width:100%;min-height:100%;background-color:#2F2D3B;}

.slide-right-enter-active{width:100%;position:absolute;z-index:1;left:0;top:0;-webkit-transform:translateX(100%);transform:translateX(100%);}
.slide-left-enter-active{width:100%;position:absolute;z-index:1;left:0;top:0;-webkit-transform:translateX(-100%);transform:translateX(-100%);}
.slide-right-enter-to,
.slide-right-leave-active,
.slide-left-enter-to,
.slide-left-leave-active{-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:-webkit-transform .5s ease-in-out;transition:transform .5s ease-in-out;}
.slide-right-leave-to{-webkit-transform:translateX(-70%);transform:translateX(-70%);}
.slide-left-leave-to{-webkit-transform:translateX(70%);transform:translateX(70%);}

.slide-up-enter-active{-webkit-transform:translateY(100%);transform:translateY(100%);}
.slide-up-enter-to,
.slide-up-leave-active{-webkit-transform:translateY(0);transform:translateY(0);-webkit-transition:-webkit-transform .5s ease-in-out;transition:transform .5s ease-in-out;}
.slide-up-leave-to{-webkit-transform:translateY(100%);transform:translateY(100%);}

.slide-down-enter-active{-webkit-transform:translateY(-100%);transform:translateY(-100%);}
.slide-down-enter-to,
.slide-down-leave-active{-webkit-transform:translateY(0);transform:translateY(0);-webkit-transition:-webkit-transform .5s ease-in-out;transition:transform .5s ease-in-out;}
.slide-down-leave-to{-webkit-transform:translateY(-100%);transform:translateY(-100%);}

.fade-enter-active{opacity:0;visibility:hidden;}
.fade-enter-to,
.fade-leave-active{opacity:1;visibility:visible;-webkit-transition:all .5s ease-in-out;transition:all .5s ease-in-out;}
.fade-leave-to{opacity:0;visibility:hidden;}

.slider-dots{position:absolute;left:0;bottom:1em;width:100%;text-align:center;}
.slider-dots>i{display:inline-block;width:0;height:0;margin:0 .2em;border-radius:50%;border:.3em solid #999;box-shadow:0 0 1px #CCC;-webkit-transition:border-color .8s ease-in-out;transition:border-color .8s ease-in-out; }
.slider-dots>i.on{border-color:#FFF; }
.anim{-webkit-transition:-webkit-transform .8s ease-in-out;transition:-webkit-transform .8s ease-in-out;}

.tip{position:fixed;visibility:visible;opacity:1;z-index:999;left:50%;top:50%;width:20em;height:3em;line-height:3em;margin:-1.5em 0 0 -10em;text-align:center;border-radius:5px;color:#333;background:rgba(255,255,255,.8);}
.tip.show{visibility:hidden;opacity:0;transition:opacity 1s 3s,visibility 1s 3s;}
</style> 
