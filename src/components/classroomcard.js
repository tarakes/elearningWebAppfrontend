import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
//import axios from 'axios';
export default function ClassroomCard({token,currentuserid,subject,faculty,classroomcode,facultyuserid,setclassrooms}) {

 async function unsubscribe(){
   alert("Coming Soon!");
   /*
    if(currentuserid===facultyuserid){
    try {
      //delete whole class data and fetch classrooms after deleteing from databse
    const res=  await axios.delete(`${process.env.REACT_APP_NODEJS_SERVER}/removeclass`,{
        headers:{
          Authorization: 'Bearer '+token,
          classcode:classroomcode
        }
    });
    if(res.data!==[])
setclassrooms(res.data);
    } catch (error) {
      console.log(error);
    }
  } 
else{
try {
  //delete user from the class and fetch classrooms after deleting user from class
  const res=await axios.delete(`${process.env.REACT_APP_NODEJS_SERVER}/removeuser`,{
    headers:{
      Authorization:'Bearer '+token,
      classcode:classroomcode
    }
  });
  if(res.data!==[])
  setclassrooms(res.data);
} catch (error) {
  console.log(error);
}
}

*/
}
  return (
    <Card sx={{ maxWidth: 345 }}  style={{marginLeft:"15px", marginTop:"10px" ,width:"80%"}}>
      <CardMedia
        component="img"
        height="140"
        image="images/elearning.jpg"
        alt="Elearing"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
         {subject}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {faculty}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={`/${classroomcode}`}>view</Button>
        <Button size="small" onClick={unsubscribe}>{(currentuserid===facultyuserid)?"Delete":"Unenroll"}</Button>
      </CardActions>
    </Card>
  );
}
