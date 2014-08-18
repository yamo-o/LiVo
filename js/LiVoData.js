

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



var JSLiVoData=function(){

this._num_segments=0;
this._num_leaf_segments=0;
this._segments=new Array();
this._markers=new Array();
this._totalLen=0;
this._num_states=0;
this._states=null;
this._nLevels=0;
this._rawtext=null;
this._text=new Array();
this._rate=null;

// default
var text="かえるの うたが\nきこえて くるよ\n\nけろけろ けろ けろ\nけろけろけろけろ ぐわぐわぐわ\n\n\nぐわん"


this._transitions=new Array(6);
for(var i=0;i<6;++i){
   this._transitions[i]=new Array(6);
   for(var j=0;j<6;++j) this._transitions[i][j]=new Array();
}

this._parse(text);

};



JSLiVoData.prototype={


_clear: function(){

this._num_segments=0;
this._segments=null;
this._segments=new Array();
this._markers=null;
this._markers=new Array();
this._states=null;
this._text={};
this._rawtext={};
this._totalLen=0;


this._transitions=new Array(6);
for(var i=0;i<6;++i){
   this._transitions[i]=new Array(6);
   for(var j=0;j<6;++j) this._transitions[i][j]=new Array();
}


document.getElementById("SegmentCanvasArea").innerHTML="";

},



_parse: function(str){


this._markers[0]=1;
this._num_segments=0;
var lines=new Array();
lines=str.split("\n");
var prev=0;
var linefeeds=0;
var maxfeeds=0;
this._nLevels=0;


// first I construct lyric segment array

for(var i=0;i<lines.length;++i){

   if(lines[i].length==0){
     if(this._num_segments>0) linefeeds++;
     continue;
   }

   var str=lines[i][0];
   for(var j=1;j<lines[i].length;++j){

      var ismarker=0;
      if(lines[i][j]==" " || lines[i][j]=="　"){
        ismarker=1;
      }else if(lines[i][j]=="," || lines[i][j]=="、" || lines[i][j]=="." || lines[i][j]=="。"){
        ismarker=2;
        while(j<lines[i].length-2){
             if(lines[i][j+1]!=" " && lines[i][j+1]!="　") break;
             ++j;
        }
      }
      
      if(ismarker>0 || j==lines[i].length-1){

        if(j==lines[i].length-1 && ismarker==0) str+=lines[i][j];

        if(str.length>0){

          var newstr=translate(str);
          if(newstr.length==1){
            if(this._num_segments>0){
              this._segments[this._num_segments-1]._lyrics+=newstr;
              this._segments[this._num_segments-1]._length++;
            }else{
              this._segments[this._num_segments]=new LyricSegment;
              this._segments[this._num_segments]._lyrics=new Array();
              this._segments[this._num_segments]._originalRow=i;
              this._segments[this._num_segments]._lyrics=newstr;
              this._segments[this._num_segments]._lyrics+=this._segments[this._num_segments]._lyrics;
              this._segments[this._num_segments]._length=this._segments[this._num_segments]._lyrics.length;
              this._markers[this._markers.length]=linefeeds;
              if(linefeeds>maxfeeds) maxfeeds=linefeeds;
              linefeeds=0;
              if(ismarker>1) linefeeds++;
              this._num_segments++;
            }
          }else if(str[0]=="ん" && this._num_segments>0){
            this._segments[this._num_segments-1]._lyrics+=newstr;
            this._segments[this._num_segments-1]._length=this._segments[this._num_segments-1]._lyrics.length;
          }else if(newstr.length!=0){
            this._segments[this._num_segments]=new LyricSegment;
            this._segments[this._num_segments]._lyrics=new Array();
            this._segments[this._num_segments]._originalRow=i;
            this._segments[this._num_segments]._lyrics=newstr;
            this._segments[this._num_segments]._length=this._segments[this._num_segments]._lyrics.length;
            this._markers[this._markers.length]=linefeeds;
            if(linefeeds>maxfeeds) maxfeeds=linefeeds;
            linefeeds=0;
            if(ismarker>1) linefeeds++;
            this._num_segments++;
          }
          
          str="";

        }

      }else{

        str+=lines[i][j];

      }
   }
   
   linefeeds=2;
  
}


// ready for construction of hierarchy level


var ii=0;
for(;ii<this._num_segments;++ii){
   if(this._markers[ii]==0) break;
}
if(ii==this._num_segments){
  for(var i=0;i<this._num_segments;++i){
     this._markers[i]--;
  }
  --maxfeeds;
}

this._markers[0]=maxfeeds;
for(var i=0;i<this._num_segments;++i){
   if(this._markers[i]>0){
     var j=0;
     for(;j<this._num_segments;++j){
        if(this._markers[j]==this._markers[i]-1) break;
     }
     if(j==this._num_segments){
       var l=this._markers[i];
       for(var k=0;k<this._num_segments;++k){
          if(this._markers[k]>=l) this._markers[k]--;
       }
       --maxfeeds;
     }
   }
}


// combine the small charactors with previous segment

var num_segments=this._num_segments;

for(var j=0;j<this._num_segments;++j){
   var p=0;
   for(var i=0;i<this._segments[j]._lyrics.length;++i){
      if(this._segments[j]._lyrics[i]=="ゃ" || this._segments[j]._lyrics[i]=="ゅ" || this._segments[j]._lyrics[i]=="ょ" || this._segments[j]._lyrics[i]=="ぁ"){
        this._segments[j]._length--;
      }else{
        this._segments[j]._pointer[p]=i;
        ++p;
      }
   }
}


// detection of repeat segment
this._detectRepeat();

// search the segment that has same text with another 
for(var s=0;s<this._num_segments-1;++s){

   if(this._segments[s]._length<=0) continue;

   var same=true;
   var t=s+1;
   while(same){

        same=false;
        
        if(this._segments[s]._length==this._segments[t]._length){
          var i=0; 
          for(;i<this._segments[s]._length;++i){
             if(this._segments[s]._getChar(i)!=this._segments[t]._getChar(i)) break;
          }
          if(i==this._segments[s]._length) same=true;
        }
        if(!same) break;
   
        this._segments[s]._repeat+=this._segments[t]._repeat+1;
        this._segments[t]._length=0;
        ++t;
        if(t>=this._num_segments) break;

   }
   s=t;

}

var sidx=0;
for(var s=0;s<this._num_segments;++s){
   if(this._segments[s]._length>0){
     if(this._segments[s]._length==1){
       this._segments[s]._lyrics[1]=this._segments[s]._lyrics[0];
       this._segments[s]._length=2;
     }
     this._segments[s]._idx=sidx;
     ++sidx;
   }
}


// register the segment chain

for(var s=0;s<num_segments;++s){
   if(this._segments[s]._length==0) continue;
   var t=(s+1)%num_segments;
   while(1){
        if(this._segments[t]._length>0){
          this._segments[s]._addNext(t);
          if(this._segments[s]._repeat>0){
            for(var i=0;i<Math.min(this._segments[s]._length,this._segments[t]._length);++i){
               if(this._segments[s]._getVowel(i)==this._segments[t]._getVowel(i)){
                 if(this._segments[s]._getChar(i)!=this._segments[t]._getChar(i)){
                   this._segments[s]._repeat*=-1;
                   break;
                 }
               }
            }
          }
          break; 
        }
        ++t;
        if(t>=num_segments) break;
   }
}


for(var j=0;j<num_segments;++j){
   
   if(this._segments[j]._length==0) continue;
   
   for(var i=j+1;i<num_segments;++i){
      
      if(this._segments[i]._length==0) continue;
      
      if(i!=this._segments[j]._next[0]){

        if(this._segments[j]._lyrics==this._segments[i]._lyrics){
          var m=this._segments[i]._next[0];
          var n=this._segments[j]._next[0];
          var lastm=i;
          var lastn=j;
          while(this._segments[m]._lyrics==this._segments[n]._lyrics){
               if(this._segments[m]._length==0 || this._segments[n]._length==0) break;
               lastm=m;
               lastn=n;
               m=this._segments[m]._next[0];
               n=this._segments[n]._next[0];
          }
          for(var k=0;k<this._segments[lastm]._next.length;++k){
             this._segments[lastn]._addNext(this._segments[lastm]._next[k]);
          }
          for(var k=0;k<this._segments[lastn]._next.length;++k){
             this._segments[lastm]._addNext(this._segments[lastn]._next[k]);
          }
          
        }

      }
   
   }
}


this._num_leaf_segments=num_segments;


// clustering

var region=new Array(num_segments);
for(var i=0;i<num_segments;++i){
   region[i]=i;
}

this._nLevels=1;
for(var p=0;p<maxfeeds;++p){
   for(var i=0;i<num_segments;++i){
      if(this._segments[i]._length>0){
        if(this._markers[i]>p){
          this._segments[this._num_segments]=new LyricSegment;
          this._num_segments++;
        }
        var pid=this._segments[this._num_segments-1]._addChild(region[i]);
        this._segments[region[i]]._setParent(this._num_segments-1);
        this._segments[region[i]]._pid=pid;
        region[i]=this._num_segments-1;
      }
   }
   this._nLevels++;
}

this._segments[this._num_segments]=new LyricSegment;
this._num_segments++;
for(var i=0;i<num_segments;++i){
   if(this._segments[i]._length>0){
     this._segments[this._num_segments-1]._addChild(region[i]);
     this._segments[region[i]]._setParent(this._num_segments-1);
   }
}
this._nLevels++;


// create hidden malkov model states

var vowel2idx=new Array(0,0,1,5,2,3,3,4);

this._totalLen=0;
for(var i=0;i<num_segments;++i){
   this._totalLen+=this._segments[i]._length;
}


this._states=new Array(this._totalLen);
for(var i=0;i<this._totalLen;++i){
   this._states[i]=new HMMState;
}


this._rawtext=new Array(this._totalLen);
var idx=0;
for(var i=0;i<num_segments;++i){
   this._segments[i]._state=idx;
   for(var j=0;j<this._segments[i]._length;++j){
      this._rawtext[idx]=this._segments[i]._getChar(j);
      this._states[idx]._segment=i;
      ++idx;
   }
}


// calcurate each transition rate

var find=0;
var next=new Array();
var prior=new Array();
var count=new Array();

var maxpri=0;

var align=new Array();

for(var i=0;i<this._totalLen;++i){

   find=0;

   var seg=this._states[i]._segment;
   var offset=i-this._segments[seg]._state;
   
   var idx=(i+1)%this._totalLen;
   var seg2=this._states[idx]._segment;
   var offset2;
   if(i==this._totalLen-1){
     offset2=0;
   }else{
     offset2=i+1-this._segments[seg2]._state;
   }
   
   next[0]=idx;
   prior[0]=1;
   next[1]=i;
   prior[1]=4;
   find=2;
   
   
   if(this._segments[seg]._repeat!=0){
     if(offset==this._segments[seg]._length-1){
       next[find]=this._segments[seg]._state;
       prior[find]=0;
       ++find;
       next[find]=this._segments[seg]._state+1;
       prior[find]=5;
       ++find;
     }
     if(offset==this._segments[seg]._length-2){
       next[find]=this._segments[seg]._state;
       prior[find]=5;
       ++find;
     }
   }else{
     if(offset==this._segments[seg]._length-1){
       next[find]=this._segments[seg]._state;
       prior[find]=3;
       ++find;
     }
   }
   
   if(offset<this._segments[seg]._length-2){
     idx=i+2;
     seg2=this._states[idx]._segment;
     offset2=i+2-this._segments[seg2]._state;
     next[find]=idx;
     prior[find]=5;
     ++find;
   }
   
   if(this._segments[seg]._next.length>0){
     for(var k=0;k<this._segments[seg]._next.length;++k){
        next[find]=this._segments[this._segments[seg]._next[k]]._state;
        if(offset==this._segments[seg]._length-1) prior[find]=2;
        else if(offset==this._segments[seg]._length-2) prior[find]=5;
        else prior[find]=6;
        ++find;
     }
   }


   //jump
        
   var maxp=7;

   if(offset>=this._segments[seg]._length-1){
     for(var k=0;k<this._segments[this._segments[seg]._parent]._length;++k){
        if(k==this._segments[seg]._pid || k==this._segments[seg]._pid+1) continue;
        next[find]=this._segments[this._segments[this._segments[seg]._parent]._children[k]]._state;
        prior[find]=7+(k-this._segments[seg]._pid)*(k-this._segments[seg]._pid);
        if(prior[find]>maxp) maxp=prior[find];
        ++find;
     }
   }else{
     for(var k=0;k<this._segments[this._segments[seg]._parent]._length;++k){
        if(k==this._segments[seg]._pid) continue;
        next[find]=this._segments[this._segments[this._segments[seg]._parent]._children[k]]._state;
        prior[find]=7+(k-this._segments[seg]._pid)*(k-this._segments[seg]._pid);
        if(prior[find]>maxp) maxp=prior[find];
        ++find;
     }
   }
   
   
   var level=this._markers[seg];
   var parent=seg;
   var pid=this._segments[seg]._pid;
   for(var k=0;k<level+1;++k){
      pid=this._segments[parent]._pid;
      parent=this._segments[parent]._parent;
   }
   

   if(level>0){
     var maxpp=maxp;
     for(var k=0;k<this._segments[parent]._length;++k){
        if(k==pid) continue;
        var s=this._segments[parent]._children[k];
        while(this._segments[s]._children.length>0){
             s=this._segments[s]._children[0];
        }
        var m=0;
        for(;m<find;++m){
           if(next[m]==this._segments[s]._state) break;
        }
        if(m==find){
          var pri=maxp+(k-this._segments[this._segments[parent]._children[k]]._pid)*(k-this._segments[this._segments[parent]._children[k]]._pid);
          next[find]=this._segments[s]._state;
          prior[find]=pri;
          if(prior[find]>maxpp) maxpp=prior[find];
          ++find;
        }else{
          var pri=maxp+(k-this._segments[this._segments[parent]._children[k]]._pid)*(k-this._segments[this._segments[parent]._children[k]]._pid);
          if(pri<prior[m]){
            next[find]=this._segments[s]._state;
            prior[find]=pri;
            if(prior[find]>maxpp) maxpp=prior[find];
            ++find;
          }        
        }
     }
     maxp=maxpp;
   }


   var sum=0;
   var maxr=0;
   for(var j=0;j<find;++j){ 
      if(next[j]==i) continue;
      count[j]=1;
      for(var k=0;k<find;++k){
         if(next[k]==i) continue;
         if(prior[k]>prior[j]) count[j]+=1;
      }
      if(prior[j]==1){
        if(vowel2idx[this._segments[this._states[next[j]]._segment]._getVowel(next[j]-this._segments[this._states[next[j]]._segment]._state)]==5) count[j]*=2;
      }
      sum+=count[j];
      if(prior[j]>maxr) maxr=prior[j];
   }
   
   if(maxr>maxpri) maxpri=maxr;
   
   for(var f=0;f<find;++f){
      if(next[f]==i && prior[f]!=4) continue;
      
      var j=0;
      for(;j<align.length;++j){
         if(align[j]==prior[f]) break;
      }
      if(j==align.length){
        for(j=0;j<align.length;++j){
           if(align[j]>prior[f]){
             align[align.length]=prior[f];
             for(var k=align.length-1;k>j;--k){
                align[k]=align[k-1];
             }
             align[j]=prior[f];
             break;
           }
        }
        if(j==align.length){
          align[align.length]=prior[f];
        }
      }
   }
   
   //console.log("rate");
   for(var j=0;j<find;++j){
      //var r=count[j]/sum;//*maxr;
      //var r=prior[j];//(-1.0/20.0*prior[j]+1.0);
      //r=(-1.0*(1-r)+1.0);
      if(next[j]==i && prior[j]!=4) continue;
      //console.log((6-prior[j])+" "+count[j]+" "+maxr);
      //if(r>maxr) maxr=1;//count[j]/sum;
      this._states[i]._addTrans(vowel2idx[this._segments[this._states[next[j]]._segment]._getVowel(next[j]-this._segments[this._states[next[j]]._segment]._state)],next[j],prior[j]);
   }
   
}

for(var i=0;i<this._totalLen;++i){
   for(var j=0;j<6;++j){
      var len=this._states[i]._trans[j].length;
      for(var k=0;k<len;++k){
         for(var m=0;m<align.length;++m){
            if(align[m]==this._states[i]._transRate[j][k]){
              this._states[i]._transRate[j][k]=m;
              break;
            }
         }
      }
   }
}


// finally get the transition rate

var total=align.length*(align.length+1)/2;
this._rate=new Array(align.length);
for(var i=0;i<align.length;++i){
   this._rate[i]=new Array(align.length);
   for(var j=0;j<align.length;++j){
      this._rate[i][j]=(-1.0/20.0*align[j]+1.0);//(align.length-j)/total;
   }
}


// save correct vowel sequences

var vowel=new Array("あ","い","う","え","お","ん");
var active_segments=0;
for(var i=0;i<num_segments;++i){
   if(this._segments[i]._length==0) continue;
   ++active_segments;
   for(var j=0;j<this._segments[i]._length;++j){
      this._segments[i]._vowelarray+=vowel[vowel2idx[this._segments[i]._getVowel(j)]];
   }
}


// precompute the all 3-vowel sequances. 

for(var j=0;j<num_segments;++j){
   if(this._segments[j]._length==0) continue;

   for(var i=0;i<this._segments[j]._length-1;++i){
      var j1=vowel2idx[this._segments[j]._getVowel(i)];
      var j2=vowel2idx[this._segments[j]._getVowel(i+1)];
      var len=this._transitions[j1][j2].length;
      this._transitions[j1][j2][len]=this._segments[j]._state+i+1;
   }
   if(this._segments[j]._repeat!=0){
     var j1=vowel2idx[this._segments[j]._getVowel(this._segments[j]._length-1)];
     var j2=vowel2idx[this._segments[j]._getVowel(0)];
     var len=this._transitions[j1][j2].length;
     this._transitions[j1][j2][len]=this._segments[j]._state;
   }
   if(j<num_segments-1){
     if(this._segments[j]._next.length>0){
       var j1=vowel2idx[this._segments[j]._getVowel(this._segments[j]._length-1)];
       var j2=vowel2idx[this._segments[this._segments[j]._next[0]]._getVowel(0)];
       var len=this._transitions[j1][j2].length;
       this._transitions[j1][j2][len]=this._segments[this._segments[j]._next[0]]._state;
     }
   }
}


// update the segment list display

var row=0;
for(var i=0;i<num_segments;++i){
   if(this._segments[i]._length<2) continue;
   var div=document.createElement("div");
   div.id="segment";
   var seg="<a class=\"segbtn\" id=\"segment"+i+"\" onclick=\"SegmentSelect("+i+");\">";
   for(var j=0;j<this._segments[i]._length;++j){
      seg+=this._segments[i]._lyrics[j];
   }
   seg+=" (";
   seg+=this._segments[i]._vowelarray;
   seg+=")</a>";
   div.innerHTML=seg;
   
   document.getElementById("SegmentCanvasArea").appendChild(div);
   
   ++row;
}


},


_detectRepeat: function(){


for(var s=0;s<this._num_segments;++s){

   var repeated=0;
   var repeatLen;
   var pos=0;
   for(var i=2;i<=this._segments[s]._length/2;++i){
      var j=0;
      for(;j<i;++j){
         if(this._segments[s]._getChar(j)!=this._segments[s]._getChar(i+j)) break;
      }
      if(j==i){
        ++repeated;
        repeatLen=i;
        break;
      }
   }
   if(repeated>0){
     var pos=repeatLen*2;
     while((pos+repeatLen)<=this._segments[s]._length){
          var failed=false;
          for(var i=0;i<repeatLen;++i){
             if(this._segments[s]._getChar(pos+i)!=this._segments[s]._getChar(i)){
               failed=true;
               break;
             }
          }
          if(failed) break;
          ++repeated;
          pos+=repeatLen;
     }
     if(pos<this._segments[s]._length){
       repeated=0;
     }else{
       this._segments[s]._length=repeatLen;
       this._segments[s]._repeat=repeated;
     }
   }

}

}



};


var LiVoData=new JSLiVoData;



