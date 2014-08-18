

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





// map each vowel to key
var VowelMap={
  "あ":0,"い":2,"う":4,"え":5,"お": 7,
  "か":0,"き":2,"く":4,"け":5,"こ": 7,
  "さ":0,"し":2,"す":4,"せ":5,"そ": 7,
  "た":0,"ち":2,"つ":4,"て":5,"と": 7,
  "な":0,"に":2,"ぬ":4,"ね":5,"の": 7,
  "は":0,"ひ":2,"ふ":4,"へ":5,"ほ": 7,
  "ま":0,"み":2,"む":4,"め":5,"も": 7,
  "や":0,"ゆ":4,"よ":7,
  "ら":0,"り":2,"る":4,"れ":5,"ろ": 7,
  "わ":0,"ん":3,"を":7,
  "ば":0,"び":2,"ぶ":4,"べ":5,"ぼ": 7,
  "が":0,"ぎ":2,"ぐ":4,"げ":5,"ご": 7,
  "ざ":0,"じ":2,"ず":4,"ぜ":5,"ぞ": 7,
  "だ":0,"ぢ":2,"づ":4,"で":5,"ど": 7,
  "ぱ":0,"ぴ":2,"ぷ":4,"ぺ":5,"ぽ": 7,
  "きゃ":0,"きゅ":4,"きょ":7,
  "しゃ":0,"しゅ":4,"しょ":7,
  "ちゃ":0,"ちゅ":4,"ちょ":7,
  "てゃ":0,"てゅ":4,"てょ":7,
  "にゃ":0,"にゅ":4,"にょ":7,
  "ひゃ":0,"ひゅ":4,"ひょ":7,
  "みゃ":0,"みゅ":4,"みょ":7,
  "りゃ":0,"りゅ":4,"りょ":7,
  "ふぁ":0,
  "ぎゃ":0,"ぎゅ":4,"ぎょ":7,
  "じゃ":0,"じゅ":4,"じょ":7,
  "でゃ":0,"でゅ":4,"でょ":7,
  "みゃ":0,"みゅ":4,"みょ":7,
  "びゃ":0,"びゅ":4,"びょ":7,
  "ぴゃ":0,"ぴゅ":4,"ぴょ":7,
  "ふゃ":0,"ふゅ":4
};



// this function removes the special charactors from a lyric.
function translate(str){

var res=str;

res=res.replace(/（/gi,"");
res=res.replace(/）/gi,"");
res=res.replace(/[)]/gi,"");
res=res.replace(/[(]/gi,"");
res=res.replace(/-/gi,"");
res=res.replace(/ー/gi,"");
res=res.replace(/っ/gi,"");
res=res.replace(/!/gi,"");
res=res.replace(/[?]/gi,"");
res=res.replace(/！/gi,"");
res=res.replace(/？/gi,"");
res=res.replace(/~/gi,"");
res=res.replace(/～/gi,"");
res=res.replace(/a/gi,"え");
res=res.replace(/b/gi,"び");
res=res.replace(/c/gi,"し");
res=res.replace(/d/gi,"で");
res=res.replace(/e/gi,"い");
res=res.replace(/f/gi,"えふ");
res=res.replace(/gi/gi,"じ");
res=res.replace(/h/gi,"えいち");
res=res.replace(/i/gi,"あい");
res=res.replace(/j/gi,"じえ");
res=res.replace(/k/gi,"けい");
res=res.replace(/l/gi,"える");
res=res.replace(/n/gi,"えぬ");
res=res.replace(/m/gi,"えむ");
res=res.replace(/o/gi,"お");
res=res.replace(/p/gi,"ぴ");
res=res.replace(/q/gi,"きゅ");
res=res.replace(/r/gi,"あ");
res=res.replace(/s/gi,"えす");
res=res.replace(/t/gi,"てい");
res=res.replace(/u/gi,"ゆ");
res=res.replace(/v/gi,"ぶい");
res=res.replace(/w/gi,"だぶりゅ");
res=res.replace(/z/gi,"じ");

res=res.replace(/0/gi,"ぜろ");
res=res.replace(/1/gi,"いち");
res=res.replace(/2/gi,"に");
res=res.replace(/3/gi,"さん");
res=res.replace(/4/gi,"し");
res=res.replace(/5/gi,"ご");
res=res.replace(/6/gi,"ろく");
res=res.replace(/7/gi,"なな");
res=res.replace(/8/gi,"はち");
res=res.replace(/9/gi,"きゅ");
res=res.replace(/０/gi,"ぜろ");
res=res.replace(/１/gi,"いち");
res=res.replace(/２/gi,"に");
res=res.replace(/３/gi,"さん");
res=res.replace(/４/gi,"し");
res=res.replace(/５/gi,"ご");
res=res.replace(/６/gi,"ろく");
res=res.replace(/７/gi,"なな");
res=res.replace(/８/gi,"はち");
res=res.replace(/９/gi,"きゅ");

var tmp=new Array();
for(var j=0;j<res.length;++j) tmp[j]=res[j];
res=tmp;


if(res.length>0){
  if(res[0]=="ゃ") res[0]="や";
  if(res[0]=="ゅ") res[0]="ゆ";
  if(res[0]=="ょ") res[0]="よ";
  if(res[0]=="ぁ") res[0]="あ";
  if(res[0]=="ぃ") res[0]="い";
  if(res[0]=="ぅ") res[0]="う";
  if(res[0]=="ぇ") res[0]="え";
  if(res[0]=="ぉ") res[0]="お";
  if(res[0]=="ん") res=res.substr(-(res.length-1),res.length-1);
  for(var i=1;i<res.length;++i){
     if(res[i]=="ゃ"){
       if(res[i-1]=="あ" || res[i-1]=="い" || res[i-1]=="う" || res[i-1]=="え" || res[i-1]=="お" || res[i-1]=="ゃ" || res[i-1]=="ゅ" || res[i-1]=="ょ"){
         res[i]="や";
       }else if(VowelMap[res[i-1]]!=2 && res[i-1]!="て" && res[i-1]!="で" && res[i-1]!="ふ"){
         res[i]="や";
       }
     }else if(res[i]=="ゅ"){
       if(res[i-1]=="あ" || res[i-1]=="い" || res[i-1]=="う" || res[i-1]=="え" || res[i-1]=="お" || res[i-1]=="ゃ" || res[i-1]=="ゅ" || res[i-1]=="ょ"){
         res[i]="ゆ";
       }else if(VowelMap[res[i-1]]!=2 && res[i-1]!="て" && res[i-1]!="で" && res[i-1]!="ふ"){
         res[i]="ゆ";
       }
     }else if(res[i]=="ょ"){
       if(res[i-1]=="あ" || res[i-1]=="い" || res[i-1]=="う" || res[i-1]=="え" || res[i-1]=="お" || res[i-1]=="ゃ" || res[i-1]=="ゅ" || res[i-1]=="ょ"){
         res[i]="よ";
       }else if(VowelMap[res[i-1]]!=2 && res[i-1]!="て" && res[i-1]!="で"){
         res[i]="よ";
       }
     }else if(res[i]=="ぁ"){
       if(res[i-1]!="ふ") res[i]="あ";
     }else if(res[i]=="ぃ"){
       res[i]="い";
     }else if(res[i]=="ぅ"){
       res[i]="う";
     }else if(res[i]=="ぇ"){
       res[i]="え";
     }else if(res[i]=="ぉ"){
       res[i]="お";
     }
  }
}

return(res.join(""));
};




var HMMState=function(){

this._trans=new Array(6);
for(var i=0;i<6;++i) this._trans[i]=new Array();
this._transRate=new Array(6);
for(var i=0;i<6;++i){
  this._transRate[i]=new Array();
}
this._segment=-1;

};


HMMState.prototype={

// register a transition
_addTrans: function(next,vid,rate){

for(var i=0;i<this._trans[next].length;++i){
   if(vid==this._trans[next][i]){
     if(this._transRate[next][i]>rate){
       this._transRate[next][i]=rate;
     }
     return;
   }
}
this._trans[next][this._trans[next].length]=vid;
this._transRate[next][this._transRate[next].length]=rate;
}


};



var LyricSegment=function(){

this._length=0;
this._state=0;
this._parent=-1;
this._next=new Array();
this._children=new Array();
this._vowelarray="";
this._repeat=0;
this._lyrics={};
this._pointer=new Array();
this._originalRow=0;
this._idx=-1;
this._pid=0;

};


LyricSegment.prototype={


// get vowel key
_getVowel: function(pos){
if(this._pointer[pos]<this._lyrics.length-1){
  if(this._lyrics[this._pointer[pos]+1]=="ゃ" || this._lyrics[this._pointer[pos]+1]=="ゅ" || this._lyrics[this._pointer[pos]+1]=="ょ" || this._lyrics[this._pointer[pos]+1]=="ぁ"){
    return(VowelMap[this._lyrics[this._pointer[pos]]+this._lyrics[this._pointer[pos]+1]]);
  }
}
return(VowelMap[this._lyrics[this._pointer[pos]]]);
},


// get actual lyric
_getChar: function(pos){
if(this._pointer[pos]<this._lyrics.length-1){
  if(this._lyrics[this._pointer[pos]+1]=="ゃ" || this._lyrics[this._pointer[pos]+1]=="ゅ" || this._lyrics[this._pointer[pos]+1]=="ょ" || this._lyrics[this._pointer[pos]+1]=="ぁ"){
    return(this._lyrics[this._pointer[pos]]+this._lyrics[this._pointer[pos]+1]);
  }
}
return(this._lyrics[this._pointer[pos]]);
},


_compare: function(segment){

var mini=min(this._length,segment._length);

for(var i=0;i<mini;++i){
   if(this._segments[s]._getVerb(i)>this._segments[t]._getVerb(i)){
     return(1);
   }else if(this._segments[s]._getVerb(i)<this._segments[t]._getVerb(i)){
     return(-1);
   }
      
}

return(this._length-segment._length);
},


_setParent: function(p){

this._parent=p;

},


_addChild: function(c){

for(var i=0;i<this._children.length;++i){
   if(this._children[i]==c) return(i);
}
this._children[this._children.length]=c;
++this._length;

return(this._length-1);
},


_addNext: function(n){

for(var i=0;i<this._next.length;++i){
   if(this._next[i]==n) return;
}
this._next[this._next.length]=n;

}



};



