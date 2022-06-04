//import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAuth, signInWithRedirect,GoogleAuthProvider,onAuthStateChanged,getRedirectResult } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import { useEffect,useState} from "react";
import '../Style/global.css';
import GoogleIcon from '@mui/icons-material/Google';
//import { useEffect,useState } from "react";
import './firebase';
export default function Login(){
 // const [mytoken,settoken]=useState(0);
  const Navigate=useNavigate();
 // const user=getAuth().currentUser;
const [loading,setloading]=useState(false);
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
      //  console.log("yes");
        Navigate("/class");
      } 
    });
  },[Navigate])

   /*useEffect(() => {
     if(user)
     Navigate("/admin");
      }, [Navigate,user]); */
    function loginwithgoogle(){
      setloading(true);
      const provider = new GoogleAuthProvider();
       // const auth = getAuth();
       /* signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            //const credential = GoogleAuthProvider.credentialFromResult(result);
           // const idToken = credential.accessToken;
            // The signed-in user info.
          //  const user = result.user;
            // ...
            //console.log(credential);
            //console.log(result);
           // const idToken=credential.idToken;
           // console.log(user.displayName);
            //console.log(user.uid);
         //   settoken(token);
           // console.log(token);
          // Navigate('/admin',{state:{user}});
          setloading(false);
       Navigate('/admin');
          }).catch((error) => {
            setloading(false);
            // Handle Errors here.
          //  const errorCode = error.code;
            //const errorMessage = error.message;
            // The email of the user's account used.
            //const email = error.email;
            // The AuthCredential type that was used.
            //const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(error);
          });  */
          const auth = getAuth();
          signInWithRedirect(auth, provider);
        getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
   // const credential = GoogleAuthProvider.credentialFromResult(result);
    //const token = credential.accessToken;
    setloading(false);
    Navigate('/class');
  }).catch((error) => {
    setloading(false);
    console.log(error);
  })   
        }
    return (
<div   className="loginbutton">
<Button variant="outlined" startIcon={<GoogleIcon />} onClick={loginwithgoogle} disabled={loading}>
LogIn with google
</Button>
</div>
    );
}