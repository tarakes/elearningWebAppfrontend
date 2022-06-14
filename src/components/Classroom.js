import { useParams } from 'react-router';
import * as React from 'react';
import Box from '@mui/material/Box';
import Assignment from './Assignment';
import Alert from '@mui/material/Alert';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ChatIcon from '@mui/icons-material/Chat';
import Chip from '@mui/material/Chip';
import '../Style/global.css';
import Broadcast from './Broadcast';
import CircularProgress from '@mui/material/CircularProgress';
import LandingPage from "./landingMeet";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Personalchat from './personalchat';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import Fab from '@mui/material/Fab';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
export default function Classroom(){
  const {classroomcode}=useParams();
  const [value, setValue] = React.useState(0);
  const [token,settoken]=React.useState("");
  const [logoutloading,setlogoutloading]=React.useState(false);
  const [copy,setcopy]=React.useState(false);
  const [currentuser,setcurrentuser]=React.useState(null);
  const Navigate=useNavigate();
React.useEffect(()=>{
  const gotologin=setTimeout(()=>{
    Navigate("/")
  },10000);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
    settoken(user.accessToken);
    clearTimeout(gotologin);
   setcurrentuser(user);
    } else {

    }
  });
},[])
function signout(){
  setlogoutloading(true);
 const  auth=getAuth();
 auth.signOut().then(()=>{
   setlogoutloading(false);
   Navigate("/");
 }).catch(err=>{
   console.log(err);
   setlogoutloading(false);
 })
}
function handlecopy(){
setcopy(true);
setTimeout(() => {
  setcopy(false);
}, 2000);
}
if(token!=="")
   return ( <><Box    className="navigationmenu">
    <BottomNavigation
      showLabels
      value={value}
      style={{backgroundColor:"#ecf4f7"}}
      onChange={(event, newValue) => {
        setValue(newValue);
        
      }}
    >
      <BottomNavigationAction label="Announcement" icon={<PodcastsIcon />} />
      <BottomNavigationAction label="Assignment" icon={<AssignmentIcon />} />
      <BottomNavigationAction label="Meet" icon={<VideoCallIcon/>} />
      <BottomNavigationAction label="Chat" icon={< ChatIcon/>} />
    </BottomNavigation>
  </Box>
  <div  className="logoutbutton">
  <Fab color="primary" aria-label="add" style={{float:"right"}}  >
        < ExitToAppIcon onClick={signout} disabled={logoutloading} />
      </Fab>
      {logoutloading && <CircularProgress style={{float:"right"}} />}
  <CopyToClipboard text={classroomcode} 
         onCopy={handlecopy}>
           <Chip label={classroomcode} color="success" variant="outlined" style={{float:'right'}} className="chipclasscode" />
          </CopyToClipboard>
      { copy &&   <Alert severity="success">copied to clipboard</Alert> }
      </div>
  {value===0 && <Broadcast token={token} classroomcode={classroomcode} />}

  {value===1 && <Assignment token={token} classroomcode={classroomcode}   currentuser={currentuser.uid} />  }
  {value===2 && <LandingPage token={token} currentuser={currentuser}  classroomcode={classroomcode} />}
  {value===3 && <Personalchat token={token} classroomcode={classroomcode}    currentuser={currentuser}  /> }
  </>
  );
  else
  return("loading....."); 
}
