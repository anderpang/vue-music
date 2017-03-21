export default {
    install:function(Vue){
        var noop=function(){},
            then=function(f){this.success=f};

        Vue.prototype.jsonp=function(path,cb){
            var vue=this,doc=document,pm={success:noop,then:then},
                script=doc.createElement("script");
                script.onload=function(){
                    pm.success.call(vue);
                };
                script.asyn=true;
                script.src=path;
               doc.head.appendChild(script);
               return pm;
        };

        Vue.prototype.getBackBg=function(url){
            var css="background-image:url('";
                css+=url;
                css+="');";
           return css;
        };


        Vue.prototype.musicModule={
            target:null,
            currentIndex:0,
            listMode:0,
            listModeTexts:["顺序播放","单曲播放","随机播放"],
            loading:'<p class="tc loading-wrap"><i class="loading"></i></p>',
            list:[],
            init:function(vue){
            var isTouch=typeof vue.$el.ontouchstart!=="undefined",
                events=this.events={},
                audio=new Audio(),
                el=vue.$el;

                this.target=audio;
                this.vue=vue;

                if(isTouch)
                {
                    events.mousedown="touchstart";
                    events.mousemove="touchmove";
                    events.mouseup="touchend touchcancel";
                }
                else
                {
                    events.mousedown="mousedown";
                    events.mousemove="mousemove";
                    events.mouseup="mouseup mouseleave";
                }

            this.readCache();

            this.bind();
            this._tmplist=[];
            this._history=[];
           // this.target.autoplay=true;
           // this.target.src=this.list[this.currentIndex];
            },
            getLrcList:function(lrc){
            var list=lrc.split("\n"),
                reg=/\[(\d{2}):(\d{2})[\.:]?(\d{2})*\](?=[^\n])/g,
                i=list.length,
                result=[],
                factory=function(m,s,ss){
                    m=parseInt(m,10)||0;
                    s=parseInt(s,10)||0;
                    ss=parseInt(ss,10)||0;

                    ss=(m*60+s)*1000+ss;
                    return ss;   //毫秒
                },
                line,
                tmp,
                j,
                m;
                while(i--)
                {
                    line=list[i].trim();
                    if(!line)continue;
                    tmp=[];
                    while(m=reg.exec(line))
                    {
                        tmp.push(factory(m[1],m[2],m[3]));
                    }	
                    j=tmp.length;
                    if(j)
                    {
                        line=RegExp["$'"].trim();
                        while(j--)
                        {
                            result.push([tmp[j],line]);
                        }
                    }
                }

                result.sort(function(a,b){
                    return b[0]-a[0];
                });

                return result;
            },

            getLrcHtml:function(list){
            var html='<ul class="msc-lrc-list">',
                i=list.length;
                while(i--)
                {
                    html+='<li>';
                    html+=list[i][1];
                    html+='</li>';
                }
                html+='</ul>';
                return html;
            },

            putLrc:function(){
                var song=this.list[this.currentIndex],
                    lrc=song.lrc,
                    lrcList,
                    ctx=$(".music-lrc",this.vue.$el);

                if(!lrc){
                    ctx.innerHTML="<p class=\"c3\">暂无歌词</p>";
                    this.currentLrcList=null;
                    return;
                }

                if(song.hasOwnProperty("lrcList"))
                {		
                    lrcList=song.lrcList; 
                }
                else
                {
                    lrcList=this.getLrcList(lrc);
                    lrc=this.getLrcHtml(lrcList);
                    song.lrc=lrc;
                    song.lrcList=lrcList;
                }

                ctx.innerHTML=lrc;
                this.currentLrcList=lrcList;
            },
            lrc_scroll:function(li){
                var that=this,
                    ul=li.parentNode,
                    wrap=ul.parentNode,		    
                    bound=wrap.getBoundingClientRect(),
                    bound1=ul.getBoundingClientRect(),
                    bound2=li.getBoundingClientRect(),
                    b=wrap.scrollTop,
                    c=bound2.top-bound1.top<bound.height/2?-b:bound2.top-bound1.top+bound2.height/2-bound.height/2-b,
                    t=0,
                    frames=30,
                    scr=function(){
                        if(t>=frames)
                        {
                            wrap.scrollTop=b+c;
                        }
                        else
                        {
                            wrap.scrollTop=that.ease(b,c,++t,frames);
                            wrap._timer=raf(scr);
                        }
                    };

                    li.classList.add("cur");
                    caf(wrap._timer);
                    scr();		 
                
            },
            ease:function(b,c,t,d){
                return (t/=d/2)<1?b+c/2*t*t:b+c-c/2*(2-t)*(2-t);
            },
            readCache:function(){
            this.listMode=parseInt(localStorage.getItem("music-mode"),10)||0;
            },
            resetRndPlay:function(){
                var c=this.curerntIndex,i=this.list.length,tmp=this._tmplist;
                tmp.length=0;
                while(i--)
                {
                  i===c||tmp.push(i);
                }
            },
            tip:function(msg){
                var span=document.createElement("span"),
                    f=function(msg){
                        span.innerHTML=msg;
                        span.classList.remove("show");
                        span.offsetHeight;
                        span.classList.add("show");
                    };
                span.className="tip";
                document.body.appendChild(span);
                this.tip=f;
                f(msg);
            },
            bind:function(){
                var music=this,
                    el=this.vue.$el,
                    audio=this.target,
                    music_lrc=$(".music-lrc",el),
                    progress_bar=$(".progress-bar",el),
                    btn,
                    times=$(".music-time",el).children;

                function setModeBtnState(){
                    switch(music.listMode)
                    {
                        case 2:				    
                        this.classList.remove("msc-one-btn");
                        this.classList.add("msc-rnd-btn");
                        music.resetRndPlay();
                        break;
                        case 1:
                        this.classList.add("msc-one-btn");
                        break;
                        default:
                        this.classList.remove("msc-rnd-btn");
                        break;
                    }
                    this.title=music.listModeTexts[music.listMode];
                }

                function disposeTime(seconds){
                    var m=seconds/60|0,
                        s=seconds-m*60|0;

                        m=String(m+100).slice(1);
                        m+=":";
                        m+=String(s+100).slice(1);
                        return m;
                }

                audio.on("durationchange",function(){
                        times[1].textContent=disposeTime(this.duration);
                }).on("timeupdate",function(){
                    var ct=this.currentTime,
                        percent=ct/this.duration*100;
                        percent+="%";

                        music._progress_mousedown||(progress_bar.style.width=percent);

                        times[0].textContent=disposeTime(ct);

                        //歌词
                    var list=music.currentLrcList,i,ii,ss=ct*1000,li; //list为倒序
                    if(!list)return;
                    i=ii=list.length;			   
                    while(i--)
                    {
                        if(list[i][0]>ss)
                        {
                            ++i;
                            break;
                        }
                    }

                    i=Math.min(ii-1,Math.max(0,ii-i-1));

                    if(music_lrc._scroll_index!==i)
                    {
                        music_lrc._scroll_index=i;
                        li=music_lrc.querySelector(".cur");
                        li&&li.classList.remove("cur");

                        music.lrc_scroll(music_lrc.firstElementChild.children[i]);
                    }

                }).on("ended",function(){
                    var cur,tmp,i,hst=music._history,i=hst.length;
                    
                    if(i&&i===music.list.length)
                    {
                        hst.shift();
                    }
                    music.historyIndex=hst.push(music.currentIndex);
                    
                    switch(music.listMode)
                    {
                        case 2://随机
                            tmp=music._tmplist;
                            i=tmp.length;
                        if(!i)
                        {
                            music.resetRndPlay();
                            i=tmp.length;
                        }
                        i=Math.random()*i|0;
                        music.currentIndex=i;
                        cur=music.list[tmp[i]];
                        audio.src=cur.url;
                        tmp.splice(i,1);
                        break;
                        case 1://单曲
                            audio.currentTime=0;
                        break;
                        default: //顺序
                            cur=music.list[music.currentIndex=++music.currentIndex%music.list.length];
                            audio.src=cur.url;		
                        break;
                    }

                    if(cur){
                        //改标题
                         music.vue.title=music.songname;
                         music.vue.songer=cur.songer;
                       // $(".header-title",el).textContent=cur.split(".")[0];
                    }
                    audio.play();
                }).on("play",function(){
                    caf(music_lrc._timer);
                    music.putLrc();
                }).on("error",function(){
                    music.tip("企鹅音乐接口不给力，这首播放不了！");
                });                

                btn=$(".msc-circ-btn",el).on("click",function(){
                    music.listMode=++music.listMode%3;
                    setModeBtnState.call(this);
                    localStorage.getItem("music-mode",music.listMode);
                });
                setModeBtnState.call(btn);                

                $(".msc-play-btn",el).on("click",function(){
                    if(this.classList.toggle("msc-pause-btn"))
                    {
                        audio.pause();
                        audio.autoplay=false;
                    }
                    else
                    {
                        audio.play();
                        audio.autoplay=true;
                    }
                });

                $(".music-progress",el).on("click",function(e){
                    if(e.target.tagName==="I")return;
                    var that=this,
                        bound=this.getBoundingClientRect(),
                        cx=e.clientX,
                        bar=this.firstElementChild,
                        percent=Math.max(0,Math.min(1,(cx-bound.left)/bound.width)),
                        b=parseInt(bar.style.width,10)||0,
                        c=percent*100-b,
                        t=0,
                        frames=30,
                        audio=music.target,
                        isPaused=audio.paused,   
                        move=function(){
                            if(t>=frames)
                            {
                                bar.style.width=percent*100+"%";
                                audio.currentTime=audio.duration*percent;
                                isPaused||audio.play();     
                            }
                            else
                            {
                            
                                bar.style.width=music.ease(b,c,++t,frames)+"%";
                                that._timer=raf(move);
                            }
                        };
                        caf(this._timer);
                        audio.pause();
                        move();
                    
                }).querySelector("i").on(this.events.mousedown,function(e){
                    var bar=this.parentNode,
                        bound=bar.getBoundingClientRect();
                    e.preventDefault();
                    e.stopPropagation();
                    
                    bar._cx=e.type==="mousedown"?e.clientX:e.touches[0].clientX;
                    bar._offsetX=bar._cx-bound.right;
                    bar._ox=bound.left;
                    bar._ow=bar.parentNode.clientWidth;

                    music._progress_mousedown=true;			   
                });
                
                el.on(this.events.mousemove,function(e){
                    if(music._progress_mousedown)
                    {
                        e.preventDefault();
                        e.stopPropagation();
                        var bar=progress_bar,
                            cx=e.type==="mousemove"?e.clientX:e.touches[0].clientX,
                            percent=(cx-bar._ox-bar._offsetX)/bar._ow;

                            bar.style.width=percent*100+"%";
                        
                    }
                }).on(this.events.mouseup,function(e){
                    if(music._progress_mousedown)
                    {
                        var bar=progress_bar,
                            cx=e.type==="mouseup"||e.type==="mouseleave"?e.clientX:e.changedTouches[0].clientX,
                            percent=(cx-bar._ox-bar._offsetX)/bar._ow;

                            e.preventDefault();
                            e.stopPropagation();

                            music._progress_mousedown=false;

                            bar.style.width=percent*100+"%";
                            audio.currentTime=audio.duration*percent;
                    }

                });

                $(".msc-prev-btn",el).on("click",function(){
                    var hst=music._history,
                        i=hst.length,
                        ii,
                        song;
                        if(i)
                        {
                            i=--music.historyIndex;
                            if(i<0)
                            {
                                var evt=document.createEvent("HTMLEvents");
                                evt.initEvent("ended",true,false);
                                audio.dispatchEvent(evt);
                            }
                            else
                            {                                
                                song=music.list[i];
                                audio.src=song.url;
                                music.currentIndex=i;
                                music.vue.title=song.songname;
                                music.vue.songer=song.songer;
                                //$(".header-title",el).textContent=music.list[i].split(".")[0];
                            }
                        }
                        else
                        {
                            ii=music.list.length;
                            if(ii===1)return;
                            i=(--music.currentIndex+ii)%ii;
                            music.currentIndex=i; 
                            i=music.list[i];                           
                            music.play(i);
                        }
                });

                $(".msc-next-btn",el).on("click",function(){
                    var evt=document.createEvent("HTMLEvents");
                        evt.initEvent("ended",true,false);
                        audio.dispatchEvent(evt);
                });

                $(".header",el).on("click",function(e){
                   var t=e.target;
                   e.preventDefault();
                   if(t.classList.contains("msc-sound-btn")){
                        audio.muted=t.classList.toggle("msc-mute-btn");
                        return;
                   }
                   if(t.classList.contains("back-btn")){
                       music.showView("MINI");
                       return;
                   }                   

                   music.showView("FULLSCREEN");
                });
            },
            showView:function(status){
               //status: MINI；FULLSCREEN;
               if(status==="FULLSCREEN"){
                   this.vue.$el.parentNode.classList.remove("mini-player");
                   this.vue.$el.classList.add("fullscreen");
               }
               else
               {
                   this.vue.$el.parentNode.classList.add("mini-player");
               }
            },
            exisits:function(songid){
                var list=this.list,i=list.length;
                while(i--){
                    if(list[i].id===songid){
                        this.currentIndex=i;
                        return list[i];
                    }
                }
                return null;
            },
            play:function(song){
                var music=this,vue=this.vue,findSong;
                var url="http://ws.stream.qqmusic.qq.com/";
                    url+=song.id;
                    url+=".m4a?fromtag=46";

                var lrcApi="https://api.darlin.me/music/lyric/";            
                    lrcApi+=song.id;
                    lrcApi+="/?callback=MusicJsonCallback";

                this.showView("FULLSCREEN");
                music.target.pause();

                $(".msc-play-btn",vue.$el).classList.remove("msc-pause-btn");

                findSong=this.exisits(song.id);

                if(findSong){
                    music.target.src=findSong.url;
                    vue.singer=findSong.singer;
                    vue.title=findSong.songname;
                    music.target.play();
                    return;
                }

                $(".music-lrc",vue.$el).innerHTML=this.loading;

                vue.jsonp(lrcApi).then(function(){            
                    var result=MusicJsonCallback.data,ii;
                    MusicJsonCallback.data=null;

                    if(result.code===0)
                    {
                        song.url=url;
                        song.lrc=vue.decode(result.lyric);
                        ii=music.list.push(song);
    
                        music.currentIndex=ii-1;                        
                        music.target.src=url;
                        vue.singer=song.singer;
                        vue.title=song.songname;
                        music.target.play();
                    }
                });
            }
        };
    }
}