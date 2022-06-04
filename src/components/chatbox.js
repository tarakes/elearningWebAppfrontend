import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import "../Style/global.css";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
export default function Chatbox({token,classroomcode,TO,user,setcurrentchat}) {
    //chat array should ne fetched from server for initialization
    //as soon as TO change new chat array should be fetched from server
    const [chat,updatechat]=React.useState([]);      //useState([{from:TO,to:"SGC",text:"hello mam i am student1"},{from:"SGC",to:TO,text:"what is your problem"}]);
const [loading,setloading]=React.useState(false);
const [sent,setsent]=React.useState(false);
    React.useEffect(()=>{
//console.log(TO);
 const fetchchat=async ()=>{
   try {
     setloading(true);
    const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/chats`,{
      classroomcode: classroomcode,
      to:(user.uid===TO.fromuid)?TO.touid:TO.fromuid
    },{
      headers:{
        Authorization: 'Bearer '+token
      }
    });
    if(res.data!==[])
    updatechat(res.data); 
    setloading(false);
   } catch (error) {
    setloading(false);
     console.log(error);
   }
 }
 if(TO)
 fetchchat();
  },[TO,classroomcode,token,user.uid])
    async  function addmymsg(){
          //message should be post made post request to store in database
        const text=document.getElementById("standard-basic").value;
        if(text!=="")
       // updatechat(oldarr=>[...oldarr,{from:currentuser,to:TO,text:text}]);
{
  try {
    setsent(true);
    const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/savechats`,{
      classroomcode: classroomcode,
      to:(user.uid===TO.fromuid)?TO.touid:TO.fromuid,
      text:text
    },{
  headers:{
    Authorization: 'Bearer '+token
  }
});
document.getElementById("standard-basic").value="";
if(res.data!==[])
updatechat(res.data); 
setsent(false);
  } catch (error) {
    setsent(false);
    console.log(error);
  }
}
     //   document.getElementById("standard-basic").value="";
      }
     // console.log(loading,TO);
      if(!loading)
    return (
        <div className='chatbox'>
          <CloseIcon onClick={()=>setcurrentchat(null)}  style={{cursor: "pointer"}} />
<Chip
  avatar={<Avatar alt={user.uid===TO.fromuid?TO.toname:TO.fromname} src={user.uid===TO.fromuid?TO.toavatar:TO.fromavatar} />}
  label={user.uid===TO.fromuid?TO.toname:TO.fromname}
  variant="outlined"
/>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style={{overflow:"scroll",height:"300px"}}>
   {
       chat.map((e)=>{
           return(
               <>
                 <ListItem >
        <ListItemAvatar>
        <Avatar alt={e.from===TO.fromuid?TO.fromname:TO.toname} src={e.from===TO.fromuid?TO.fromavatar:TO.toavatar} />
        
        </ListItemAvatar>
        <ListItemText
          primary={e.data}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
     
               </>
           )
       })
   }
    </List>
    <TextField id="standard-basic" label="Type" variant="standard" /><Button variant="contained" endIcon={<SendIcon />} onClick={addmymsg} disabled={sent}>
        Send
      </Button>
    </div>
  );
  else
  return(
    <div></div>
  );
}
