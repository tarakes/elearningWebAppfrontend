import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import Mycontactlist from './mycontactlist';
import axios from 'axios';
import '../Style/global.css';
export default function Personalchat({token,classroomcode,currentuser}) {
    //otheruserid,mycontactlist should be fetched from server
    const [otheruser,setotheruser]=React.useState([]); //[{id:"std1",name:"student1"},{id:"std2",name:"student2"}];
   const [mycontact,updatemycontact]=React.useState([]);//[{id:"std1",name:"student1"},{id:"std2",name:"student2"}]
   const [error,seterror]=React.useState("");
   const [loading,setloading]=React.useState(false);
 //  const token="ldd"//get token
 
   React.useEffect(()=>{
   
    const fetchdetails=async()=>{
      try {
        setloading(true);
       const res=await  axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/personalchat`,{
         classroomcode: classroomcode
       },{
         headers:{
           Authorization:'Bearer '+token
         }
        }); 
        if(res.data!==[])  {
          let userlist=res.data.alluser;
        let filterArray=  userlist.filter((element)=>{
            return (element.studentuid!==currentuser.uid);
          })
 setotheruser(filterArray);

 updatemycontact(res.data.mycontact);
 
 }
 
 setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }}
      fetchdetails();
    
   },[classroomcode,token,currentuser])
async function call(user,event){
    //save contactlist by post request to server
   // console.log(user);
    const found = mycontact.find(element => {
     //   console.log(element);
        return( (element.fromuid===user.studentuid)||(element.touid===user.studentuid));
        });
    
    if(!found)
   // updatemycontact(oldarr=>[...oldarr,{id:user.id,name:user.name}]);
   {
try {
 // console.log(user);
  const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/addtocontact`,{
    classroomcode: classroomcode,
    newcontact:user
  },{
  headers:{
    Authorization: 'Bearer '+token
  }
});
if(res.data!==[])
updatemycontact((prevarr)=>[...prevarr,res.data]);
} catch (error) {
  console.log(error);
}
   }
    else{
        seterror("user is already added in contactlist");
        setTimeout(() => {
            seterror("");
        }, 4000);
    }
}
if(!loading)
  return (
     <div style={{display:"flex" }} >
          <div  className="allcontact">

<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
   {error &&  <Alert severity="error">{error}</Alert>} 
{
    
          otheruser.map((e)=>{
          return( 
              <div style={{backgroundColor:"#f9f9f9"}}>
               
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
            <Avatar alt={e.studentname} src={e.studentavatar} />
            </ListItemAvatar>
           
            <ListItemText
              primary={e.studentname}
            />
             <AddIcon style={{cursor:"pointer"}} onClick={(event)=> call(e,event)}/>
          </ListItem>
        
          <Divider variant="inset" component="li" />
          </div>
         );    
          
          })
        }
        </List>
      </div>
    <Mycontactlist token={token} classroomcode={classroomcode} arr={mycontact} user={currentuser} /> 
     </div>
  );
  else
  return ("Loading....");
}
