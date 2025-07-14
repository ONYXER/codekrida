import {AlertDialog, Button, Flex} from "@radix-ui/themes";

import * as React from "react";

export default function Alert({props,setAlert}) {

    return (
        <AlertDialog.Root open={props.open} >

            <AlertDialog.Content maxWidth="450px">
                <h2 className="text-2xl font-bold text-center  mb-5 ">Code<span className="text-[var(--accent-9)]">Krida</span></h2>
                <AlertDialog.Title>{props.title}</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {props.message}
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" onClick={()=>setAlert({open:false,title:"",message:"",action:"", doAction:undefined})}>Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action >
                        <Button variant="solid"  onClick={()=>{
                            setAlert({open:false,title:"",message:"",action:"", setValue:undefined})
                            if(typeof props.doAction !== "undefined"){
                                props.doAction()
                            }

                        }}>
                            {props.action}
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>

    )
}