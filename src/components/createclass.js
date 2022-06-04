import axios from "axios";
import { useState } from "react";
import Button from '@mui/material/Button';
import '../Style/global.css';
export default function Createclass({usertoken,setstatus,setclassrooms}){
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    
    const [error,seterror]=useState(false);
const handleclick=async()=>{
try {
  if(document.getElementById("subject-field").value===""){
    alert("Field cannot be blank!");
    return;
  }
const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/newclass`,{
    classroomcode: makeid(6),
    subject:document.getElementById("subject-field").value
  },{
    headers:{
        Authorization:'Bearer '+usertoken
      }
   });
   if(res.data!==[]){
 //   console.log(res.data);
       setclassrooms(res.data.arr);
      
   setstatus("inside");
   }
   else{
       seterror(true);
       setTimeout(() => {
        setstatus("inside");  
       }, 3000);
   }
} catch (error) {
  console.log(error);
  setstatus("inside");
}
}
    return(
        <div>
            {error && <p>Unable to create class</p>}
            <div style={{marginLeft:"20%"}} className="createclass">
                Enter subjectname<input type="text" id="subject-field" style={{borderradius:"10px",height:"20px"}}/>
<Button variant="contained" onClick={handleclick}>Create class</Button>
            </div>
        </div>
    );
}