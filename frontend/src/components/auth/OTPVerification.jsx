import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";
import {Button} from "@radix-ui/themes";
import * as React from "react";
import {useEffect, useState} from "react";

export default function OTPVerification({onResent}){
    const[minute,setMinute]=useState(0);
    const[second,setSecond]=useState(0);

    // useEffect hook
    useEffect(()=>{

            setSecond(0);
            setMinute(1);

    },[])

    useEffect(()=>{
        if(minute === 0 && second  === 0){
            return ;
        }

        const counter = setTimeout(()=>{
            if(second === 0){
                setMinute(minute-1);
                setSecond(59);
            }else{
                setSecond(second-1);
            }
        },1000)

        return ()=> clearTimeout(counter);


    },[minute, second])
    return (
        <>
            <label className={"text-center font-semibold"}>Enter OTP</label>
            <OneTimePasswordField.Root className="flex gap-4 flex-nowrap justify-center"
            name={"otp"}
            autoSubmit>

                {Array.from({ length: 6 }).map((_, i) => (
                    <OneTimePasswordField.Input
                        key={i}
                        required
                        className="box-border inline-flex h-[35px] w-6 appearance-auto items-center justify-center rounded bg-blackA2 p-0 text-[15px] leading-none text-black shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    />
                ))}
                <OneTimePasswordField.HiddenInput />
            </OneTimePasswordField.Root>

            <div className={"text-center my-3"}>  <Button variant={"surface"} size="1" onClick={onResent}
            disabled={!(minute === 0 && second === 0)} >  {!(minute=== 0 && second === 0) && <span>{minute}:{second} </span>}  Resent OTP</Button></div>
        </>
    )
}