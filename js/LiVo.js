
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



var LiVoEvent=function(){

this._time=0;
this._note=0;

};




var JSLiVo=function(){

this._currentNote=0;
this._currentVelocity=0;
this._noteON=0;
this._num_synth=0;
this._keys={};
this._keys={"C":"あ","C#":"＜","D":"い","D#":"ん","E":"う","F":"え","F#":"＞","G":"お"};
this._lock=0;
this._agents=new AgentManager(1024*3);
this._agents._seek(0);

this._currentSynth=0;
this._notehistory1=0;
this._notehistory2=0;
this._notehistory3=0;
this._noteSynth=new Array(128);
for(var i=0;i<128;++i) this._noteSynth[i]=0;

this._keys["C"]=this._agents._keys[0];
this._keys["D"]=this._agents._keys[1];
this._keys["E"]=this._agents._keys[2];
this._keys["F"]=this._agents._keys[3];
this._keys["G"]=this._agents._keys[4];
this._current=LiVoData._rawtext[this._agents._currentState];

this._startTime=0;
this._recordEvents=new Array();


};



JSLiVo.prototype={



_clear: function(){

if(this._num_segments==0) return;

this._currentNote=0;
this._currentVelocity=0;
this._currentWeight=1.0;
this._noteON=0;
this._keys={};
this._keys={"C":"あ","C#":"＜","D":"い","D#":"ん","E":"う","F":"え","F#":"＞","G":"お"};
this._currentSynth=0;
for(var i=0;i<128;++i) this._noteSynth[i]=0;

LiVoData._clear();


},


_seek: function(pos){

this._agents._seek(pos);
this._current=LiVoData._rawtext[this._agents._currentState];


this._keys["C"]=this._agents._keys[0];
this._keys["D"]=this._agents._keys[1];
this._keys["E"]=this._agents._keys[2];
this._keys["F"]=this._agents._keys[3];
this._keys["G"]=this._agents._keys[4];

},


_keyDown: function(key,vel){


if(this._lock==key) return;

this._lock=key;

vel=this._currentVelocity;
this._currentWeight=1.0;

var k="C";
var l=0;
if(key==65){
  k="C";
  l=0;
  this._agents._update(l);
}else if(key==83){
  k="D";
  l=2;
  this._agents._update(l);
  this._currentWeight=1.6;
}else if(key==68){
  k="E";
  l=4;
  this._agents._update(l);
  this._currentWeight=1.3;
}else if(key==70){
  k="F";
  l=5;
  this._agents._update(l);
}else if(key==32){
  k="G";
  l=7;
  this._agents._update(l);
  this._currentWeight=3.0;
}else if(key==87){
  k="C#";
  l=1;
  this._agents._reset();
  this._agents._predict();
}else if(key==69){
  k="D#";
  l=3;
  this._agents._update(l);
  this._currentWeight=2.0;
}else{
  k="F#";
  l=6;
}

//this._currentVelocity=parseInt(this._currentWeight*vel);

this._keys["C"]=this._agents._keys[0];
this._keys["D"]=this._agents._keys[1];
this._keys["E"]=this._agents._keys[2];
this._keys["F"]=this._agents._keys[3];
this._keys["G"]=this._agents._keys[4];
this._current=LiVoData._rawtext[this._agents._currentState];

//this._currentVelocity=vel;


var sysEx=nsx1.getSysExByText(this._current);
for(var i=0;i<sysEx.length;++i){
   mOut.send(sysEx[i]);
}


var v=parseInt(this._currentWeight*vel);
if(v>127) v=127;

if(this._num_synth==2){
  for(var i=0;i<sysEx.length;++i){
     mOut2.send(sysEx[i]);
  }
  
  
  if(this._noteON>0){
   if(this._currentSynth==0){
      mOut.send([0x90,this._currentNote,v]);
      if(this._noteSynth[this._notehistory2]>0){
        mOut2.send([0x90,this._notehistory2,v]);
      }
    }else{
      mOut2.send([0x90,this._currentNote,v]);
      if(this._noteSynth[this._notehistory2]>0){
        mOut.send([0x90,this._notehistory2,v]);
      }
    }
  }

  
}else if(this._num_synth==3){

  for(var i=0;i<sysEx.length;++i){
     mOut2.send(sysEx[i]);
  }
  
  for(var i=0;i<sysEx.length;++i){
     mOut3.send(sysEx[i]);
  }
  
  if(this._noteON>0){
    if(this._currentSynth==0){
      mOut.send([0x90,this._currentNote,v]);
      
      if(this._noteSynth[this._notehistory2]>0){
        if(this._noteSynth[this._notehistory2]==2) mOut2.send([0x90,this._notehistory2,v]);
        else mOut3.send([0x90,this._notehistory2,v]);
      }
      if(this._noteSynth[this._notehistory3]>0){
        if(this._noteSynth[this._notehistory3]==2) mOut2.send([0x90,this._notehistory3,v]);
        else mOut3.send([0x90,this._notehistory3,v]);
      }
      
    }else if(this._currentSynth==1){
      mOut2.send([0x90,this._currentNote,v]);
      
      if(this._noteSynth[this._notehistory2]>0){
        if(this._noteSynth[this._notehistory2]==1) mOut.send([0x90,this._notehistory2,v]);
        else mOut.send([0x90,this._notehistory2,v]);
      }
      if(this._noteSynth[this._notehistory3]>0){
        if(this._noteSynth[this._notehistory3]==3) mOut3.send([0x90,this._notehistory3,v]);
        else mOut3.send([0x90,this._notehistory3,v]);
      }
      
    }else{
      mOut3.send([0x90,this._currentNote,v]);
      
      if(this._noteSynth[this._notehistory2]>0){
        if(this._noteSynth[this._notehistory2]==1) mOut.send([0x90,this._notehistory2,v]);
        else mOut2.send([0x90,this._notehistory2,v]);
      }
      if(this._noteSynth[this._notehistory3]>0){
        if(this._noteSynth[this._notehistory3]==2) mOut2.send([0x90,this._notehistory3,v]);
        else mOut2.send([0x90,this._notehistory3,v]);
      }
      
    }
  }

}else{

  if(this._noteON>0){
    mOut.send([0x90,this._currentNote,v]);
  }

}

},


_keyUp: function(key){

if(this._lock==key) this._lock=0;

},



_noteon: function(note,velocity){

var v=parseInt(this._currentWeight*velocity);
if(v>127) v=127;

if(this._num_synth==1) mOut.send([0x90,note,v]);
else if(this._num_synth==2){
  if(this._currentSynth==0){
    mOut2.send([0x90,note,v]);
    this._noteSynth[note]=2;
    this._currentSynth=1;
  }else{
    mOut.send([0x90,note,v]);
    this._noteSynth[note]=1;
    this._currentSynth=0;
  }
}else if(this._num_synth==3){

  if(this._currentSynth==0){
    mOut3.send([0x90,note,v]);
    this._noteSynth[note]=3;
    this._currentSynth=2;
  }else if(this._currentSynth==2){
    mOut2.send([0x90,note,v]);
    this._noteSynth[note]=2;
    this._currentSynth=1;
  }else if(this._currentSynth==1){
    mOut.send([0x90,note,v]);
    this._noteSynth[note]=1;
    this._currentSynth=0;
  }
}


this._noteON++;
this._currentNote=note;
this._currentVelocity=velocity;

if(this._notehistory1!=note){
  this._notehistory3=this._notehistory2;
  this._notehistory2=this._notehistory1;
  this._notehistory1=note;
}

},


_noteoff: function(note){

this._noteON--;
if(this._num_synth==1) mOut.send([0x80,note,0x00]);
else{
  if(this._noteSynth[note]==1){
    mOut.send([0x80,note,0x00]);
  }else if(this._noteSynth[note]==2){
    mOut2.send([0x80,note,0x00]);
  }else if(this._noteSynth[note]==3){
    mOut3.send([0x80,note,0x00]);
  }
}

if(this._notehistory1==note) this._notehistory1=0;
if(this._notehistory2==note) this._notehistory2=0;
if(this._notehistory3==note) this._notehistory3=0;

this._noteSynth[note]=0;

},


_test: function(){

console.log("test ");

var total=0;
for(var i=0;i<LiVoData._num_leaf_segments;++i){
   if(LiVoData._segments[i].length<2) continue;
   total+=LiVoData._segments[i]._length;
   if(LiVoData._segments[i]._repeat<0){
     for(var j=0;j<(-LiVoData._segments[i]._repeat);++j) total+=LiVoData._segments[i]._length;
   }
}


var rate=Math.floor(total*0.2);
var mistake=new Array(total);
for(var i=0;i<total;++i){
   mistake[i]=-1;
}

var idx2vowel=new Array(0,2,4,5,7,3);
for(var i=0;i<rate;++i){
   var pos=Math.floor(Math.random()*(total-1));

   if(mistake[pos]==-1){
     var miss=Math.floor(Math.random()*6);
     if(miss>5) miss=5;
     mistake[pos]=idx2vowel[miss];     
   }
}

var correct=0;
var p=0;
for(var i=0;i<LiVoData._num_leaf_segments;++i){
   if(LiVoData._segments[i].length<2) continue;
   var po=p;
   for(var j=0;j<LiVoData._segments[i]._length;++j){
      this._agents._update(VowelMap[LiVoData._rawtext[LiVoData._segments[i]._state+j]]);
      if(LiVoData._rawtext[this._agents._currentState]==LiVoData._rawtext[LiVoData._segments[i]._state+j]) ++correct;
      if(mistake[p]!=-1){
        this._agents._update(mistake[p]);
      }
      ++p;
   }
   if(LiVoData._segments[i]._repeat<0){
     for(var k=0;k<(-LiVoData._segments[i]._repeat);++k){
        p=po;
        for(var j=0;j<LiVoData._segments[i]._length;++j){
           this._agents._update(VowelMap[LiVoData._rawtext[LiVoData._segments[i]._state+j]]);
           if(LiVoData._rawtext[this._agents._currentState]==LiVoData._rawtext[LiVoData._segments[i]._state+j]) ++correct;
           if(mistake[p]!=-1){
             this._agents._update(mistake[p]);
           }
           ++p;
        }
     }
   }
}


console.log("correct rate: "+correct/total+" "+rate);

},


_record: function(note){

var idx=this._recordEvents.length;
this._recordEvents[idx]=new LiVoEvent;
this._recordEvents[idx]._time=new Date();
this._recordEvents[idx]._note=note;

},


_play: function(){

}




};



var LiVo=new JSLiVo;


