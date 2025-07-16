import {Button, ContextMenu, Dialog, Spinner, TextField} from "@radix-ui/themes";
import {Form} from "radix-ui";
import {AiFillMail} from "react-icons/ai";
import {FaFile} from "react-icons/fa";
import {Cross2Icon} from "@radix-ui/react-icons";
import * as React from "react";
import axios from "axios";



export default function CreateFile({node,setOpenCreateFile,containerName,setFolderUpdated,openCreateFile}) {

   const [loading, setLoading] = React.useState(false);

    const createFile = async  (e)=>{
        e.preventDefault();
        setLoading(true);

        const fileName = Object.fromEntries(new FormData(e.target)).fileName;
        const data = {containerName:containerName,path:node.path+"/"+fileName};
        console.log(data)

            axios.post("http://localhost:8080/api/file/createFile",data,{
                withCredentials: true,
           })
                .then(response => {
                    if(response.status === 200){
                        setFolderUpdated(prev=>prev+1);
                        alert("Successfully created!");
                        setOpenCreateFile(false);

                    }
                })
                .catch(() => {
                    alert("failed to create file");
                })
                .finally(() => {setLoading(false);});


    }
    return (

        <Dialog.Root open = {openCreateFile}>

            <Dialog.Content maxWidth="450px">

                <h2 className="text-2xl font-bold text-center  mb-5 ">Code<span className="text-[var(--accent-9)]">Krida</span></h2>
                <Dialog.Title className={"text-2xl"}>
                    New File
                </Dialog.Title>

                <div className="mt-5">

                    <Form.Root className={"flex flex-col gap-3"} onSubmit={createFile}>
                        <Form.Field name={"fileName"} className="flex-col flex gap-3">
                            <div className={"flex justify-between  "}>
                                <Form.Label className=" font-semibold text-sm text-mauve ">
                                    Name
                                </Form.Label>
                                <Form.Message match="valueMissing" className="text-[13px] text-red-500 opacity-80">
                                    please enter a file name
                                </Form.Message>
                                <Form.Message className="text-[13px] text-red-500 opacity-80" match="patternMismatch">
                                    invalid file Name
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <TextField.Root placeholder="Enter a file name" size="3" name="fileName" required type="text" pattern={`^[a-zA-Z0-9_]+.[A-Za-z]{1,5}`}>
                                    <TextField.Slot>
                                        <FaFile size="20"/>
                                    </TextField.Slot>
                                </TextField.Root>
                            </Form.Control>
                        </Form.Field>


                        <Form.Submit asChild>
                            <Button variant="contained" color="primary" type="submit" className={"mt-2"}> <Spinner loading={loading}/>create</Button>
                        </Form.Submit>



                    </Form.Root>


                </div>

                <Dialog.Close asChild>
                    <button
                        className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                        aria-label="Close"
                        onClick={() => {setOpenCreateFile(false)}}
>
                        <Cross2Icon />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Root>
    )
}


