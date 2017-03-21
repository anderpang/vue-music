<template>
    <transition name="fade">
        <div class="dialog-wrap" @click="closed">
            <transition name="slide-up">
                <dl class="tc dialog">
                    <dt class="tl e">{{title}}</dt>
                    <dd v-for="(text,index) in options" @click="select(index)">
                        {{text}}
                    </dd>
                </dl>
            </transition>
        </div>
    </transition>
</template>

<style>
  .dialog-wrap{position:fixed;z-index:999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.7);}
  .dialog{position:absolute;left:0;bottom:0;width:94%;padding:0 3% 1em;line-height:4;background:#333742;}
  .dialog>dt{color:#999;}
</style>

<script>
    export default{
        props:["title","options"],
        methods:{
            select(index){
                this.$emit("dialog-selected",index);
            },
            closed(e){
              if(e.target===this.$el){
                 this.$emit("dialog-selected",-1);
              }
            }
        }
    }
</script>