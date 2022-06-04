import { useState,useEffect } from "react";
import axios from "axios";
import {storage} from "./firebase";
import CircularStatic from "./progressbar";
import claimAdmin from "./claimAdmin";
import Button from '@mui/material/Button';
import '../Style/global.css';
import {ref,uploadBytesResumable, getDownloadURL} from 'firebase/storage';
export default function Newassignment({classroomcode,token,setstatus,setassignment}){
    const [myfile, setmyfile] = useState(null);
    const [myurl,seturl]=useState("");
    const [prog,setprog]=useState(0);
    const [assignmentcode,setassignmentcode]=useState("");
    const [loading,setloading]=useState(false);
   
  /*async function claimAdmin(){
      try{
        console.log("claim started");
     const res= await axios.post('http://localhost:4000/adminclaim',{
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
          }else
          console.log("unsuccess");
        }catch(err){
          console.log(err);
        }
       
    } */
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
   charactersLength));
     }
     setassignmentcode(result);
     //return result;
  }
  useEffect(()=>{
    makeid(4);
  },[]);
    useEffect(()=>{
      claimAdmin(classroomcode,assignmentcode,token);
    },[assignmentcode,classroomcode,token])
   const CreateNew= async()=>{
       const Heading= document.getElementById("heading").value ;
       const Description=document.getElementById("descrip").value;
       if(Heading==="" || Description==="")
       {
           alert("field cannot be blank");
           return;
       }
        try {
          setloading(true);
         //   const token="sljhdkhd"//get token
            const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/newassignment`,{
                classcode:classroomcode,
                heading: Heading ,
                serialno: assignmentcode,
                lastdate: document.getElementById("lastdate").value,
                description: Description ,
                filelink: myurl
            },{
                headers:{
                  Authorization:'Bearer '+token
                }
              }); 
            //  setmyfile(res.data);  
            setloading(false);
            if(res.data!==[]){
setassignment(prevarr=>[...prevarr,res.data]);
            setstatus(false); 
            }else
            console.log("no"); 
           
        } catch (error) {
          console.log(error); 
          setloading(false); 
        }
    }
const fileUpload = (e) => {
    let file = e.target.files[0]; // get the supplied file
    // if there is a file, set image to that file
    if (file) {
      setmyfile(file);
      }
     else {
        setmyfile(null);
    }
  };
  const uploadToFirebase = () => {
   
    //1.
  //  console.log(myfile);
    if (myfile) {
      //2.
      //console.log(myfile);
    //  const storageRef = ref(storage,`files/${myfile.name}`);  classroomcode
   
    const storageRef = ref(storage,`${classroomcode}/${assignmentcode}/assignment/${myfile.name}`);
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
      .then(url=>seturl(url));
    })
    } else {
      alert("Please upload an file first.");
    }
  };
return(
   <div  className="createassignment">
     <div style={{ boxShadow: "rgb(143 136 139) -3px 0px 7px 0px",marginRight:"30%", marginBottom:"5%" }}>
       <div style={{fontFamily:"Lucida Sans", paddingTop:"5%"}}>Enter heading<input type="text" id="heading" style={{borderRadius:"10px",marginLeft:"5%"}}/></div>
       <div style={{fontFamily:"Lucida Sans", paddingTop:"5%"}}> <p>Enter description</p>
       <textarea name="Text1" cols="40" rows="5" id="descrip" style={{borderRadius:"10px",marginLeft:"20%",marginTop:"-12%"}}></textarea>
      </div>
       <div style={{fontFamily:"Lucida Sans", paddingTop:"5%",paddingBottom:"2%"}}>Enter last date <input  type="datetime-local" id="lastdate" style={{borderRadius:"10px",marginLeft:"5%"}} /></div>
       </div>
       <>
<input hidden  id="icon-button-file" onChange={fileUpload} type="file"/>
     {   !myfile  &&        <label htmlFor="icon-button-file" style={{
      backgroundColor: "#1976d2",
      border: "2px solid #1976d2",
      fontWeight: "bold",
      borderRadius: "5px",
      padding: "3px",
      color: "white",
      cursor:"pointer"
       }}>   
      select file
                    </label> }
               {  myfile &&  <Button onClick={uploadToFirebase}>UPLOAD FILE</Button> }
              {prog!==0 && <CircularStatic value={prog} /> }
</>
<div></div>
{prog===100 && <Button variant="contained"   disabled={loading} onClick={CreateNew} style={{marginTop:"5%"}} >
Create assignment
        </Button>}
   </div>
)
}