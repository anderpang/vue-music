<template>
    <div class="slider-wrap">
        <ul class="slider">
            <li v-for="item in list">
                <a class="slider-link" target="_blank" :href="item.linkUrl" :style="getBackBg(item.picUrl)"></a>
            </li>
        </ul>
    </div>
</template>

<style>
  .slider-wrap{position:relative;width:100%;height:40vw;overflow:hidden;}
  .slider,
  .slider>li{position:absolute;width:100%;height:100%;}
  .slider>li{left:100%;top:0;}
  .slider>li:first-child{left:0;}
  .slider-link{display:block;height:100%;background:#000 none no-repeat 50% 50%;background-size:cover;}
</style>

<script>
    export default {
        data(){
            return {
               isLoad:false,
               message:"加载中...",               
               list:[]
            }
        },
        props:["api"],
        created(){
            this.jsonp(this.api).then(function(){
                this.jsonp(this.api).then(function(){
                var result=MusicJsonCallback.data;
                MusicJsonCallback.data=null;

                this.isLoad=result.code===0;
                result.message&&(this.message=result.message);
                if(this.isLoad){
                   this.list.push.apply(this.list,result.data.slider);
                } 
            });   
          });       
       },
       updated(){
           this.isLoad&&
           new Slider({
                el:this.$el,
                hasDots:true,
                isAutoPlay:true
           });
       }
    }
</script>