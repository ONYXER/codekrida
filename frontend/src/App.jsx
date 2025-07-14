import {useEffect, useState} from "react";
import Workspace from "./Workspace.jsx";
import Home from "./Home.jsx";
import LoadingAnime from "./components/LoadingAnime.jsx";
import axios from "axios";
export default  function App(){

    const[userDetails,setUserDetails]=useState({})

    const[animate,setAnimate]=useState(false)

    const[authenticated,setAuthenticated]=useState(true)

    useEffect(()=>{
        setAnimate(true);
        const duration = setTimeout(() =>setAnimate(false), 2000);

axios.get("http://localhost:8080/api/users",{

    withCredentials:true
})
    .then((response)=>response.data)
        .then((data)=>{
            setUserDetails(data);
        })
    .catch(()=>setAuthenticated(false))

return () => clearTimeout(duration)
           },[authenticated])




   return animate?<LoadingAnime/>:authenticated ? <Workspace userDetails={userDetails}/>:<Home onAuthenticate={()=>setAuthenticated(true)}/>
}

