/* 全局方法 */

Function.prototype.method=function(k,n){
   return this.prototype[k]=n,this;
};

global.MusicJsonCallback=function(data) {
	this.MusicJsonCallback.data=data;
};

HTMLElement.prototype.on=function(type,f){
    var types=type.split(" "),i=0,ii=types.length;
    for(;i<ii;i++){
        this.addEventListener(types[i],f,false);
    }
    return this;
};

HTMLElement.prototype.off=function(type,f){
    var types=type.split(" "),i=0,ii=types.length;
    for(;i<ii;i++){
        this.removeEventListener(types[i],f,false);
    }
    return this;
};

global["$"]=function(a,b){return (b||document).querySelector(a)};
global.raf=global.requestAnimationFrame||global.webkitRequestAnimationFrame||function(f){return setTimeout(f,16.6667)};
global.caf=global.cancelAnimationFrame||global.webkitCancelAnimationFrame||function(f){clearTimeout(f)};

function Slider(options){
    this.el=options.el;
    this.hasDots=options.hasDots;
    this.isAutoPlay=options.isAutoPlay;
    this.callback=options.callback;
    this.timeout=options.timeout||4000;
    this.init();
};
Slider.method("init",function(){
    var inner=this.el.firstElementChild,lnks=inner.children,len=lnks.length,doc,node,i;

    if(len>0)
    { 
        this.lnks=lnks;       
        this.lazyimg(0);
    }
    if(len<2)return;
    this.len=len;
    this.step=0;
    doc=document;
    if(this.hasDots){
        i=len;
        node=doc.createElement("span");
        node.className="slider-dots";
        while(i--){
            node.appendChild(doc.createElement("i"))._index=len-i-1;
        }
        node.firstChild.className="on";
        this.position=node;
        this.el.appendChild(node);
    }

    this.frames=this.timeout/1000*60|0;
    this._couter=0;

    inner.appendChild(lnks[0].cloneNode(true));
    inner.appendChild(lnks[len-1].cloneNode(true));
    lnks=inner.children;

    i=len+1;
    while(i--){
      lnks[i].style.left=i*100+"%";
    }
    lnks[len+1].style.left="-100%";

    this.inner=inner;
    this.lnks=lnks;

    this.lazyimg(1);
    this.lazyimg(len+1);    

     inner.on("touchstart touchmove touchend touchcancel",this);

     this.isAutoPlay&&this.play();
}).method("calcImgLoad",function(){
    var step=this.step;
    this.lazyimg(step);
    step-1>0&&this.lazyimg(step-1);
    step+1<this.len+1&&this.lazyimg(step+1);
}).method("lazyimg",function(index){
	/*
    var lnks=this.lnks,src=lnks.eq(index).data("img"),img;
    if(!src)return;
    img=new Image();
    img.onload=function(){
        lnks.eq(index).removeClass("jw-loading").removeAttr("data-img").css("background-image","url('"+this.src+"')");
    };
    img.src=src;*/
}).method("setTranslate",function(t,parcent){
    var out="translateX(";
        out+=parcent;
        out+="%) translateZ(0)";
    t.style.transform=t.style.webkitTransform=out;
}).method("handleEvent",function(e){
    var t=e.currentTarget;
    switch(e.type){
        case "touchstart":
		   var p=t.parentNode.getBoundingClientRect(),
		       bound=t.getBoundingClientRect(),
			   allwidth,
			   offsetX=bound.left-p.left;

            this._cw=bound.width;
			allwidth=this._cw*this.len;

			t.classList.remove("anim");
			clearTimeout(this._timer);

            //图片位置  
            if(offsetX>0){
               offsetX-=allwidth;
			}
			else if(offsetX<-allwidth+100){
				offsetX+=allwidth+100;
			}

			this._percent=offsetX/this._cw*100;
			this.setTranslate(t,this._percent);

            this._isEnter=true;
             
			this._cx=e.touches[0].clientX;        
            this._cy=e.touches[0].clientY;
            this._isMove=true;
            this._dir=0;
            this._sTime=e.timeStamp;
            
            break;
        case "touchmove":
            if(this._isMove){
                if(this._dir===0){
                    this._dir=Math.abs(e.touches[0].clientX-this._cX)>Math.abs(e.touches[0].clientY-this._cy)?-1:1;
                }
                else if(this._dir===1){
                    var offsetX=e.touches[0].clientX-this._cx;
                    this.setTranslate(t,this._percent+(offsetX/this._cw)*100);
                }
            }
            break;
        case "touchcancel":
        case "touchend":
            this._isEnter=false; 
            if(this._isMove){
               if(this._dir===1){
                   var cx=e.changedTouches[0].clientX,
                       offsetX=cx-this._cx,
                       abX=Math.abs(offsetX);

                       this._percent=((this._percent/100)-0.5|0)*100
          
                       if(abX>this._cw/5||(e.timeStamp-this._sTime<300&&abX>5))
                       {
                           this._percent+=((offsetX>>31)*2+1)*100;                                                    
                       }

                      t.classList.add("anim");    

                      this.go();                     

               }
               this._isMove=false;
            }                       
            break;
    }

}).method("play",function(){
    var that=this,
        run=function(){
           if(++that._couter===that.frames){
              that._couter=0;
              that.next();
           }
           that._timer=raf(run);
        };
    this.inner.classList.add("anim");
    run();    
}).method("next",function(){
    this._percent=this._percent-100|0;
    if(this._percent===this.len*-100){
        this._percent=0;
        this.inner.classList.remove("anim");              
        this.setTranslate(this.inner,100);
        this.inner.offsetHeight;
        this.inner.classList.add("anim");                  
    }
    this.go();

}).method("go",function(){
    var i=this.len,pos,percent=this._percent,step=(((percent*-1/100)|0)+i)%i;
    this.stop();
    this.setTranslate(this.inner,percent);
    this.calcImgLoad();

    if(this.hasDots){
        pos=this.position.children;
        while(i--){
            pos[i].className=i===step?"on":"";
        }
    }
    this.callback&&this.callback.call(this,step);
    this._isEnter||this.isAutoPlay&&this.play();
}).method("stop",function(){
    this._couter=0;
    caf(this._timer);
});


global.Slider=Slider;