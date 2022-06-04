import ClassroomCard from "./classroomcard";
import * as React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import {useEffect,useState} from "react";
import {getAuth,onAuthStateChanged} from 'firebase/auth';
import axios from 'axios';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import Createclass from './createclass';
import CircularProgress from '@mui/material/CircularProgress';
import Joinclass from './joinclass';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
export default function Adminhome(){
 
 //const mytoken=state.idToken;
 const [loading,setloading]=useState(false);
 const [logoutloading,setlogoutloading]=useState(false);
  const [classrooms,setclassrooms]=useState([]);
  const[usertoken,settoken]=useState(null);
  const[userid,setuserid]=useState("");
  const [status,setstatus]=useState("inside");
  const Navigate=useNavigate();
  //fetch my enrolled classrooms when component did mount
   useEffect( ()=>{
     let listner=setTimeout(() => {
       Navigate("/");
     }, 5000);
    if(getAuth().currentUser) {
     getAuth().currentUser.getIdToken(true).then((idtoken)=>{
   //  async()=>{
     settoken(idtoken);
     clearTimeout(listner);
      //}
     // fetchclass();
     }) }
else{
const auth=getAuth();
onAuthStateChanged(auth, (user)=>{
  if(user){
    //console.log(user);
    settoken(user.accessToken);
    clearTimeout(listner);
  }
})}


const fetchclass=async()=>{
  try {
    setloading(true);
    const res= await axios.get(`${process.env.REACT_APP_NODEJS_SERVER}/classroom`,{
      headers:{
        Authorization:'Bearer '+ usertoken
      //  information:user
      }
    });
    setloading(false);
 //   console.log(res.data);
// if(res.data.arr!==[])
   setclassrooms(res.data.arr); 
    setuserid(res.data.user);
   
  } catch (error) {
   console.log(error); 
   setloading(false);
  }
}
  if(usertoken)
  fetchclass();
   },[usertoken])

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
    return (
        <div>
          {status!=="inside" &&  <Fab variant="extended" onClick={()=>setstatus("inside")}>
        <ArrowBackIcon sx={{ mr: 1 }} />
       Back
      </Fab>}
      <Fab color="primary" aria-label="add" style={{float:"right"}}>
        < ExitToAppIcon onClick={signout} disabled={logoutloading} />
      </Fab>
      {logoutloading && <CircularProgress style={{float:"right"}}/>}
       {status==="inside" &&      <Fab color="primary" aria-label="add" style={{float:"right"}}>
        <AddIcon onClick={()=>setstatus("create")} />
      </Fab>}
   { status==="inside" &&  <Button variant="outlined" startIcon={<SchoolIcon />} onClick={()=>setstatus("join")}>
       JOIN CLASS
      </Button> }
      
  {loading && "Loading...."}
            <Grid container  rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
   {
        status==="inside" &&  (classrooms.length>0) &&
        classrooms.map((element)=>{
         //console.log(element);
          if(element.facultyname)
          return(
            <ClassroomCard token={usertoken} currentuserid={userid} subject={element.subject} faculty={element.facultyname}  classroomcode={element.classroomcode} facultyuserid={element.facultyuid} setclassrooms={setclassrooms} />     
          );
          else
          return(<div></div>);
        })
   }
      
      </Grid>
      {status==="create" && <Createclass usertoken={usertoken}  setstatus={setstatus} setclassrooms={setclassrooms} />}
      {status==="join" && <Joinclass usertoken={usertoken} setstatus={setstatus}  setclassrooms={setclassrooms} />}
        </div>
    );
  
}







