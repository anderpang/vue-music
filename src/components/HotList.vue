<template>
    <transition name="slide-up">
        <div class="page search-list order-set">                   
            <span class="db list-link" v-for="item in list" @click="input(item.k)">
                <div class="list-order"></div>
                <div class="e list-con">             
                    {{item.k}}&emsp;
                    <span class="c3">人气：{{item.n}}</span>
                </div>
            </span> 
            <p class="load-fail" v-if="!isLoaded" v-html="message"></p> 
        </div>        
    </transition>
</template>

<style>
  .order-set{counter-reset:order;padding-bottom:5em;}
</style>

<script>
    export default{
        data(){
           return {
               isLoaded:false,
               isLoading:false,
               message:"<i class=\"loading\"></i>",
               list:[]
           }
        },
        props:["api","isHotTrigger"],
        methods:{
            input:function(k){    
                this.$emit("hot-search",k);
            }
        },
        watch:{
            isHotTrigger(bl){
                if(bl&&!this.isLoaded&&!this.isLoading){
                    this.isLoading=true;
                    var that=this;
                    this.jsonp(this.api).then(function(){
                        var result=MusicJsonCallback.data;
                        if(!result)return;
                        MusicJsonCallback.data=null;                
                        if(result.code===0){
                            that.isLoaded=true;
                            that.list.push.apply(that.list,result.data.hotkey);   
                        }
                        else
                        {
                            that.isLoading=false;
                        }  
                    })
                }
            }
        }
    }
</script>