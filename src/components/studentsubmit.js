import { useEffect,useState } from "react";
import MediaCard from './Mediacard';
import axios from 'axios';
export default function Studentsubmit({classroomcode,serialno,token,currentuserid}){
    const [isUploaded,setstatus]=useState(false);
    const [loading,setloading]=useState(false);
    useEffect(()=>{
        const fetchstatus=async()=>{
            try {
               // const token="sljhdkhd"//get token
               setloading(true);
                const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/status`,{
                    classcode:classroomcode,
                    assignment:serialno
                },{
                    headers:{
                      Authorization:'Bearer '+token
                    }
                  }); 
                  if(res.data!==[])
                   setstatus(res.data);   
                  setloading(false); 
            } catch (error) {
              console.log(error);  
              setloading(false);
            }
        }
        fetchstatus();
    },[classroomcode,serialno,token])
    if(!loading)
    return(
<div>
   {!isUploaded && <div><MediaCard classroomcode={classroomcode} serialno={serialno} token={token} currentuserid={currentuserid} /></div>}

</div>
    );
    else
    return ("Loading....");
}