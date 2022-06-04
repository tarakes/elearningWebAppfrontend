import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import {getAuth} from "firebase/auth";
//import claimAdmin from './claimAdmin';
import {useEffect,useState} from 'react';
import axios from 'axios';
import moment from 'moment';
function createData(name, status,link) {
  return { name, status,link};
}
//if status==="" then status="not submitted"
//rows should be fetched from database

export default function BasicTable({classroomcode,serialno,token}) {
  const [rows,setrows]=useState([]);
  const [loading,setloading]=useState(false);
  useEffect(()=>{
    const fetchclass=async()=>{
   //   const token="dkhkhydf54f3f36f3"//collect firebase token
      try {
        setloading(true);
        const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/viewallassignment`,{
          serialno:serialno,
          classroomcode:classroomcode
        },{
          headers:{
            Authorization: 'Bearer '+token
          }
        });
        if(res.data!==[]){
          getAuth().currentUser.getIdToken(true);
       setrows(res.data.map((el)=>createData(el.name,el.status,el.filelink)))
        }
        // setrows((prevarr)=>[...prevarr,createData(res.data.name,res.data.status,res.data.filelink)]);
        setloading(false);
      } catch (error) {
       console.log(error);
       setloading(false); 
      }
    }
    fetchclass();
  },[serialno,token,classroomcode])

  /*useEffect(()=>{
    claimAdmin(classroomcode,serialno,token)
  },[classroomcode,serialno,token]) */
  if(!loading)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><h3>Student name</h3></TableCell>
            <TableCell align="right"><h3>Submission</h3></TableCell>
            <TableCell align="right"><h3>file</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
             
        { row.status!=="Not submitted"?<TableCell align="right">{  moment(row.status).format('LLLL') }</TableCell>:<TableCell align="right">{row.status}</TableCell>}
      
              <TableCell align="right">
          {row.link!=="" &&   <Link href={row.link} target="_blank" rel="noreferrer">View</Link> }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  else
  return ("loading.....");
}
