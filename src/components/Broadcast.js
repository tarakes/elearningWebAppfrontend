import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Skeleton from '@mui/material/Skeleton';
import '../Style/global.css';
import axios from 'axios';
export default function Broadcast({token,classroomcode}) {
   // const [arr,setarr]=React.useState([{from:"SGC",text:"today no class"},{from:"student1",text:"ok mam"},{from:"Student2",text:"next class mam?"}]);
   const [broadcastmsg,setbroadcastmsg]=React.useState([]);
   const [loading,setloading]=React.useState(false);
  // const token="ldjkdhkd"//get firebase token
   React.useEffect(()=>{
     //fetch broadcast message after component did mount
 const fetchBroadcast=async()=>{
   try {
    setloading(true);
     const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/broadcast`,{classcode:classroomcode},{
       headers:{
         Authorization: 'Bearer '+token
       }
     }); 
     setloading(false);
     setbroadcastmsg((prevarr)=>[...prevarr,...res.data]);
   } catch (error) {
     setloading(false);
     console.log(error);
   }
 }
 fetchBroadcast();
   },[token,classroomcode]);
     
     
   
  async function handleAddMsg(e){
        //post request to server  
        const mytext=document.getElementById("outlined-basic").value;
        
  if(mytext!==""){
   
 
 try {
  const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/post`,{ 
classcode:classroomcode,
  text:mytext },{
    headers:{
      Authorization: 'Bearer '+token
    }
  });
  //fetch the broadcast data after posting and update state
  if(res.data!==[])
  setbroadcastmsg(res.data);
  document.getElementById("outlined-basic").value="";
 } catch (error) {
   console.log(error);
 }
  }
    }
   
  
 if(!loading)
  return (
      <div className="broadcast"><TextField id="outlined-basic" label="Type here" variant="outlined" /><br /><SendIcon fontSize="large" onClick={handleAddMsg}/>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    
  {
  
  broadcastmsg.map((e)=>{
        return(   <>
            <ListItem alignItems="flex-start">
            <ListItemAvatar>
            <Avatar alt={e.from} src={e.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={e.data}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                  {e.from}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          </> );
    })
  }
    </List>
    </div>
  );
  else
  return( 
    <div className="skltnbroadcast">
  <Skeleton variant="rectangular" width={300} height={50}  /><br/>
  <Skeleton variant="rectangular" width={300} height={50}  /><br/>
  <Skeleton variant="rectangular" width={300} height={50} /><br/>
  <Skeleton variant="rectangular" width={300} height={50}  />
  </div>
  );
        }
