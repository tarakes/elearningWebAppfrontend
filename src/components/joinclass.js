import axios from "axios";
import { useState } from "react";
import Button from '@mui/material/Button';
import '../Style/global.css';
export default function Joinclass({ usertoken,setstatus, setclassrooms}){
const [error,seterror]=useState(false);
const handleclick=async()=>{
   
try {
    if(document.getElementById("subject-field").value===""){
        alert("field cannot be blank!");
        return;
    }
const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/joinclass`,{
        classroomcode:document.getElementById("subject-field").value
},{
    headers:{
        Authorization:'Bearer '+usertoken
      }
   });
   if(res.data!==[]){
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
            {error && <p>Unable to join class</p>}
            <div style={{marginLeft:"25%"}}  className="joinclass">
                Enter classcode<input type="text" id="subject-field" style={{borderRadius:"12px",height:"20px"}}/>
<Button variant="contained" onClick={handleclick}>Join class</Button>
            </div>
        </div>
    );
}