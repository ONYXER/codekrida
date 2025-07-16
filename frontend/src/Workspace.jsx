import {Box, Button} from '@radix-ui/themes'
import {FaPlay, FaTerminal, FaWindowMaximize,FaWindowMinimize,FaWindowClose, FaFolder, FaFolderOpen,FaMinus} from "react-icons/fa";
import {Panel,PanelGroup,PanelResizeHandle} from "react-resizable-panels";
import UserProfile from "./components/UserProfile";
import {FileExplorer} from "./components/FileExplorer.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import {useRef, useState} from "react";
import {getCommand} from "./assets/languagemapper.js";
import Terminal from "./components/Terminal.jsx";


function App({userDetails}) {
    const [openTerminal, setOpenTerminal] = useState(false);
    const[explorerIsOpen,setExplorerIsOpen] = useState(true);
    const termRef = useRef(null);
    const explorerRef = useRef(null);
    const [selectedFile,setSelectedFile] = useState(null);
    const [runCommand, setRunCommand] = useState("");


  return (
    <>

  {/*    TOPBAR*/}
 <div className={"w-screen! h-screen! overflow-hidden!"}>



     <Box className="flex z-10 h-fit flex-none px-6 py-2 shadow-[0px_0px_5px_black]"> <h1 className="text-2xl font-bold "> Code<span className="text-[var(--accent-9)]">Krida</span>
     </h1>
     </Box>


     <div className="flex  w-full h-full">

         {/*  SIDE BAR*/}
         <aside className={`w-fit h-full flex gap-2 flex-col py-2 px-2 border-r-2 z-0 flex-none `}>
             <UserProfile userDetails={userDetails}/>
             <Button variant={"solid"} onClick={()=>{setExplorerIsOpen(!explorerIsOpen)
                       if(explorerIsOpen) explorerRef.current.resize(0);
                       else explorerRef.current.resize(20);
             }}>{explorerIsOpen?<FaFolderOpen/>:<FaFolder/>}</Button>
             <Button variant={"solid"} onClick={(e)=>{
                 e.preventDefault();
                 setOpenTerminal(true);
                setRunCommand(getCommand(selectedFile));

             }}><FaPlay/></Button>
             <Button variant={"solid"} onClick={()=>setOpenTerminal(!openTerminal)}><FaTerminal/></Button>

         </aside>

         <Box className={" h-full w-full overflow-hidden"}>
             <PanelGroup autoSaveId={"persistence"} direction={"horizontal"} >
                 <Panel  defaultSize={20} minSize={0} ref={explorerRef}>
                   <div className="w-full h-full overflow-y-scroll overflow-x-hidden">
                       <FileExplorer setSelectedFile={setSelectedFile} containerName = {userDetails.containerName} selectedFile={selectedFile}/>
                   </div>
                 </Panel>

                 <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-gray-500"/>

                 <Panel defaultSize={80} >
                    <div className="w-full h-full overflow-hidden">
                        <PanelGroup direction={"vertical"} >

                            <Panel defaultSize={70}>
                                <CodeEditor  file={selectedFile} containerName = {userDetails.containerName}/>
                            </Panel>

                            <PanelResizeHandle className="h-1 bg-gray-600 hover:bg-gray-500 "/>

                            {openTerminal &&  <Panel defaultSize={30} minSize={0} ref={termRef}>
                                <div className={"bg-[#343434] p-2 font-bold flex items-center justify-between text-gray-300 relative"}>
                                    <h3>Terminal</h3>
                                <div>
                                   <ul className={"flex items-center gap-4"}>
                                       <li onClick={()=>{
                                           termRef.current.resize(6)
                                       }} className={"cursor-pointer"}>
                                           <FaMinus/>
                                       </li>
                                       <li onClick={()=>{
                                           termRef.current.resize(100)
                                       }} className={"cursor-pointer"}>
                                           <FaWindowMaximize/>
                                       </li>
                                       <li onClick={()=>setOpenTerminal(false)} className={"cursor-pointer"}>
                                           <FaWindowClose/>
                                       </li>
                                   </ul>
                                </div>
                                </div>
                                <Terminal runCommand = {runCommand} setRunCommand={setRunCommand}/>

                            </Panel>
                            }
                        </PanelGroup>
                    </div>
                 </Panel>
             </PanelGroup>
         </Box>

     </div>
 </div>





    </>
  )
}

export default App
