import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Button from '@mui/material/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert from '@mui/material/Alert';
import {useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
import Meet from "./meet";
import axios from 'axios';
export default function LandingPage({token,currentuser,classroomcode}) {
    const [iscopy,setiscopy]=React.useState(false);
    const [status,setstatus]=React.useState(false);
    const [loading,setloading]=React.useState(false);
    const Navigate=useNavigate();
    React.useEffect(()=>{
if(!currentuser)
Navigate("/");
    },[])
  
    const copyelement=React.useRef();
    function handlejoin(){
      const code=  document.getElementById("outlined-basic").value;
      if(code!==""){
setstatus(true);
      }
    }
  
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
     //  setcode(result);
       return result;
    }
   async function handlecopy(){
    
    try {
      setloading(true);
      const res=await axios.post(`${process.env.REACT_APP_NODEJS_SERVER}/storemeetinf`,{
        code:copyelement.current.props.text
      },{
       headers:{
           Authorization:'Bearer '+token
         }
      });
      setloading(false);
      if(res.data!==[]  && res.data.msg==="ok"){
         setiscopy(true);
         setTimeout(() => {
           setiscopy(false);  
         }, 2000);  }
    } catch (error) {
     console.log(error);
     setloading(false); 
    } 
   }
 
  return (
      <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
              <StarHalfIcon />
          Crux
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  { !status && <div> <Card sx={{ minxWidth: 345, height:100}}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
           CRUX
          </Typography>
          <Typography variant="body2" color="text.secondary">
           A simple video conference platform
           <br />

          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <br />
    <CopyToClipboard text={makeid(8)} ref={copyelement}
         onCopy={handlecopy}>
               <Button variant="outlined" color="error" disabled={loading} >
       Click here to get a meeting code
      </Button>
          </CopyToClipboard>
          {iscopy && <Alert severity="success" style={{width:"200px"}}>copied to clipboard</Alert>}
          <br />
          <br />
          <br />
        <TextField id="outlined-basic" label="Enter meeting code to join" variant="outlined" style={{marginLeft:"30%"}} />
     <br />     <br />  <Button variant="outlined" style={{marginLeft:"36%"}} onClick={handlejoin}>JOIN</Button> </div>}
     {status && <Meet token={token} code={document.getElementById("outlined-basic").value} setstatus={setstatus} me={currentuser} classroomcode={classroomcode} />}
    </>
  );


}
