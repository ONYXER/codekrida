import {Form} from "radix-ui";
import {TextField} from "@radix-ui/themes";

import {Cross2Icon} from "@radix-ui/react-icons";
import * as React from "react";
import {useState} from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";
import {FaLock} from "react-icons/fa";

export  default function PasswordInput(){
    const[showPassword,setShowPassword]=useState(false);
    const[showConfirmPassword,setShowConfirmPassword]=useState(false);
    return (
        <>
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
                        type={showPassword ? "text" : "password"}>
                        <TextField.Slot>
                            <FaLock size="20"/>
                        </TextField.Slot>
                        <TextField.Slot >

                            <div className="cursor-pointer" onClick={()=>setShowPassword(!showPassword)}>
                                {showPassword?<FiEye size="20"/>:<FiEyeOff size="20"/> }
                            </div>
                        </TextField.Slot>
                    </TextField.Root>


                </Form.Control>
            </Form.Field>

            <Form.Field name={"confirmPassword"} className="flex-col flex gap-3">
                <div className="flex justify-between ">
                    <Form.Label className=" font-semibold text-sm text-mauve ">Confirm Password</Form.Label>
                    <Form.Message match="valueMissing" className="text-[13px] text-red-500 opacity-80">
                        please confirm password
                    </Form.Message>
                    <Form.Message match={(value,form)=>value !== form.password}
                                  className="text-[13px] text-red-500 opacity-80">
                        password not match

                    </Form.Message>
                </div>
                <Form.Control asChild>

                    <TextField.Root
                        placeholder="ConfirmPassword"
                        size="3"
                        className={"relative"}
                        name="confirmPassword"
                        required
                        type={showConfirmPassword ? "text" : "password"}>
                        <TextField.Slot>
                            <FaLock size="20"/>
                        </TextField.Slot>
                        <TextField.Slot >

                            <div className="cursor-pointer" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword?<FiEye size="20"/>:<FiEyeOff size="20"/> }
                            </div>
                        </TextField.Slot>
                    </TextField.Root>


                </Form.Control>

            </Form.Field>
        </>
    )
}