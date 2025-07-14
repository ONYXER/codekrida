import { useState} from "react";
import axios from "axios";
import {Form} from "radix-ui"
import {Button, Link, Spinner, TextField} from "@radix-ui/themes";
import {AiFillMail} from "react-icons/ai";
import {FaLock, FaEye, FaEyeSlash, FaArrowRight} from "react-icons/fa";
import {FiEye,FiEyeOff} from "react-icons/fi";
import {Dialog} from '@radix-ui/themes'
import * as React from "react";
import {Cross2Icon} from "@radix-ui/react-icons";
import ChangePassword from "./ChangePassword.jsx";
import Alert from "./Alert.jsx";




export default function Login({setLogin,login,onAuthenticate}) {
    const[visible,setVisible]=useState(true);
    const[isPasswordCorrect,setIsPasswordCorrect]=useState(true);
    const[loading,setLoading]=useState(false);
    const[alert,setAlert] = useState({open:false,title:"",message:"",action:"", doAction:undefined});

    
    const handleLogin =  async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = Object.fromEntries(new FormData(e.target));

          await axios.post("http://localhost:8080/api/auth/login", data,{
              withCredentials:true
          })
              .then(res=>{
                  if(res.status === 200){
                      console.log(document.cookie)
                     onAuthenticate()
                  }
              })
              .catch(err=>{
                  if(err.response === undefined){
                      setAlert({open: true,title: "Network Error",
                          message: "due to some Network problems server is not responding,\n Please try sometime later" , action:"Ok",doAction:()=>setLogin(false)});
                      return;
                  }

                  const data = err.response.data;
                  if(data === "email"){
                      setAlert({open: true,title: "Email not Found",
                            message: " Email is not registered \n Please register yourself to access codekrida's workspace ",action:"Sign up",doAction:()=>setLogin(false)})
                  }else if (data === "password"){
                      setAlert({open: true,title: "Invalid Password",
                            message: "your password is not correct,\n Please enter a valid password to authenticate ", action:"Change Password",doAction:()=>setIsPasswordCorrect(false)})
                  }else{
                      setAlert({open: true,title: "Authentication Failed",
                          message: "due to some technical problem your authentication is failed,\n Please try sometime later" , action:"Ok",doAction:()=>setLogin(false)})
                  }
              })
              .finally(()=>setLoading(false));
    }

    return (
        <>

             <Alert props = {alert} setAlert={setAlert}/>
            {!isPasswordCorrect && <ChangePassword/>}


            <Dialog.Root open={login}  >


                <Dialog.Content maxWidth="450px">

                        <h2 className="text-2xl font-bold text-center  mb-5 ">Code<span className="text-[var(--accent-9)]">Krida</span></h2>
                        <Dialog.Title className={"text-2xl"}>
                            Sign In
                        </Dialog.Title>
                        <Dialog.Description className={"text-sm text-gray-600 "}>
                            please authenticate yourself first
                        </Dialog.Description>

                    <div className="mt-5">

                        <Form.Root className={"flex flex-col gap-3"} onSubmit={handleLogin}>
                            <Form.Field name={"email"} className="flex-col flex gap-3">
                                <div className={"flex justify-between  "}>
                                    <Form.Label className=" font-semibold text-sm text-mauve ">
                                        Email
                                    </Form.Label>
                                    <Form.Message match="valueMissing" className="text-[13px] text-red-500 opacity-80">
                                        please enter a email
                                    </Form.Message>
                                    <Form.Message className="text-[13px] text-red-500 opacity-80" match="typeMismatch">
                                        please enter a valid email
                                    </Form.Message>
                                </div>
                                <Form.Control asChild>
                                    <TextField.Root placeholder="Enter your email" size="3" name="email" required type="email">
                                        <TextField.Slot>
                                            <AiFillMail  size="20"/>
                                        </TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>

                            </Form.Field>
                            <Form.Field name={"password"} className="flex-col flex gap-3">
                                <div className="flex justify-between ">
                                    <Form.Label className=" font-semibold text-sm text-mauve ">Password</Form.Label>
                                    <Form.Message match="valueMissing" className="text-[13px] text-red-500 opacity-80">
                                        please enter password
                                    </Form.Message>
                                </div>
                                <Form.Control asChild>

                                    <TextField.Root
                                        placeholder="Enter your password"
                                        size="3"
                                        className={"relative"}
                                        name="password"
                                        required
                                        type={visible ? "text" : "password"}>
                                        <TextField.Slot>
                                            <FaLock size="20"/>
                                        </TextField.Slot>
                                        <TextField.Slot >

                                            <div className="cursor-pointer" onClick={()=>setVisible(!visible)}>
                                                {visible?<FiEye size="20"/>:<FiEyeOff size="20"/> }
                                            </div>
                                        </TextField.Slot>
                                    </TextField.Root>


                                </Form.Control>

                            </Form.Field>

                            <Form.Submit asChild>
                                <Button variant="contained" color="primary" type="submit" className={"mt-2"}> <Spinner loading={loading}/> Login</Button>
                            </Form.Submit>


                            <Dialog.Close asChild>
                                <button
                                    className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                                    aria-label="Close"
                                    onClick={()=>setLogin(false)}
                                >
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                        </Form.Root>


                    </div>


                </Dialog.Content>
            </Dialog.Root>






        </>
    )
}