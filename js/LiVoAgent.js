
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



var Agent=function(nLevels){

this._active=0;
this._state=0;
this._score=new Array(1,1,1,1);
this._key=-1;
this._repeated=0;
this._behavior=4;

};



var AgentManager=function(num_agents){

this._currentState=0;
this._currentAgent=0;
this._currentScore=1.0;
this._num_agents=num_agents;
this._num_active_agents=0;
this._currentSegment=0;
this._failed=0;
this._saved=-1;

this._agents=new Array(num_agents);
this._history=new Array(0,0,0,0);
for(var i=0;i<num_agents;++i) this._agents[i]=new Agent;
this._keyState=new Array(-1,-1,-1,-1,-1,-1);
this._keyAgent=new Array(0,0,0,0,0,0);
this._keys=new Array("あ","い","う","え","お","ん");
this._default=new Array("あ","い","う","え","お","ん");
this._idx2vowel=new Array(0,2,4,5,7,3);
this._vowel2idx=new Array(0,0,1,5,2,3,3,4);
this._weightBuf=new Array();

};


AgentManager.prototype={


// seek the position manually
_seek: function(seg){

this._num_active_agents=1;
for(var i=0;i<this._num_agents;++i)  this._agents[i]._active=0;
this._currentAgent=0;
this._currentState=LiVoData._segments[seg]._state;
var idx=this._vowel2idx[LiVoData._segments[seg]._getVowel(0)];

this._agents[0]._active=1;
this._agents[0]._key=idx;
this._agents[0]._state=this._currentState;
this._agents[0]._score[0]=1;
this._agents[0]._score[1]=1;
this._agents[0]._score[2]=1;
this._agents[0]._score[3]=1;
this._agents[0]._repeated=0;
this._agents[0]._behavior=4;
this._keyAgent[idx]=0;
this._keyState[idx]=this._currentState;
this._keys[idx]=LiVoData._rawtext[this._keyState[idx]];

for(var i=0;i<6;++i){
   if(i==idx) continue;
   var a=this._seed(i,1.0);
   if(a==-1){
     this._keyAgent[i]=0;
     this._keyState[i]=-1;
     this._keys[i]=this._default[i];
   }else{
     this._keyAgent[i]=a;
     this._keyState[i]=this._agents[a]._state;
     this._keys[i]=LiVoData._rawtext[this._keyState[i]];
   }
}

document.getElementById("segment"+this._currentSegment).style.fontSize="9px";
document.getElementById("segment"+this._currentSegment).style.color="#222";
this._currentSegment=LiVoData._states[this._currentState]._segment; 
document.getElementById("segment"+this._currentSegment).style.fontSize="20px";
document.getElementById("segment"+this._currentSegment).style.color="#F00";
  
},


// seed agents at all position of a vowel
_seed: function(key,newscore){

var mind=LiVoData._totalLen*LiVoData._totalLen;
var mini=-1;
var score=new Array(1,1,1,1);
for(var i=0;i<LiVoData._totalLen-1;++i){
   if(key==this._vowel2idx[VowelMap[LiVoData._rawtext[i]]]){
     var a=this._seedAgent(i,newscore,score,key,4);
     if(a!=-1){
       var d=(this._currentState-i)*(this._currentState-i);
       if(d<mind){
         mind=d;
         mini=a;
       }
     }
   }
}


return(mini);
},


_seedAgent: function(state,newscore,score,key,behavior){


var mins=10000000;
var mini=0;

for(var i=0;i<this._num_agents;++i){
   if(this._agents[i]._active==0){
     this._agents[i]._active=1;
     this._agents[i]._key=key;
     this._agents[i]._score[0]=score[1];
     this._agents[i]._score[1]=score[2];
     this._agents[i]._score[2]=score[3];
     this._agents[i]._score[3]=newscore;
     this._agents[i]._state=state;
     this._agents[i]._repeated=0;
     this._agents[i]._behavior=behavior;
     ++this._num_active_agents;
     return(i);
   }
   var s2=this._agents[i]._score[0]*this._agents[i]._score[1]*this._agents[i]._score[2]*this._agents[i]._score[3];
   if(s2<mins){
     mins=s2;
     mini=i;
   }
}

var s1=score[1]*score[2]*score[3]*newscore;

if(mins<s1){
  this._agents[mini]._active=1;
  this._agents[mini]._key=key;
  this._agents[mini]._score[0]=score[1];
  this._agents[mini]._score[1]=score[2];
  this._agents[mini]._score[2]=score[3];
  this._agents[mini]._score[3]=newscore;
  this._agents[mini]._state=state;
  this._agents[mini]._repeated=0;
  this._agents[mini]._behavior=behavior;
  return(mini);
}

return(-1);
},


_reset: function(){


for(var a=0;a<this._currentAgent;++a){
   this._agents[a]._active=0;
}
for(var a=this._currentAgent+1;a<this._num_agents;++a){
   this._agents[a]._active=0;
}
this._agents[this._currentAgent]._state=this._currentState;
this._agents[this._currentAgent]._score[0]*=0.5;
this._agents[this._currentAgent]._score[1]*=0.5;
this._agents[this._currentAgent]._score[2]*=0.5;
this._agents[this._currentAgent]._score[3]*=0.5;

  
this._num_active_agents=1;
var len1=LiVoData._transitions[this._history[0]][this._history[1]].length;
var len2=LiVoData._transitions[this._history[1]][this._history[2]].length;
var len3=LiVoData._transitions[this._history[2]][this._history[3]].length;
  
var ww=this._agents[this._currentAgent]._state-LiVoData._segments[LiVoData._states[this._agents[this._currentAgent]._state]._segment]._state;
var a=0;
for(var j=0;j<len1;++j){
   for(var i=0;i<len2;++i){
      if((LiVoData._transitions[this._history[0]][this._history[1]][j]+1)==LiVoData._transitions[this._history[1]][this._history[2]][i]){
        var find=false;
        for(var k=0;k<len3;++k){
           if((LiVoData._transitions[this._history[1]][this._history[2]][i]+1)==LiVoData._transitions[this._history[2]][this._history[3]][k]){
             if(a==this._currentAgent) ++a;
             this._agents[a]._active=2;
             this._agents[a]._key=-1;
             this._agents[a]._state=LiVoData._transitions[this._history[2]][this._history[3]][k];
             this._agents[a]._score[0]=0.7;
             this._agents[a]._score[1]=0.8;
             this._agents[a]._score[2]=0.9;
             this._agents[a]._score[3]=1.0;
             this._agents[a]._repeated=0;
             this._agents[a]._behavior=4;
             var w=this._agents[a]._state-LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._state;
             if(w<ww){
               ww=w;
               this._currentAgent=a;
             }
             ++a;
             ++this._num_active_agents;
             find=true;
             break;
           }
        }
        break;
      }
   }
}
  
for(var i=0;i<len2;++i){
   for(var k=0;k<len3;++k){
      if((LiVoData._transitions[this._history[1]][this._history[2]][i]+1)==LiVoData._transitions[this._history[2]][this._history[3]][k]){
        if(a==this._currentAgent) ++a;
        this._agents[a]._active=2;
        this._agents[a]._key=-1;
        this._agents[a]._state=LiVoData._transitions[this._history[2]][this._history[3]][k];
        this._agents[a]._score[0]=0.7;
        this._agents[a]._score[1]=0.8;
        this._agents[a]._score[2]=0.9;
        this._agents[a]._score[3]=1.0;
        this._agents[a]._repeated=0;
        this._agents[a]._behavior=4;
        var w=this._agents[a]._state-LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._state;
        if(w<ww){
          ww=w;
          this._currentAgent=a;
        }
        ++a;
        ++this._num_active_agents;
        break;
      }
   }
}


this._currentState=this._agents[this._currentAgent]._state;


},



_update: function(vowel){

         
var key=this._vowel2idx[vowel];

this._history[0]=this._history[1];
this._history[1]=this._history[2];
this._history[2]=this._history[3];
this._history[3]=key;


// count mistakes

this._saved=-1;
if(this._keyState[key]!=this._currentState+1){
  if(LiVoData._segments[LiVoData._states[this._currentState]._segment]._repeat!=0){
    var state=LiVoData._segments[LiVoData._states[this._currentState]._segment]._state;
    if(this._currentState==state+LiVoData._segments[LiVoData._states[this._currentState]._segment]._length-1){
      if(this._keyState[key]!=state){
        if(this._failed==0) this._saved=this._currentAgent;
        this._failed++;
        if(this._currentState>this._keyState[key] && this._keyState[key]!=this._saved) this._failed++;
      }else this._failed=0;
    }else{
      if(this._failed==0) this._saved=this._currentAgent;
      this._failed++;
      if(this._currentState>this._keyState[key] && this._keyState[key]!=this._saved) this._failed++;
    }
  }else{
    if(this._failed==0) this._saved=this._currentAgent;
    this._failed++;
    if(this._currentState>this._keyState[key] && this._keyState[key]!=this._saved) this._failed++;
  }
}else this._failed=0;


this._currentState=this._keyState[key];
this._currentAgent=this._keyAgent[key];


if(this._failed>3){

  // in this case, the user is assumed to have an intent to big jump
  this._reset();

}else{


  for(var a=0;a<this._num_agents;++a){
     if(this._agents[a]._active>0 && this._agents[a]._key!=-1){
       if(this._agents[a]._key!=key && a!=this._currentAgent){
         this._agents[a]._active=0;
         --this._num_active_agents;
       }else if(a!=this._saved){
         this._agents[a]._key=-1;
       }
     }
  }
  
  
  if(this._saved!=-1){
    var score=new Array(1,1,1,1);
    this._seedAgent(this._agents[this._saved]._state,this._agents[this._saved]._score[1]*this._agents[this._saved]._score[2]*this._agents[this._saved]._score[3],score,-1,4);
  }

      
  for(var a=0;a<this._num_agents;++a){
    
     if(this._agents[a]._active<2) continue;

     var maxs=0;
     var maxi=0;
     var mscore=0;
     var len=LiVoData._states[this._agents[a]._state]._trans[key].length;
     for(var i=0;i<len;++i){
        var s=LiVoData._states[this._agents[a]._state]._trans[key][i];
        var w=1;
        if(key==5) w=2;
        else{
          if(LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._repeat<0){
            if(s<this._agents[a]._state){
              if(LiVoData._states[this._agents[a]._state]._segment==LiVoData._states[s]._segment){
                if(this._agents[a]._repeated>=(-LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._repeat)){
                  w=0.5;
                  this._agents[a]._repeated=0;
                }else this._agents[a]._repeated++
              }
            }
          }
        }
        this._weightBuf[i]=w;
        var rate=LiVoData._rate[this._agents[a]._behavior][LiVoData._states[this._agents[a]._state]._transRate[key][i]];
        var iscore=w*rate;
        var score=this._agents[a]._score[1]*this._agents[a]._score[2]*this._agents[a]._score[3]*iscore;
        if(score>maxs){
          maxi=i;
          maxs=score;
          mscore=iscore;
        }
     }
   
     if(maxs<0.3 && a!=this._currentAgent){
       this._agents[a]._active=0;
       --this._num_active_agents;
       continue;
     }

     var next=LiVoData._states[this._agents[a]._state]._trans[key][maxi];
     var seg=LiVoData._states[this._agents[a]._state]._segment;

     for(var i=0;i<len;++i){
        if(i==maxi) continue;
        var rate=LiVoData._rate[this._agents[a]._behavior][LiVoData._states[this._agents[a]._state]._transRate[key][i]];
        var score=this._agents[a]._score[1]*this._agents[a]._score[2]*this._agents[a]._score[3]*(this._weightBuf[i]*rate);
        if(score>=0.3) this._seedAgent(LiVoData._states[this._agents[a]._state]._trans[key][i],this._weightBuf[i]*rate,this._agents[a]._score,-1,LiVoData._states[this._agents[a]._state]._transRate[key][i]);
     }

     for(var i=0;i<3;++i){
        this._agents[a]._score[i]=this._agents[a]._score[i+1];
     }
     
     this._agents[a]._behavior=LiVoData._states[this._agents[a]._state]._transRate[key][maxi];
     this._agents[a]._score[3]=mscore;
     this._agents[a]._state=next;
     
  }
  
  // remove overlapped agents
  for(var j=0;j<this._num_agents;++j){
     if(this._agents[j]._active<1) continue;
     var s1=this._agents[j]._score[0]*this._agents[j]._score[1]*this._agents[j]._score[2]*this._agents[j]._score[3];
     for(var i=j+1;i<this._num_agents;++i){
        if(this._agents[i]._active<1) continue;
        if(this._agents[j]._state==this._agents[i]._state){
       
          var s2=this._agents[i]._score[0]*this._agents[i]._score[1]*this._agents[i]._score[2]*this._agents[i]._score[3];
          if(s1<s2){
            this._agents[j]._active=0;
            --this._num_active_agents;
            break;
          }else{
            this._agents[i]._active=0;
            --this._num_active_agents;
          }
        }
     }
  }

  for(var a=0;a<this._num_agents;++a){
     if(this._agents[a]._active==1) this._agents[a]._active=2;
  }

}


this._currentScore=this._agents[this._currentAgent]._score[0]*this._agents[this._currentAgent]._score[1]*this._agents[this._currentAgent]._score[2]*this._agents[this._currentAgent]._score[3];


// update the segment list view
if(this._currentSegment!=LiVoData._states[this._currentState]._segment){

  document.getElementById("segment"+this._currentSegment).style.fontSize="9px";
  document.getElementById("segment"+this._currentSegment).style.color="#222";
  this._currentSegment=LiVoData._states[this._currentState]._segment; 
  document.getElementById("segment"+this._currentSegment).style.fontSize="20px";
  document.getElementById("segment"+this._currentSegment).style.color="#F00";
  
  var scroll=160+16*this._currentSegment-(document.getElementById("right_frame").clientHeight-200);
  if(scroll>=0) document.getElementById("right_frame").scrollTop=scroll;
  else document.getElementById("right_frame").scrollTop=0;
  
}

this._predict();

},



// predict the next lyrics at all next vowel
_predict: function(){


for(var key=0;key<6;++key){

   var maxss=0;
   var maxii=-1;
   var magt=0;
   var iiscore=0;
   
   var find=new Array();
   var finds=new Array();
   var f=0;
   
   for(var a=0;a<this._num_agents;++a){
      if(this._agents[a]._active<2) continue;

      var maxs=0;
      var maxi=0;
      var iscore=0;
      var len=LiVoData._states[this._agents[a]._state]._trans[key].length;
      for(var i=0;i<len;++i){
         var s=LiVoData._states[this._agents[a]._state]._trans[key][i];
         var w=1;
         if(key==5) w=2;
         else{
           if(LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._repeat<0){
             if(s<this._agents[a]._state){
               if(LiVoData._states[this._agents[a]._state]._segment==LiVoData._states[s]._segment){
                 if(this._agents[a]._repeated>=(-LiVoData._segments[LiVoData._states[this._agents[a]._state]._segment]._repeat)){
                   w=0.5;
                 }
               }
             }
           }
         }
        
         var rate=LiVoData._rate[this._agents[a]._behavior][LiVoData._states[this._agents[a]._state]._transRate[key][i]];
         var score=this._agents[a]._score[1]*this._agents[a]._score[2]*this._agents[a]._score[3]*w*rate;
         
         
         if(score>maxs){
           maxs=score;
           maxi=LiVoData._states[this._agents[a]._state]._trans[key][i];
           iscore=w*rate;
         }
         
         if(score==maxss && a==this._currentAgent){
           maxss=score;
           maxii=LiVoData._states[this._agents[a]._state]._trans[key][i];
           iscore=w*rate;
         }
        
          
      }
      
      if(maxs>maxss){
        maxss=maxs;
        maxii=maxi;
        magt=a;
        iiscore=iscore;
      }
   }
            
   if(maxii==-1){
     magt=this._seed(key,this._currentScore);
     if(magt!=-1) maxii=this._agents[magt]._state;
   }
   if(maxii==-1){
     this._keyAgent[key]=-1;
     this._keyState[key]=-1;
     this._keys[key]=this._default[key];
   }else{
     
     this._keyAgent[key]=magt;
     this._keyState[key]=maxii;
     this._keys[key]=LiVoData._rawtext[maxii];

   }
   
}


}



};


