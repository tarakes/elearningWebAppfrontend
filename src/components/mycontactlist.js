import * as React from 'react';
import "../Style/global.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ContactsIcon from '@mui/icons-material/Contacts';
import Chatbox from './chatbox';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
export default function Mycontactlist({token,classroomcode,arr,user}){
    const [currentchat,setcurrentchat]=React.useState(null);
if(arr.length>0)
return(
    <>
    <div style={{overflow:"scroll"}} className="mycontact">
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
<ContactsIcon fontSize="large" style={{marginLeft:"15px"}}/>
{
    
          arr.map((e)=>{
          return( 
              <div style={{backgroundColor:"#ffe7e7",borderRadius: "40px 0px 46px 5px"}} >
               
          <ListItem alignItems="flex-start" style={{cursor:"pointer"}} >
            <ListItemAvatar onClick={()=>setcurrentchat(e)}>
            <Avatar alt={(e.fromuid===user.uid)?e.toname:e.fromname} src={(e.fromuid===user.uid)?e.toavatar:e.fromavatar} />
            
            </ListItemAvatar>
           
            <ListItemText
              primary={(e.fromuid===user.uid)?e.toname:e.fromname}
            />
           {!e.status  && <EmailRoundedIcon style={{color:"red"}}/> }
          </ListItem>
        
          <Divider variant="inset" component="li" />
         
          </div>
         );    
          
          })
        }
        </List>
      
    </div>
    <br /> <br />
   {currentchat  && <div style={{marginTop:"5%",float:"left"}}><Chatbox token={token} classroomcode={classroomcode} TO={currentchat} user={user} setcurrentchat={setcurrentchat} /></div>  }
    </>
);
else
return(<div></div>);
}