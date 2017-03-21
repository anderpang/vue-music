<template>
    <header v-if="isSearch" class="header">
        <div class="header-inner">
            <div class="header-left">
                <a v-show="isSearch" href="javascript:;" class="icon-btn back-btn" @click="back"></a>
                <a v-show="!isSearch" href="javascript:;" class="icon-btn menu-btn"></a>                          
            </div>
            <div class="header-title">
                <input v-if="isSearch" class="search-input" max-length="100" placeholder="歌曲/专辑/歌手" @focus="focus" @input="input" :value="value" />
            </div>
            <div class="header-right">
                <a href="javascript:;" class="icon-btn search-btn"></a>
            </div>
        </div>
    </header>
    <header v-else class="header pa">
        <div class="header-inner">
            <div class="header-left">
                <a href="javascript:history.back();" class="icon-btn back-btn"></a>
            </div>
            <div class="e header-title" v-html="title||''">
            </div>
            <div class="header-right" v-html="right||''">      
            </div>
        </div>
    </header>
</template>

<style>
  .header{height:14vw;}
  .header-inner{position:fixed;z-index:5;display:-webkit-box;display:flex;left:0;top:0;width:94%;height:14vw;padding:0 3%;align-items:center;}
  .header-inner>div{display:-webkit-flex;display:flex;align-items:center;}
  .header-left,
  .header-right{width:15%;height:80%;}
  .header-right{justify-content:flex-end;}
  .header-title{flex:1;text-align:center;font-size:1.4rem;justify-content:center;}
  .search-input{font-size:1.2rem;background:rgba(200,200,200,.3);border:1px solid rgba(255,255,255,.1);border-radius:5px;width:80%;padding:.2em .4em;color:#FFF;}
  .icon-btn{display:block;width:60%;height:80%;}
  .menu-btn,
  .back-btn,
  .search-btn{background:url(data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEtZmxhdC0yMDAzMDExNC5kdGQiPgo8c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSI2MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyAgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGIj4KPGxpbmUgeDE9IjIiIHkxPSIxMCIgeDI9IjE4IiB5Mj0iMTAiIC8+CjxsaW5lIHgxPSIyIiB5MT0iNSIgeDI9IjE4IiB5Mj0iNSIgLz4KPGxpbmUgeDE9IjIiIHkxPSIxNSIgeDI9IjE4IiB5Mj0iMTUiIC8+Cjxwb2x5bGluZSBwb2ludHM9IjEzIDIzLDYgMzAsMTMgMzciIC8+CjxjaXJjbGUgY3g9IjkuOTM2MDgiIGN5PSI1MC4wMjkwNSIgcj0iNi41MDc4NDQiIC8+CjxsaW5lIHgxPSIxNC42NDI2NSIgeTE9IjU1LjA4NDI1IiB4Mj0iMTcuNTQ3OTMiIHkyPSI1Ny45ODk1NCIgLz4KPC9nPgo8L3N2Zz4=) no-repeat 0 0;background-size:auto 300%;}  
  .back-btn{background-position:-1.5vw 50%;}
  .search-btn{background-position:50% 100%;}
</style>

<script>
export default{ 
    props:["isSearch","title","right","value"],
    methods:{
        back:function(e){
           e.preventDefault();
           $(".search-input",this.el).value="";
           this.$emit("back-click");
        },
        focus:function(e){
            var value=e.target.value.trim();
            if(!value)this.$emit("in-search",false);
        },
        input:function(e){
            var value=e.target.value.trim();
            if(value){
                this.$emit("in-search",true,value);
            }
            else
            {
                this.$emit("in-search",false);
            }
        }
    }
}
</script>