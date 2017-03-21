<template>
    <transition name="slide-down">
        <div class="page search-list">
            <div v-for="data in result" v-if="data.count>0">                
                <h4 class="search-subject">{{data.name}}</h4>
                <router-link class="db list-link" v-if="data.type===3" v-for="item in data.itemlist" :to="'/album/'+item.mid">
                    <div class="list-order"></div>
                    <div class="e list-con">             
                      <img class="list-img" v-if="item.pic" :src="item.pic" alt="" />
                      {{item.name}}&emsp;
                      <span class="c3">{{item.singer}}</span>
                    </div>
                </router-link>
                <a v-else href="javascript:;" class="db list-link" v-for="item in data.itemlist" @click="play(item)">
                    <div class="list-order"></div>
                    <div class="e list-con">             
                      <img class="list-img" v-if="item.pic" :src="item.pic" alt="" />
                      {{item.name}}&emsp;
                      <span class="c3">{{item.singer}}</span>
                    </div>
                </a>
            </div>
        </div>        
    </transition>
</template>

<style>
    .search-list{position:fixed;z-index:4;left:0;top:0;width:100%;height:100%;padding-top:14%;box-sizing:border-box;overflow:auto;-webkit-overflow-scrolling:touch;}
    .search-list>div:last-of-type{padding-bottom:5em;}
    .search-subject{counter-reset:order;margin:0;padding:.5em 3%;background:#87909B;}
    .list-img{width:10%;vertical-align:middle;}
</style>

<script>
    export default{      
       props:["hotApi","api","result"],
       methods:{
           formatSong(item){
                return {
                    id:item.id,
                    songname:item.name,
                    singer:item.singer
                };
            },
            play(item){
                var music=this.musicModule;
                music.play(this.formatSong(item));
            }
       }
    }
</script>