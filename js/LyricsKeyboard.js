

/*==============================================================================

    Copyright (c) 2014 Yamo

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    
    ----------------------------------------------------------------------------
    
    See http://www.yamo-n.org/livo & https://github.com/yamo-o/LiVo
    for more information
    
    contact: Kazuhiko Yamamoto [yamotulp(at)gmail.com] 
             Twitter: @yamo_o
    
==============================================================================*/




function SegmentSelect(idx){
LiVo._seek(idx);
};



function fillRoundRect(ctx,type,l,t,w,h,r,white){

var grad=ctx.createLinearGradient(l,t,l+w,t+h);
if(white==1){
  grad.addColorStop(0,"#EEEEEE");
  grad.addColorStop(1,"#FFFFFF");
}else{
  grad.addColorStop(0,"#888888");
  grad.addColorStop(1,"#CCCCCC");
}
ctx.fillStyle=grad;

var pi=Math.PI;
ctx.beginPath();
ctx.arc(l+r,t+r,r,-pi,-0.5*pi,false);
ctx.arc(l+w-r,t+r,r,-0.5*pi,0,false);
ctx.arc(l+w-r,t+h-r,r,0,0.5*pi,false);
ctx.arc(l+r,t+h-r,r,0.5*pi,pi,false);
ctx.closePath();

switch(type){
      case "fill":
         ctx.fill();
         break;
      case "stroke":
         ctx.stroke();
         break;
}

};




var LyricsKeyboard=function(elementName){

this._size={"width":1024,"height":320};    
this._canvas=document.getElementById(elementName);
this._canvas.setAttribute("width",this._size.width+"px");
this._canvas.setAttribute("height",this._size.height+"px");
this._ctx=this._canvas.getContext("2d");

this._connected=false;
this._MIDIEvent=false;
this._timerId=false;
this._noteOnW=new Array(0,0,0,0,0);
this._noteOnB=new Array(0,0,0);

};



LyricsKeyboard.prototype={


_setConnected: function() {
this._connected=true;
},

    
_noteOn: function(note){

for(var i=0;i<5;++i) this._noteOnW[i]=0;
for(var i=0;i<3;++i) this._noteOnB[i]=0;

if(note==65){
  this._noteOnW[0]=1;
}else if(note==83){
  this._noteOnW[1]=1;
}else if(note==68){
  this._noteOnW[2]=1;
}else if(note==70){
  this._noteOnW[3]=1;
}else if(note==32){
  this._noteOnW[4]=1;
}else if(note==87){
  this._noteOnB[0]=1;
}else if(note==69){
  this._noteOnB[1]=1;
}else{
  this._noteOnW[2]=1;
}

},

_noteOff: function(note){

for(var i=0;i<5;++i) this._noteOnW[i]=0;
for(var i=0;i<3;++i) this._noteOnB[i]=0;

},


_draw: function(acriveKey){

this._ctx.strokeStyle="#FFFFFF";
this._ctx.clearRect(0,0,1024,320);

this._ctx.strokeStyle="#707070";
for(var i=0;i<5;++i){
   if(this._noteOnW[i]>0) fillRoundRect(this._ctx,"fill",80*i+0.5,10+0.5,75,200,5,0);
    else fillRoundRect(this._ctx,"fill",80*i+0.5,10+0.5,75,200,5,1);
   fillRoundRect(this._ctx,"stroke",80*i+0.5,10+0.5,75,200,1);
}

//C#
if(this._noteOnB[0]>0) fillRoundRect(this._ctx,"fill",40+0.5,10+0.5,60,150,5,0);
else fillRoundRect(this._ctx,"fill",40+0.5,10+0.5,60,150,5,1);
fillRoundRect(this._ctx,"stroke",40+0.5,10+0.5,60,150,5,0);
//D#
if(this._noteOnB[1]>0) fillRoundRect(this._ctx,"fill",40+80+0.5,10+0.5,60,150,5,0);
else fillRoundRect(this._ctx,"fill",40+80+0.5,10+0.5,60,150,5,1);
fillRoundRect(this._ctx,"stroke",40+80+0.5,10+0.5,60,150,5,0);
//F#
if(this._noteOnB[2]>0) fillRoundRect(this._ctx,"fill",40+80*3+0.5,10+0.5,60,150,5,0);
else fillRoundRect(this._ctx,"fill",40+80*3+0.5,10+0.5,60,150,5,1);
fillRoundRect(this._ctx,"stroke",40+80*3+0.5,10+0.5,60,150,5,0);

this._ctx.strokeStyle="#000000";
this._ctx.font="20px 'Arial'";

if(LiVo._keys["C"].length==1) this._ctx.strokeText(LiVo._keys["C"],30+0.5,200);
else this._ctx.strokeText(LiVo._keys["C"],30+0.5-10,200);

this._ctx.strokeText(LiVo._keys["D"],30+80+0.5,200);

this._ctx.strokeText(LiVo._keys["D#"],60+80+0.5,150);

if(LiVo._keys["E"].length==1) this._ctx.strokeText(LiVo._keys["E"],30+80*2+0.5,200);
else this._ctx.strokeText(LiVo._keys["E"],30+80*2+0.5-10,200);

if(LiVo._keys["F"].length==1) this._ctx.strokeText(LiVo._keys["F"],30+80*3+0.5,200);
else this._ctx.strokeText(LiVo._keys["F"],30+80*3+0.5-10,200);

if(LiVo._keys["G"].length==1) this._ctx.strokeText(LiVo._keys["G"],30+80*4+0.5,200);
else this._ctx.strokeText(LiVo._keys["G"],30+80*4+0.5-10,200);


this._ctx.strokeStyle="#00FFFF";

this._ctx.beginPath();
this._ctx.moveTo(395.5,110.5);
this._ctx.lineTo(420,110.5);
this._ctx.closePath();
this._ctx.stroke();

this._ctx.beginPath();
this._ctx.arc(500,110,80,0,Math.PI*2,false);
this._ctx.closePath();
this._ctx.stroke();

this._ctx.fillStyle="#FF3399";

this._ctx.font="80px 'Arial'";
if(LiVo._current.length==1) this._ctx.fillText(LiVo._current,460,140);
else this._ctx.fillText(LiVo._current,420,140);

}


};


