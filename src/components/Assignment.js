import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import moment from 'moment';
import Newassignment from './Newassignment';
import InsideAssignment from './insideAssignment';
import Skeletonassignment from './assignmentSkeleton';
export default function Assignment({token,classroomcode,currentuser}){
 const [assignment,setassignment]=useState([]);
 const [fuid,setfuid]=useState("");
 const [closeass,setcloseass]=useState(true);
 const [loading,setloading]=useState(false);
 const [status,setstatus]=useState(false);
 const [currentass,setcurrentass]=useState();
 useEffect(()=>{
const fetchass=async ()=>{
  try {
    setloading(true);
    const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/assignment`,{
      classroomcode:classroomcode
    },{
      headers:{
        Authorization: 'Bearer '+token
      }
    });
    const resp=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/facultyuid`,{
      classroomcode:classroomcode
    },{
      headers:{
        Authorization: 'Bearer '+token
      }
    });
   if(res.data!==[])
    setassignment(res.data);
  //  console.log(res.data);
  if(resp.data!==[])
  setfuid(resp.data);
    setloading(false);
  
  //  console.log(res);
  
  // console.log(resp.data);
//   console.log(currentuser);
  } catch (error) {
  console.log(error);  
setloading(false);
  }
}
fetchass();
//console.log("1");
 },[classroomcode,token])
function handleclick(element){
setcurrentass(element);
setcloseass(false);
}
 if(!loading){
   return(
   <div>
   { (currentuser===fuid) && closeass && !status &&<Button variant="contained" color="success"  style={{marginBottom:"3%"}} onClick={()=>setstatus(true)}>
  Create Assignment
</Button>}
   {!closeass && <InsideAssignment Assignment={currentass} classroomcode={classroomcode} currentuserid={currentuser} facultyid={fuid} token={token} setcloseass={setcloseass} />}
     {status && (currentuser===fuid) && <Newassignment classroomcode={classroomcode} token={token} setstatus={setstatus} setassignment={setassignment} /> }
     {
     (assignment!==[]) && !status && closeass &&
     <Grid container  rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginLeft:"2%"}}>
   {
       assignment.map((element)=>{
        //  console.log("map");
       return(
         <Box sx={{ maxWidth: 285,minWidth: 285 }}>
         <Card variant="outlined"><CardContent>
         <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {element.heading}
         </Typography>
         <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`posted on ${moment(element.posted).format('LLLL')}` }
         </Typography>
         <Typography variant="body2">
           {`last date ${moment(element.lastdate).format('LLL')}`}
         </Typography>
       </CardContent>
       <CardActions>
         <Button size="small" onClick={()=>handleclick(element)}>view</Button>
       </CardActions></Card>
       </Box>
       );  
        })
   }
  </Grid>
     }
   </div>
   );
    }
   else
   return<Skeletonassignment />;
}