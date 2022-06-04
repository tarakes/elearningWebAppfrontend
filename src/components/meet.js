import Peer from 'peerjs';
import {useState,useEffect} from 'react';
import {io} from 'socket.io-client';
import axios from 'axios';
import AlertTitle from '@mui/material/AlertTitle';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Videogrid from '../Style/Videogrid.module.css';
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
export default function Meet({token,code,setstatus,me,classroomcode}){
 //   const [videogrif,setvideogrid]=useState([]);
    const [mystream,setmystream]=useState(null);
    const [videon, setvideon] = useState(true);
    const [audion, setaudion] = useState(true);
    const [isadmin,setadmin]=useState(false);
    const [mypeer,setpeer]=useState(null);
    const [wl,setwl]=useState([]);
    const [wait,setwait]=useState(false);
  //  const [secondstream,setsstream]=useState(null);
    const [issshared,setsshared]=useState(false);
    const [loading,setloading]=useState(false);
    const [memberuid,setmemberuid]=useState([]);
    const [close,setclose]=useState(false);
   // const uid=me.uid;
    const [socket,setsocket] = useState(io(`${process.env.REACT_APP_NODEJS_SERVER}`));
    const [copy,setcopy]=useState(false);
  useEffect(()=>{
    const fetchstatus=async ()=>{
        try{
            setloading(true);
            const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/meetdetail`,{
                code:code
            },{
                headers:{
                    Authorization:'Bearer '+token
                  }
               }); 

    if(res.data!==[]){
        setadmin(res.data);
    }
    setloading(false);
        }catch(error){
            setloading(false);
console.log(error);
        }
     }
     navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        console.log("media stream own");
        setmystream(stream); 
      //  setsstream(stream);
     //   console.log(mystream);
    if(!document.getElementById(me.uid)){         
                         let divcont= document.createElement("div");
    let videocont=document.createElement("video");
     videocont.autoplay=true;
    videocont.muted=false;
    videocont.srcObject=stream;
    let textnode=document.createElement("p");
    textnode.innerHTML=me.displayName+" (You)";
    divcont.appendChild(videocont);
    divcont.appendChild(textnode);
    divcont.setAttribute("id",me.uid);
    videocont.addEventListener("click",()=>{
        videocont.requestFullscreen();
    })
    document.getElementsByClassName(Videogrid.Grid)[0].appendChild(divcont);
     /*   let vdelm=document.createElement("video");
        let frame=document.createElement("div");
        let txt=document.createElement("p");
        const node=document.createTextNode(me.displayName);
        txt.appendChild(node);
        vdelm.autoplay=true;
        vdelm.muted=false;
        vdelm.setAttribute("id",me.uid);
        vdelm.style.width="200px";
        vdelm.style.height="200px";
        vdelm.srcObject=stream;
        frame.appendChild(vdelm);
        frame.appendChild(txt);
        frame.style.display="inline-block";
        document.getElementById("videogrid").appendChild(frame);*/
    }
       // setvgrid((prevarr)=>[...prevarr,{stream:stream,name:me.displayName,avatar:me.photoURL}]);
       }).catch(err => {
         console.error('Failed to get local stream', err);
       })
     fetchstatus();

},[code,token,me,socket])
useEffect(()=>{
    socket.on('connect',()=>{
        console.log("socket connected");
         socket.emit('joinroom',code,token); 
     })
},[socket,code,token])
useEffect(()=>{
    if(mystream){
       // console.log(mystream);
     
        const peer = new Peer(me.uid,{
            secure:true,
           host:'tapupeerserver.herokuapp.com',
           path:'/myapp'
       });
       setpeer(peer);
        socket.on("newuser",(id,avatar,name)=>{
            console.log("newuser");
            //console.log(id);
            /* ,{
               metadata:{
                   "name":me.displayName,
                   "avatar":me.photoURL,
                   "id":me.uid
               }
           }*/
         //  console.log(mystream);
         setmemberuid((prevarr)=>[...prevarr,id]);
           const call = peer.call(id, mystream,{
               metadata:{
                   name:me.displayName,
                   avatar:me.photoURL,
                   id:me.uid
               }
           });
           call.on('stream', (remoteStream) => {
              if(!document.getElementById(id)){
                          let divcont= document.createElement("div");
    let videocont=document.createElement("video");
     videocont.autoplay=true;
    videocont.muted=false;
    videocont.srcObject=remoteStream;
    let textnode=document.createElement("p");
    textnode.innerHTML=name;
    divcont.appendChild(videocont);
    divcont.appendChild(textnode);
    divcont.setAttribute("id",id);
    videocont.addEventListener("click",()=>{
        videocont.requestFullscreen();
    })
    document.getElementsByClassName(Videogrid.Grid)[0].appendChild(divcont);
                
                
          /*      let vdelm=document.createElement("video");
                let frame=document.createElement("div");
                let txt=document.createElement("p");
                const node=document.createTextNode(name);
                txt.appendChild(node);
                vdelm.autoplay=true;
                vdelm.muted=false;
                vdelm.setAttribute("id",id);
                vdelm.style.width="200px";
                vdelm.style.height="200px";
                vdelm.srcObject=remoteStream;
                frame.appendChild(vdelm);
                frame.appendChild(txt);
                frame.style.display="inline-block";
                document.getElementById("videogrid").appendChild(frame); */
              }
       //   setvgrid((prevarr)=>[...prevarr,{stream:remoteStream,name:name,avatar:avatar}]);
           }); 
        })
        socket.on("joinnow",(code)=>{
            setwait(false);
            socket.emit("joinroom",code,token);
        })
    socket.on("plzwait",(id)=>{
        console.log("waiting");
        setwait(true);
    })
    
            socket.on("waiting",(useruid,username,avatar)=>{
                console.log("waiting");
       setwl((prevarr)=>[...prevarr,{name:username,id:useruid,avatar:avatar}]);
            })
            socket.on("removeFrame",(id)=>{
                console.log("removeFrame");
                document.getElementById(id).remove();
            })
        peer.on('call', (call) => {
            console.log("new call",call.metadata);
           call.answer(mystream); // Answer the call with an A/V stream.
             call.on('stream', (remoteStream) => {
                 console.log("call on");    
                setmemberuid((prevuidarr)=>[...prevuidarr,call.metadata.id]);       
               if(!document.getElementById(call.metadata.id)){
            /*    let vdelm=document.createElement("video");
                let frame=document.createElement("div");
                let txt=document.createElement("p");
                const node=document.createTextNode(call.metadata.name);
                txt.appendChild(node);
                vdelm.autoplay=true;
                vdelm.muted=false;
                vdelm.setAttribute("id",call.metadata.id);
                vdelm.style.width="200px";
                vdelm.style.height="200px";
                vdelm.style.marginTop="-13%";
                vdelm.style.marginBottom= "-45px"; */   
                
                 let divcont= document.createElement("div");
    let videocont=document.createElement("video");
     videocont.autoplay=true;
    videocont.muted=false;
    videocont.srcObject=remoteStream;
    let textnode=document.createElement("p");
    textnode.innerHTML=call.metadata.name;
    divcont.appendChild(videocont);
    divcont.appendChild(textnode);
    divcont.setAttribute("id",call.metadata.id);
    videocont.addEventListener("click",()=>{
        videocont.requestFullscreen();
    })
    document.getElementsByClassName(Videogrid.Grid)[0].appendChild(divcont);
                
         /*       vdelm.srcObject=remoteStream;
                frame.appendChild(vdelm);
                frame.appendChild(txt);
                frame.style.display="inline-block";
                frame.style.border="12px solid #5668ff";
                document.getElementById("videogrid").appendChild(frame);  */
               }
              // setvgrid((prevarr)=>[...prevarr,{stream:remoteStream,name:remoteStream.metadata.name,avatar:remoteStream.metadata.avatar}]);
             });
         }); }
},[mystream,code,me,socket,token])
//console.log(mystream);

useEffect(()=>{
    return ()=>{
    /*   mystream.getTracks().forEach(function(track) {
             track.stop();       
        
    }); */ 
   // socket.disconnect(); 
   socket.emit("remove",me.uid,code); 
   window.location.reload();
    }
},[code,me.uid,socket]) 


/*function getMymedia(){
   
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream=>{
//setsstream(stream);
    }  );
    
}  */
function handleallow(user){
socket.emit("allow",code,user.id);
setwl((prevarr)=>prevarr.filter((elment)=>elment!==user))
} 
// stop only camera
function stopVideoOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live' && track.kind === 'video') {
          //  track.stop();
           track.enabled=false;
           
        }
    });
    
    
    //window.localeStream
   // document.querySelector(`#${me.uid} video`).srcObject=null;
}

// stop only mic
function stopAudioOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live' && track.kind === 'audio') {
            track.enabled=false;
           
        }
    });
}

// play only mic
function playAudioOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live' && track.kind === 'audio') {
           // track.stop();
           track.enabled=true;
        }
    });
}
function playVideoOnly(stream) {
   stream.getTracks().forEach(function(track) {
        if (track.readyState === 'live' && track.kind === 'video') {
            track.enabled=true;
        }
    });  
  
}

function handlecopy(){
    setcopy(true);
    setTimeout(() => {
      setcopy(false);
    }, 2000);
    }
function addNewFrame(displayStream,name,frameid){
   if(document.getElementById(frameid))
   return; 
    let divcont= document.createElement("div");
    let videocont=document.createElement("video");
     videocont.autoplay=true;
    videocont.muted=false;
    videocont.srcObject=displayStream;
    let textnode=document.createElement("p");
    textnode.innerHTML=name;
    divcont.appendChild(videocont);
    divcont.appendChild(textnode);
    divcont.setAttribute("id",frameid);
    videocont.addEventListener("click",()=>{
        videocont.requestFullscreen();
    })
    document.getElementsByClassName(Videogrid.Grid)[0].appendChild(divcont);
                
}
async function shareScreen(hasAudio){
    try {
        
       let captureStream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:hasAudio});
     /*  captureStream.onended= () => { // Click on browser UI stop sharing button
        document.getElementById(" your screen").remove();
        socket.emit("remove",me.uid+" 's screen");
        console.log("ScreenShare has ended");
      }; */
      captureStream.getVideoTracks()[0].addEventListener('ended',()=>{
        document.getElementById(me.uid+" 's screen").remove();
        socket.emit("remove",me.uid+" 's screen",code);
        console.log("ScreenShare has ended");  
      })
       addNewFrame(captureStream," your screen",me.uid+" 's screen");
       setsshared(true);
   
   setmemberuid((prevarr)=>[...new Set(prevarr)]);
   memberuid.forEach((el)=>{
      // console.log(el);
  mypeer.call(el, captureStream,{
        metadata:{
            name:me.displayName+" 's screen",
            avatar:me.photoURL,
            id:me.uid+" 's screen"
        }
    });
    
   })
      } catch(err) {
        console.error("Error: " + err);
      }
}
const handleChange = (event) => {
    if(videon)//video is on and user want to off
    {
       stopVideoOnly(mystream);
    }
    else{ //video is off and user want to turn on
      playVideoOnly(mystream); 
    }
    setvideon(event.target.checked);
  };

  const handleaudioChange = (event) => {
    if(audion)//audio is on and user want to off
    {
       stopAudioOnly(mystream);
      
    }
    else{ //audio is off and user want to turn on
      playAudioOnly(mystream); 
    }
    setaudion(event.target.checked);
  };

  const handleleave= ()=>{
    socket.emit("remove",me.uid,code);
/*  mystream.getTracks().forEach(function(track) {
    if (track.readyState === 'live') {
         track.stop();       
    } 
});
    setstatus(false);*/
    window.location.reload();
  };
return(
    <div>
        <div style={{
               border: "2px solid #a59797",
               backgroundColor: "white"
        }}>
            <CopyToClipboard text={code} 
         onCopy={handlecopy}>
           <Chip label={code} color="success" variant="outlined" style={{float:'right'}}/>
          </CopyToClipboard>
          { copy &&   <Alert severity="success" style={{width:"200px"}}>copied to clipboard</Alert> }
      <Fab  aria-label="like" style={{float:"right",backgroundColor:"red"}}  onClick={handleleave}>
      <LocalPhoneIcon />
</Fab>
{!issshared && <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={()=>shareScreen(true)}>share screen with audio</Button>
      <Button variant="contained" onClick={()=>shareScreen(false)}>share screen without audio</Button>
    </Stack> }
   
<Stack direction="row" spacing={1} alignItems="center">
        <Typography>Video Off</Typography>
        <Switch
      checked={videon}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
        <Typography>Video On</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Audio Off</Typography>
        <Switch
      checked={audion}
      onChange={handleaudioChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
        <Typography>Audio On</Typography>
      </Stack>
      </div>
    { wait &&  <Alert severity="info">
  <AlertTitle>Please wait</AlertTitle>
  waiting for admin to allow  <strong>Don't refresh the page!</strong>
</Alert> }
    <div className={Videogrid.Grid} ></div>
    {close  && wl.length>0 && <KeyboardArrowRightIcon onClick={()=>setclose((prev)=>!prev)}  style={{color:"red",cursor:"pointer",transform: "translateY(-764px)"}} />}
       {!close && wl.length>0 && <CloseIcon onClick={()=>setclose((prev)=>!prev)}  style={{color:"red",cursor:"pointer",transform: "translateY(-764px)"}} /> }
   {!loading &&  wl.length>0 && <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style={{
       transition: "margin-left 2s",
       marginLeft:close?"-50%":"2%",
       marginTop:"-775px"
   }}>
     
  { isadmin &&   wl.map((el)=>{
      return(
        <ListItem>
        <ListItemAvatar>
        <Avatar alt={el.name} src={el.avatar} onClick={()=>handleallow(el)} />
        </ListItemAvatar>
        <ListItemText primary={el.name} secondary="click on dp tp allow" />
      </ListItem>
      );
  }) }
  
 
      </List> }
  
    </div>
);


}
//4vCI6Hyo
//PluxnIMh