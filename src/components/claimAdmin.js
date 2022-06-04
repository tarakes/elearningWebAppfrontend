import axios from "axios";
import {getAuth} from "firebase/auth";
  
 export default async function claimAdmin(classroomcode,assignmentcode,token){
    try{
      console.log("claim started");
   const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/adminclaim`,{
          classcode:classroomcode,
          serialno:assignmentcode
      },{
          headers:{
            Authorization:'Bearer '+token
          }
        }); 
        console.log("fetched");
        if(res.data.status==="success"){
          console.log("claim granted");
          getAuth().currentUser.getIdToken(true);
        }else if(res.data.status==="fail")
        alert("Failed! please refresh and try again!");
        else
        console.log("unsuccess");
      }catch(err){
        console.log(err);
      }
     
  }
  