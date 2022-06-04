import {storage} from "./firebase";
import {ref,uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import React, { useEffect, useState } from "react";
import CircularStatic from "./progressbar";
import {getAuth} from "firebase/auth";
import axios from "axios";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
export default function MediaCard({classroomcode,serialno,token,currentuserid}){
    const [myfile, setfile] = useState(null);
    const [prog,setprog]=useState(0);
    const [myurl,setmyurl]=useState();
    const [loading,setloading]=useState(false);
    const [isS,setS]=useState("");
  const claimstudent=async()=>{
      try{
        console.log("claim started");
     const res= await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/studentclaim`,{
            classcode:classroomcode,
            serialno:serialno
        },{
            headers:{
              Authorization:'Bearer '+token
            }
          }); 
          console.log("fetched");
          if(res.data.status==="success"){
            console.log("claim granted");
            getAuth().currentUser.getIdToken(true);
          }else
          console.log("unsuccess");
        }catch(err){
          console.log(err);
        }
       
    }
    useEffect(()=>{ 
      claimstudent();
    },[])
    const storemyurl=async ()=>{
    //  const token="djhbjdh"//get token 
try {
setS("");
setloading(true);
//console.log(myurl);
 const res= await  axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/storefileurl`,{
    classcode:classroomcode,
    serialno:serialno,
    link:myurl
  },{
    headers:{
      Authorization: 'Bearer '+token,
    }
  });
  if(res.data!==[]){
  setS("submitted successfully");
  }
  else{
  setS("submission failed!");
  }
  setloading(false);
} catch (error) {
  setS("submission failed!");
  setloading(false);
  console.log(error);
}
    }
    const fileUpload = (e) => {
        let file = e.target.files[0]; // get the supplied file
        // if there is a file, set image to that file
        if (file) {
          setfile(file);
          }
         else {
            setfile(null);
        }
      };
      const uploadToFirebase = () => {
        //1.
      //  console.log(myfile);
        if (myfile) {
          //2.
          //console.log(myfile);
          const storageRef = ref(storage,`${classroomcode}/${serialno}/${currentuserid}/${myfile.name}`);
          //3.
         const uploadTask=uploadBytesResumable(storageRef,myfile);
          //4.
        uploadTask.on("state_changed",(snapshot)=>{
          const progress=Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100);
          setprog(progress);
        },(err)=>{
          console.log(err);
        },()=>{
          getDownloadURL(uploadTask.snapshot.ref)
          .then(url=>{
           // console.log(url);
            setmyurl(url);
          });
        })
        } else {
          alert("Please upload an file first.");
        }
      };
    
  return(
<>

{isS!=="" && <Alert severity="success" style={{float: "left",marginTop: "-211px",marginLeft: "-64%"}}>{isS}</Alert>}
<input hidden  id="icon-button-file" onChange={fileUpload} type="file"/>
                        
                   { !myfile &&    <label htmlFor="icon-button-file" style={{
      backgroundColor: "#1976d2",
      border: "2px solid #1976d2",
      fontWeight: "bold",
      borderRadius: "5px",
      padding: "3px",
      color: "white",
      cursor:"pointer",
      marginLeft:"25%",
      display: "inline-block",
      transform:"translateY(10px)"
       }}>   
      select file
                    </label> }
                    
                    {  myfile && prog===0 &&  <Button onClick={uploadToFirebase} style={{marginLeft:"25%"}}>UPLOAD FILE</Button> }
              <div></div>      {prog!==0 && <CircularStatic value={prog} style={{ marginLeft:"25%"}} /> }
                    {prog===100 && isS==="" && <Button variant="contained"   disabled={loading} onClick={storemyurl} style={{marginTop:"5%",marginLeft:"25%"}} >
                      Submit
        </Button>}
</>
  );

}

