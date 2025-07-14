import {useEffect, useState} from "react";
import {FaFolder, FaFolderOpen} from "react-icons/fa";
import {ContextMenu} from "@radix-ui/themes";

import getFileIcon from "../assets/FileIcons.jsx";
import {v4 as uuid4} from "uuid";
import axios from "axios";
import CreateFile from "./CreateFile.jsx";
import {AlertDialog} from "@radix-ui/themes";


const  intialTree = [
     {
     path:".",
     name:"workspace",
     type:"folder",
     children: []

     }
]



function  FileNode({node,setSelectedFile,containerName,selectedFile}) {
    const [expanded, setExpanded] = useState(false);
    const [children,setChildren] = useState(null);
    const[openCreateFile,setOpenCreateFile]=useState(false);


    useEffect(()=>{

        if(!expanded || node.type!=="folder"){
            return ;
        }
        console.log(node);
        axios.get(`http://localhost:8080/api/file/fileStructure?path=${node.path}`,{
            withCredentials: true
        })
            .then(res => {
                if(res.status === 200 && res.data != null){
                    setChildren(res.data);

                }
            })
            .catch(err => console.log(err));
    },[expanded, node]);



    return(
     <>

         {openCreateFile && <CreateFile node={node} setOpenCreateFile={setOpenCreateFile} containerName={containerName}/>}
         <div className={"pl-1"}>




          <ContextMenu.Root>
               <ContextMenu.Trigger asChild>
                  <div className= {`cursor-pointer text-white  text-sm rounded p-1 flex items-center gap-2 ${selectedFile === node?"bg-[var(--accent-9))]":"hover:bg-black"}`}
                  onClick={()=>{

                      if(node.type === "folder"){
                          setExpanded(!expanded);
                      }else{

                          setSelectedFile(node);}

                  }}>
                      {node.type ==="folder"?expanded?<FaFolderOpen/>:<FaFolder/>:getFileIcon(node.name)}{node.name}
                  </div>
               </ContextMenu.Trigger>
              <ContextMenu.Content>
                  {node.type==="folder"&&    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger>New</ContextMenu.SubTrigger>
                      <ContextMenu.SubContent>

                          <ContextMenu.Item onSelect={()=>setOpenCreateFile(true) } shortcut={"⌘ N"}>File</ContextMenu.Item>

                          <ContextMenu.Item shortcut="⌘ F" onSelect={()=>{
                              // setAction(node,"newFolder")
                              setExpanded(false);
                          }}>Folder</ContextMenu.Item>

                      </ContextMenu.SubContent>
                  </ContextMenu.Sub>}
                  <ContextMenu.Item shortcut="⌘ E" onSelect={()=>{
                      // setAction(node,"rename")
                      setExpanded(false);
                  }}>Rename</ContextMenu.Item>


                  <ContextMenu.Separator />
                  <ContextMenu.Item shortcut="⌘ ⌫" color="red" onSelect={()=>{
                      // setAction(node,"delete")
                      setExpanded(false);
                  }}>Delete

                  </ContextMenu.Item>
              </ContextMenu.Content>
           </ContextMenu.Root>
         </div>
         {expanded && children && (
             <div className="pl-4">
                 {children.filter(child=>child.path ===node.path+"/"+child.name).map((child) => (
                     <FileNode node={child} key={child.path}  containerName={containerName} setSelectedFile={setSelectedFile} selectedFile={selectedFile}/>))}

             </div>
         )}
     </>
 )
}




export function FileExplorer({setSelectedFile,containerName,selectedFile}) {
const [createFile,setCreateFile]=useState(false);
const [node,setNode]=useState(null);


    const handleAction = (node,action) => {

        if (action === "newFile") {
              setCreateFile(true);
              setNode(node);
        } else if (action === "newFolder") {
            node.children.push({id: uuid4(), name: prompt("enter a name:"), type: "folder", children: []})
        } else if (action === "rename") {
            node.name = prompt("enter a name");
        }

    }
    return (
        <>


            <div className={"p-4 bg-[#343434]  rounded   h-full w-full overflow-hidden  "}>
                <h3 className={"text-white text-sm mb-2"}>Explore</h3>
                {
                    intialTree.map((node) => (
                        <FileNode key={node.path} node={node}  setSelectedFile={setSelectedFile} containerName={containerName} selectedFile={selectedFile}/>
                    )).filter(Boolean)
                }
            </div>
        </>
    )
}

