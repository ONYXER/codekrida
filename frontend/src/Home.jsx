import {Box, Button, TabNav, TextField} from "@radix-ui/themes";
import background from "./assets/backGround.png";
import Signup from "./components/auth/Signup.jsx";
import Editor from './assets/editor.png'
import explorer from "./assets/explorer.png"
import editor2 from "./assets/editor2.png"
import  terminal from"./assets/terninal.png"
import {FiMenu} from "react-icons/fi";
import { FaWindowClose} from "react-icons/fa";
import { useState} from "react";
import {AiFillYoutube,AiFillInstagram,AiFillFacebook,AiFillDiscord,AiFillMail} from "react-icons/ai";
import About from "./components/About";
import Login from "./components/auth/Login";
import {Form} from "radix-ui";
import axios from "axios";
import Alert from "./components/auth/Alert.jsx";




export default function Home({onAuthenticate}) {

    const[signup,setSignup]=useState(false);
    const [login,setLogin]=useState(false);
    const[email,setEmail]=useState("xyz@domain.com");
    const [smnav,setSmnav]=useState(false)
    const[alert,setAlert] = useState({open:false,title:"",message:"",action:"", setValue:undefined});

    const verifyEmail = async (data)=>{



        await axios.post("http://localhost:8080/api/auth/verifyEmail",data)
            .then((res)=>{
                const resData = res.data;
                console.log(resData);
                if(!resData.exist){

                   setEmail(data.email);
                   setSignup(true)

                }else{
                    setAlert({open: true,title: "Email already Registered",
                        message: " Email is not registered \n Please provide a registered email ",action:"ok",setValue:undefined});
                }
            })
            .catch((err)=>{
                err.message;
                setAlert({open: true,title: "Network Error",
                    message: "due to some Network problems server is not responding,\n Please try sometime later" , action:"Ok",setValue:undefined})


            })


    }

    return (
        <>

            <Alert props = {alert} setAlert={setAlert} />

            {signup &&  <Signup setSignup={setSignup} setLogin={setLogin} email={email}/>}
            <Login setLogin={setLogin} login={login}  onAuthenticate = {onAuthenticate} />
            <Box style={{
                backgroundImage: `url(${background})`,
                width: "100%",
                height: "100%",

            }}>

                <div className="fixed top-0 left-0 w-full bg-white">


                <div className=" flex justify-between sm:px-10 z-10 h-fit px-6 py-2 a shadow">
                    <h1 className="text-2xl font-bold "
                > Code<span className="text-[var(--accent-9)]">Krida</span>
                </h1>

                      <div className="sm:hidden " onClick={()=>setSmnav(!smnav)}>
                          {smnav?<FaWindowClose />:<FiMenu />}
                      </div>



     <div className="hidden sm:block">


         <TabNav.Root wrap="wrap" className={"items-center"} >
             <TabNav.Link href="#home" active >Home</TabNav.Link>
             <TabNav.Link href="#features" >Features</TabNav.Link>
             <TabNav.Link href="#contact">Contact</TabNav.Link>
             <TabNav.Link href="#about">About</TabNav.Link>
             <Button variant="surface" size="1" onClick={()=>{

                 setLogin(true)}}>Sign in</Button>


         </TabNav.Root>

     </div>

                </div>
                    <div className="sm:hidden">

                        {smnav &&  <TabNav.Root size="1">
                            <TabNav.Link href="#home" active >Home</TabNav.Link>
                            <TabNav.Link href="#features">Features</TabNav.Link>
                            <TabNav.Link href="#contact">Contact</TabNav.Link>
                            <TabNav.Link href="#about">About</TabNav.Link>
                            <Button variant="surface" size="1" onClick={()=>setLogin(true)}>Sign in</Button>

                        </TabNav.Root>}
                    </div>
                </div>

                <div className="flex flex-col items-center sm:pt-10 border-b "  id={"home"}>

                    <div className={"flex flex-col sm:flex-row mt-10 items-center sm:gap-2" }> <h1 className={"text-4xl font-bold border-b-1 sm:border-r-1 sm:border-b-0 pr-2  "}>Code<span className="text-[var(--accent-9)]">Krida</span></h1>

                        <h2 className={" text-xl sm:text-3xl"}>Play<span className="text-[var(--accent-9)] ">With</span>Code</h2></div>

                        <div>
                            <h3 className=" text-sm sm:text-xl text-center px-4">
                                Your Cloud Based Coding Workspace - Powerful, Portable, and Personal
                            </h3>

                        </div>
                    <div className="flex justify-center mt-3 w-full ">

                           <Form.Root className={"flex p-1.5 gap-2 w-[70%] sm:bg-white flex-col sm:flex-row sm:w-[600px] items-center rounded-lg"} onSubmit={(e)=>{
                               e.preventDefault();
                               const data = Object.fromEntries(new FormData(e.target));

                               verifyEmail(data).then(r => r);
                               e.target.reset();

                           }}>
                               <Form.Field name={"email"} className={"flex-1 w-full  "}  >
                                   <Form.Control asChild  >

                                       <TextField.Root type={"email"} placeholder={"you@domain.com"} size="3" className={"w-full p-1 text-xs sm:text-xl"} required onInvalid={()=>{
                                           setAlert({open: true,title: "invalid email",
                                               message: "Please Enter a valid email" , action:"Ok",setValue:undefined,messageType: "bad"})
                                       }}/>
                                   </Form.Control>
                               </Form.Field>

                               <Form.Submit asChild className={"flex-none"}>
                                   <Button size="3" className={" w-full flex-none"}>Sign up for codekrida</Button>
                               </Form.Submit>
                           </Form.Root>
                    </div>

                 <div className=" max-w-[90%] sm:max-w-[70%] my-8">
                     <img src={Editor} alt={"editor"} width="100%" height="100%"/>
                 </div>

                </div>

            {/*Features*/}
            <div className=" border-b pb-10" id="features">


                <h2 className="text-4xl text-[var(--accent-9)] font-bold text-center my-10 " >Features</h2>

                <div className="flex gap-10 flex-col">

                    <div  className=" flex flex-col items-center md:flex-row  justify-center md:gap-28 gap-4  px-10">
                        <img src={explorer} alt={"explorer"} className="sm:w-[400px] w-[70%]"/>
                       <div className=" flex  flex-col justify-center gap-2">
                           <h4 className={"text-[var(--accent-9)] font-bold text-xl text-center "}>File Explore</h4>
                           <p className={" max-w-[500px]  text-center "}>
                               A Advance file explore supports many features use is able to create new files , new folders,
                               rename existing file or folder and even though it also enables to  download files and folder which can be ran anywhere,

                           </p>
                       </div>

                    </div>
                    <div  className=" flex flex-col items-center md:flex-row-reverse justify-center md:gap-28 gap-4   px-10">
                        <img src={editor2} alt={"editor2"} className="sm:w-[400px] w-[70%]" />

                        <div className=" flex  flex-col justify-center gap-2">
                            <h4 className={"text-[var(--accent-9)] font-bold text-xl text-center "}>Code Editor</h4>
                            <p className={" max-w-[500px]  text-center "}>
                                A user-friendly interactive monaco code editor that supports various programming languages and also has dark mode and light mode.
                            </p>
                        </div>
                    </div>
                    <div className=" flex flex-col items-center md:flex-row  justify-center md:gap-28 gap-4  px-10">
                        <img src={terminal} alt={"terminal"} className="sm:w-[400px] w-[70%]"/>

                        <div className=" flex  flex-col justify-center gap-2">
                            <h4 className={"text-[var(--accent-9)] font-bold text-xl text-center "}>Terminal</h4>
                            <p className={" max-w-[500px]  text-center "}>
                                A ubuntu based Bash terminal to perform console operations and enable to create directories , run code and to download extra
                                features like another programming languages and access ClI.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


           <div id={"contact"}>
               <h2 className="text-4xl text-[var(--accent-9)] font-bold text-center my-10 " >Contact</h2>
              <div className=" flex  justify-center mb-10">
                  <ul className="text-sm  sm:text-xl gap-2  px-10">
                      <li className={"flex items-center justify-center gap-5"}><AiFillMail size="30" className="fill-amber-600"/> <a href="mailto:codekrida@gmail.com">codekrida@gmail.com</a> </li>
                      <li><a href="https://www.facebook.com " target="_blank" className={"flex items-center gap-5 "}><AiFillFacebook  className="fill-blue-600" size="30"/> FaceBook</a></li>
                      <li><a href="https://www.discord.com"  target="_blank" className={"flex items-center gap-5"}><AiFillDiscord className="fill-indigo-500" size="30"/> Discord</a></li>
                      <li><a href="https://www.discord.com"  target="_blank"  className={"flex items-center gap-5"}><AiFillInstagram className="fill-pink-600" size="30"/> Instagram</a></li>
                      <li><a href="https://www.discord.com"  target="_blank"  className={"flex items-center gap-5"}><AiFillYoutube className="fill-red-600" size="30"/> Youtube</a></li>

                  </ul>
              </div>

           </div>
               <div id={"about"}>
                   {/*about*/}
                   <About/>
               </div>

                <footer className="text-center bg-white">
                 &copy; 2025 Yarana Group   All rights reserved
                </footer>

            </Box>

        </>
    )
}