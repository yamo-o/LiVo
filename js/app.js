


// midi out select modal
var $midiOutModal=$("#midiOutSelM").modal({
show: false
});

$("#midiOutSelM").on("shown.bs.modal",function(event){
clearAllAlertMessageInModal("divMidiOutSelWarning");
showMidiInOutSelM("divMidiOutSelWarning","OUT");
});

$("#midiOutSelM").on("hidden.bs.modal",function(event){
clearAllAlertMessageInModal("divMidiOutSelWarning");
});

// midi in select modal
var $midiInModal=$("#midiInSelM").modal({
show: false
});


$("#midiInSelM").on("shown.bs.modal",function(event){
clearAllAlertMessageInModal("divMidiInSelWarning");
showMidiInOutSelM("divMidiInSelWarning","IN");
});

$("#midiInSelM").on("hidden.bs.modal",function(event){
clearAllAlertMessageInModal("divMidiInSelWarning");
});

function clearAllAlertMessageInModal(parentElem){
var messageInModal=document.getElementById(parentElem);
while(messageInModal.firstChild){
     messageInModal.removeChild(messageInModal.firstChild);
}
}

function showMidiInOutSelM(elem,checkType){
    var message="",className="",elemName="";
    switch(checkType){
      case "IN":
        elemName="divSetInput";
        if(outputs.length<1){
            message="Please Connect MIDI input devices to use.";
        } else {
            message="Select MIDI input device.";
            className="alert alert-info";
        }
        break;
      case "OUT":
        elemName="divSetOutput";
        if(outputs.length<1){
            message="Please Connect MIDI output devices. This application needs at least one MIDI Device.";
            className="alert alert-danger";
        } else {
            message="Select MIDI output device.";
            className="alert alert-info";
        } 
        break;
    }

    if(message!=""){
        var divAlert=document.createElement("div");
        divAlert.className=className;
        divAlert.innerHTML=message;
        document.getElementById(elem).appendChild(divAlert);
    }
    var type="click";
    var e=document.createEvent('MouseEvent');
    var b=document.getElementById(elemName);
    e.initEvent(type,true,true,window,1,0,0,0,0,false,false,false,false,0,null);
    b.dispatchEvent(e);
}

// virtual Keyboard
var fKey=new LyricsKeyboard("keyboard");
var timerId=setInterval(function(){
fKey._draw();
},30);


document.getElementById("ConvertButton").addEventListener("click",function(){

if(document.getElementById("original").value.length<1) return;

LiVo._clear();
LiVoData._parse(document.getElementById("original").value);        
LiVo._seek(0);

});



// Web MIDI API
var midi;
var inputs,outputs;
var mIn,mOut,mOut2,mOut3;
var octave=0;
navigator.requestMIDIAccess( { sysex: true } ).then( scb,ecb );

function scb(access){
    var midi=access;
    inputs=midi.inputs();
    outputs=midi.outputs();

    // MIDI IN
    var mi=document.getElementById("midiInSel");
    for(var i=0; i<inputs.length; i++){
        // in modal
        mi.options[i]=new Option(inputs[i]["name"],i);

        document.getElementById("midiInSelB").addEventListener("click",function(){
            var selIdx=document.getElementById("midiInSel").selectedIndex;
            mIn=inputs[selIdx];

            $("#midiInSelM").modal("hide");


            mIn.onmidimessage=function(event){
                if(event.data[0]==144){
                  var vkey=event.data[1]-12*octave;
                  switch(vkey){
                        case 48: LiVo._keyDown(65,event.data[2]); return;
                        case 50: LiVo._keyDown(83,event.data[2]); return;
                        case 52: LiVo._keyDown(68,event.data[2]); return;
                        case 53: LiVo._keyDown(70,event.data[2]); return;
                        case 55: LiVo._keyDown(32,event.data[2]); return;
                        case 51: LiVo._keyDown(69,event.data[2]); return;
                        default: break;
                  }
                }else{
                  var vkey=event.data[1]-12*octave;
                  switch(vkey){
                        case 48: LiVo._keyUp(65); return;
                        case 50: LiVo._keyUp(83); return;
                        case 52: LiVo._keyUp(68); return;
                        case 53: LiVo._keyUp(70); return;
                        case 55: LiVo._keyUp(32); return;
                        case 51: LiVo._keyUp(69); return;
                        default: break;
                  }
                }
                if(typeof mOut=="object"){
                    
                  if(event.data[0]==0x90) LiVo._noteon(event.data[1],event.data[2]);
                  else if(event.data[0]==0x80) LiVo._noteoff(event.data[1]);
                  else{
                    mOut.send([event.data[0],event.data[1],event.data[2]]);
                    if(LiVo._num_synth>1) mOut2.send([event.data[0],event.data[1],event.data[2]]);
                  }
                    
                }
            };
        });
    }
    
    
    // MIDI OUT
    var mo=document.getElementById("midiOutSel");
    for(var i=0; i<outputs.length; i++){
        // in modal
        mo.options[i]=new Option(outputs[i]["name"],i);
    }

/*
    var mo=document.getElementById("midiOutSel2");
    for(var i=0; i<outputs.length; i++){
        // in modal
        mo.options[i]=new Option(outputs[i]["name"],i);
    }
    
    var mo=document.getElementById("midiOutSel3");
    for(var i=0; i<outputs.length; i++){
        // in modal
        mo.options[i]=new Option(outputs[i]["name"],i);
    }
*/

    // set device in modal
    document.getElementById("midiOutSelB").addEventListener("click",function(){
        var selIdx=document.getElementById("midiOutSel").selectedIndex;
        
        mOut=outputs[selIdx];
        
        var msg=[ 0xB0,0x5B,0x00 ];
        mOut.send( msg );
        
        LiVo._num_synth+=1;
        
        $("#midiOutSelM").modal("hide");
        
        // send word
        var type="click";
        var e=document.createEvent('MouseEvent');
        var b=document.getElementById("inputTextButton");
        e.initEvent(type,true,true,window,1,0,0,0,0,false,false,false,false,0,null);
       // b.dispatchEvent(e);        
    });
/*
    document.getElementById("midiOutSelB2").addEventListener("click",function(){
        var selIdx=document.getElementById("midiOutSel2").selectedIndex;
        
        mOut2=outputs[selIdx];
        
        var msg=[ 0xB0,0x5B,0x00 ];
        mOut2.send( msg );
        
        LiVo._num_synth+=1;
        
        $("#midiOutSelM2").modal("hide");

        // send word
        var type="click";
        var e=document.createEvent('MouseEvent');
        var b=document.getElementById("inputTextButton");
        e.initEvent(type,true,true,window,1,0,0,0,0,false,false,false,false,0,null);
       // b.dispatchEvent(e);        
    });
    
    document.getElementById("midiOutSelB3").addEventListener("click",function(){
        var selIdx=document.getElementById("midiOutSel3").selectedIndex;
        
        mOut3=outputs[selIdx];
        
        var msg=[ 0xB0,0x5B,0x00 ];
        mOut3.send( msg );
        
        LiVo._num_synth+=1;
        
        $("#midiOutSelM3").modal("hide");

        // send word
        var type="click";
        var e=document.createEvent('MouseEvent');
        var b=document.getElementById("inputTextButton");
        e.initEvent(type,true,true,window,1,0,0,0,0,false,false,false,false,0,null);
       // b.dispatchEvent(e);        
    });
*/

    /*document.addEventListener("keydown",function(e){
    fKey._noteOn(e.keyCode);
    var startTime=new Date();
		LiVo._keyDown(e.keyCode);
    var endTime=new Date();
    console.log(endTime-startTime);
    });

     document.addEventListener("keyup",function(e){
    fKey._noteOff(e.keyCode);
    LiVo._keyUp(e.keyCode);
    });*/


}



function ecb(msg){
    console.log("[Error]",msg);
}

/*function midiInputEvent(event){

    mOut.send(event.data);
}*/


document.getElementById("octaveup").addEventListener("click",function(event){

octave+=1;

var msg=[ 0xB0,0x79,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x7B,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x78,0x00 ];
mOut.send( msg );
    
if(LiVo._num_synth>1){
  var msg=[ 0xB0,0x79,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x7B,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x78,0x00 ];
  mOut2.send( msg );
}

});

document.getElementById("octavedown").addEventListener("click",function(event){

octave-=1;

var msg=[ 0xB0,0x79,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x7B,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x78,0x00 ];
mOut.send( msg );
    
if(LiVo._num_synth>1){
  var msg=[ 0xB0,0x79,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x7B,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x78,0x00 ];
  mOut2.send( msg );
  
  if(LiVo._num_synth>2){
  
    var msg=[ 0xB0,0x79,0x00 ];
    mOut3.send( msg );

    var msg=[ 0xB0,0x7B,0x00 ];
    mOut3.send( msg );

    var msg=[ 0xB0,0x78,0x00 ];
    mOut3.send( msg );
  
  }
  
}

});


document.getElementById("resetAllController").addEventListener("click",function(event){

// check whether midi out is set or not
if(typeof mOut!="object"){
  showMidiInOutSelM("divMidiOutSelWarning","OUT","resetAllController");
  return;
}
    
var msg=[ 0xB0,0x79,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x7B,0x00 ];
mOut.send( msg );

var msg=[ 0xB0,0x78,0x00 ];
mOut.send( msg );
    
if(LiVo._num_synth>1){
  var msg=[ 0xB0,0x79,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x7B,0x00 ];
  mOut2.send( msg );

  var msg=[ 0xB0,0x78,0x00 ];
  mOut2.send( msg );
  
  if(LiVo._num_synth>2){
  
    var msg=[ 0xB0,0x79,0x00 ];
    mOut3.send( msg );

    var msg=[ 0xB0,0x7B,0x00 ];
    mOut3.send( msg );

    var msg=[ 0xB0,0x78,0x00 ];
    mOut3.send( msg );
  
  }
  
}

});




