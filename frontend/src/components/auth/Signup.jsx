import * as React from "react";
import {Dialog, Spinner} from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import {Button, TextField} from "@radix-ui/themes";
import {Form} from "radix-ui";

import {AiFillMail} from "react-icons/ai";

import {FaUser} from "react-icons/fa";
import PasswordInput from "./PasswordInput.jsx";
import axios from "axios";
import { useState} from "react";
import Alert from "./Alert.jsx";
import OTPVerification from "./OTPVerification.jsx";


export default function SignUp({setSignup,setLogin,email}){

    const[isOTPSent,setIsOTPSent]=useState(false);
    const[loading,setLoading]=useState(false);
    const[takePassword,setTakePassword]=useState(true);
    const [form,setForm]=useState({});
    const[otpLoading,setOtpLoading]=useState(false);
    const[alert,setAlert] = useState({open:false,title:"",message:"",action:"", doAction:undefined});
    const registrationRequest = async (data) => {
        setTakePassword(false);
        setOtpLoading(true);
        await  axios.post("http://localhost:8080/api/auth/registrationRequest", data)
            .then(res => {
                if(res.status === 200){
                    setIsOTPSent(true);
                }
            })
            .catch(err => {
                  if(err.response === undefined){
                      setAlert({open: true,title: "Network Error!",
                          message: "due to some Network problems , registration is failed,\n Please try sometime later" , action:"Ok",doAction:()=>setSignup(false)})

                  }else{
                      setAlert({open: true,title: "Something went wrong!",
                          message: "due to some technical error server not responding ,\n Please try sometime later" , action:"Ok",doAction:()=>setSignup(false)})
                  }
            })
            .finally(()=>setOtpLoading(false))
    }

    const registrationOTPVerification = async (data)=>{
        setLoading(true);
        await axios.post("http://localhost:8080/api/auth/confirmRegistration",data)
            .then((res)=>{

                if(res.status === 200){


                    setAlert({open: true,title: "Done",
                        message: "Your password change Successfully,\n please Sign in your account " , action:"start workspace",doAction:()=>{
                        setLogin(true)
                         setOtpLoading(false);
                    }})

                }
            })
            .catch(err => {
                if(err.response === undefined){
                    setAlert({open: true,title: "Network Error!",
                        message: "due to some Network problems , registration is failed,\n Please try sometime later" , action:"Ok",doAction:()=>setSignup(false)})

                }else if(err.response.status === 400){
                    setAlert({open: true,title: "Invalid OTP",
                        message: "please enter a valid OTP sent at "+email, action:"Ok",setValue:undefined})
                }else if(err.response.status === 404){
                    setAlert({open: true,title: "session expired",
                        message: "your session is expired \n try again! ", action:"Ok",setValue:setSignup})
                }else{
                    setAlert({open: true,title: "Something went wrong!",
                        message: "due to some technical error server not responding ,\n Please try sometime later" , action:"Ok",doAction:()=>setSignup(false)})
                }

            })
            .finally(()=>setOtpLoading(false))

    }

    return(


        <Dialog.Root open>

            <Alert props = {alert} setAlert={setAlert} />
            <Dialog.Content maxWidth="450px">

                <h2 className="text-2xl font-bold text-center  mb-5 ">Code<span className="text-[var(--accent-9)]">Krida</span></h2>

                <Dialog.Title className={"text-2xl"}>
                    SignUp
                </Dialog.Title>
                <Dialog.Description className={"text-sm text-gray-600 "}>
                    please register  yourself first
                </Dialog.Description>

                <div className="mt-5">

                    <Form.Root className={"flex flex-col gap-3"} onSubmit={(e)=>{
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.target));
                        setForm(data);
                        if(isOTPSent) {
                            delete data.confirmPassword;
                            registrationOTPVerification(data).then(r => r)
                        }else{
                            registrationRequest(data).then(r => r)
                        }
                    }}>
                        <Form.Field name={"email"} className="flex-col flex gap-3" >
                            <div className={"flex justify-between  "}>
                                <Form.Label className=" font-semibold text-sm text-mauve ">
                                    Email
                                </Form.Label>

                            </div>
                            <Form.Control asChild>
                                <TextField.Root
                                    size="3"
                                    name="email"
                                    required
                                    type="email"
                                    readOnly
                                     value={email}>
                                    <TextField.Slot>
                                        <AiFillMail  size="20"/>
                                    </TextField.Slot>
                                </TextField.Root>
                            </Form.Control>

                        </Form.Field>
                        <Form.Field name={"email"} className="flex-col flex gap-3" >
                            <div className={"flex justify-between  "}>
                                <Form.Label className=" font-semibold text-sm text-mauve ">
                                    Name
                                </Form.Label>
                                <Form.Message match="valueMissing" className="text-[13px] text-red-500 opacity-80">
                                    please your name
                                </Form.Message>

                            </div>
                            <Form.Control asChild>
                                <TextField.Root
                                    placeholder="Shiva Yarana"
                                    size="3" name="name"
                                    required
                                    type="text"
                                readOnly={isOTPSent}>
                                    <TextField.Slot>
                                      <FaUser />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Form.Control>

                        </Form.Field>
                        {takePassword &&  <PasswordInput/>}
                        {otpLoading && <div className={"flex justify-center my-3"}> <Spinner size="3" className="text-[var(--accent-9)]"/></div>}
                        {isOTPSent && <OTPVerification onResent ={(e)=>{
                        e.preventDefault();
                         setIsOTPSent(false);
                         registrationRequest(form).then(r => r)
                        }
                        }/>}

                        <Form.Submit asChild>
                            <Button variant="contained" color="primary" type="submit" className={"mt-2"}> <Spinner loading={loading}/> {isOTPSent?"verify":"sign up"}</Button>
                        </Form.Submit>
                    </Form.Root>

                  <div className={"text-center mt-5"}>
              <Button variant="surface" size="1" onClick={()=>{
                  setLogin(true)
                  setSignup(false)
              }}>sign in</Button>
                  </div>

                </div>
                <Dialog.Close asChild>
                    <button
                        className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                        aria-label="Close"
                        onClick={()=>setSignup(false)}
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Root>



    );

}


