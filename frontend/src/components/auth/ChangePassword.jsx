
import {Button, Dialog, Spinner, TextField} from "@radix-ui/themes";
import {Form} from "radix-ui";
import {AiFillMail} from "react-icons/ai";
import {FaLock} from "react-icons/fa";
import {FiEye, FiEyeOff} from "react-icons/fi";
import {Cross2Icon} from "@radix-ui/react-icons";
import * as React from "react";
import {useEffect, useState} from "react";
import PasswordInput from "./PasswordInput";
import OTPVerification from "./OTPVerification";
import Alert from "./Alert.jsx";
import axios from "axios";
import Console from "../Terminal.jsx";


export default function ChangePassword(){
    const[open,setOpen]=useState(true);
    const [iSEmailVerified,setIsEmailISVerified]=useState(false);
    const[isOTPSent,setIsOTPSent]=useState(false);
    const[loading,setLoading]=useState(false);
    const[takePassword,setTakePassword]=useState(false);
    const [form,setForm]=useState({});
    const[otpLoading,setOtpLoading]=useState(false);


    const[alert,setAlert] = useState({open:false,title:"",message:"",action:"", setValue:undefined});



    const verifyEmail = async (data)=>{

        setLoading(true);

        await axios.post("http://localhost:8080/api/auth/verifyEmail",data)
            .then((res)=>{
                 const resData = res.data;
                 console.log(resData);
                 if(resData.exist){
                     setIsEmailISVerified(true);
                     setTakePassword(true);
                 }else{
                     setAlert({open: true,title: "Email not Registered",
                         message: " Email is not registered \n Please provide a registered email ",action:"ok",doAction:undefined});
                 }
            })
            .catch((err)=>{
                     err.message;
                    setAlert({open: true,title: "Network Error",
                        message: "due to some Network problems server is not responding,\n Please try sometime later" , action:"Ok",doAction:()=>setOpen(false)})


            })
            .finally(()=>setLoading(false));

    }
    const changePasswordOTPRequest = async (data)=>{
        setTakePassword(false);
        setOtpLoading(true);
        await axios.post("http://localhost:8080/api/auth/changePasswordRequest",data)
            .then((res)=>{
                if(res.status === 200){

                    setIsOTPSent(true);
                }
            })


            .catch((err)=>{
                setTakePassword(true);
                setAlert({open: true,title: "Network Error",

                    message: "due to some "+err.response.data+" server is not responding,\n Please try sometime later" , action:"Ok",doAction:()=>setOpen(false)})

            })
            .finally(()=>setOtpLoading(false));
    }
    const changePasswordOTPVerification = async (data)=>{
        setLoading(true);
        await axios.post("http://localhost:8080/api/auth/changePassword",data)
            .then((res)=>{

                if(res.status === 200){
                    setIsEmailISVerified(false);
                    setIsOTPSent(false);
                    setAlert({open: true,title: "Done",
                        message: "Your password change Successfully,\n please Sign in your account " , action:"Sign in",doAction:()=>setOpen(false)})
                }
            })

    }
    return (
        <>
            <Alert props = {alert} setAlert={setAlert} />

        <Dialog.Root open={open} >


            <Dialog.Content maxWidth="450px">

                <h2 className="text-2xl font-bold text-center  mb-5 ">Code<span className="text-[var(--accent-9)]">Krida</span></h2>
                <Dialog.Title className={"text-2xl"}>
                    Change Password
                </Dialog.Title>
                <Dialog.Description className={"text-sm text-gray-600 "}>
                    please verify Email  first
                </Dialog.Description>

                <div className="mt-5">

                    <Form.Root className={"flex flex-col gap-3"} onSubmit={(e)=>{
                        e.preventDefault()
                        const data = Object.fromEntries(new FormData(e.target));
                        console.log(data)
                        if(takePassword){
                            setForm(data);
                            changePasswordOTPRequest(data).then(r => r);

                        }else if(isOTPSent && iSEmailVerified){
                            delete  data.confirmPassword;
                            changePasswordOTPVerification(data).then(r => r);
                        }else {
                            verifyEmail(data).then(r => r);
                        }
                    }}>
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
                                <TextField.Root placeholder="Enter your email" size="3" name="email" required type="email" readOnly={iSEmailVerified}>
                                    <TextField.Slot>
                                        <AiFillMail  size="20"/>
                                    </TextField.Slot>
                                </TextField.Root>
                            </Form.Control>

                        </Form.Field>
                        {takePassword && <PasswordInput/>}
                        {otpLoading && <div className={"flex justify-center my-3"}> <Spinner size="3" className="text-[var(--accent-9)]"/></div>}

                        {isOTPSent && <OTPVerification onResent ={(e)=>{
                            e.preventDefault();
                            setIsOTPSent(false)
                            console.log(form)
                           changePasswordOTPRequest(form).then(r => r);}} /> }




                        <Form.Submit asChild>
                            <Button variant="contained" color="primary" type="submit" className={"mt-2"}><Spinner loading={loading}/>{iSEmailVerified && !isOTPSent?"Send":"verify"}</Button>
                        </Form.Submit>



                    </Form.Root>



                </div>
                <Dialog.Close asChild>
                    <button
                        className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                        aria-label="Close"
                        onClick={()=>setOpen(false)}
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Root>
        </>)
}