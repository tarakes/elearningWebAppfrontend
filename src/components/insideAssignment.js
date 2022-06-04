import BasicTable from './assignmenttable';
import AssignmentFile from './Assignmentfile';
import Studentsubmit from './studentsubmit';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
export default function InsideAssignment({Assignment,classroomcode,currentuserid,facultyid,token,setcloseass}){
const Navigate=useNavigate();
useEffect(()=>{
    if(!token)
    Navigate("/");
   
},[])
if(token)
return(
<div>
<Button variant="outlined" onClick={()=>setcloseass(true)}>Close</Button>
<AssignmentFile assignment={Assignment} />
{(currentuserid===facultyid)?<BasicTable classroomcode={classroomcode} serialno={Assignment.serialno} token={token} />:<Studentsubmit classroomcode={classroomcode} serialno={Assignment.serialno} token={token} currentuserid={currentuserid} />}
</div>
);
else
return <div></div>
}