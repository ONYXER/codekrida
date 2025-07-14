
import '@xterm/xterm/css/xterm.css'
import {Terminal} from "@xterm/xterm";
import {FitAddon} from "xterm-addon-fit/src/FitAddon.js";
import {useEffect, useRef, useState} from "react";




 export  default function Console({runCommand,setRunCommand}) {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const fitAddon  = useRef(null);
    const socket = useRef(null);
    const containerRef = useRef(null);
    const [isConnectionIstablised, setIsConnectionIstablished] = useState(false);

    useEffect(() => {
        // initialize terminal
        term.current = new Terminal({
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
                cursor: '#00ff00',
                selection: '#6666ff77',
                black: '#000000',
                red: '#cd3131',
                green: '#0dbc79',
                yellow: '#e5e510',
                blue: '#2472c8',
                magenta: '#bc3fbc',
                cyan: '#11a8cd',
                white: '#e5e5e5',
                brightBlack: '#666666',
                brightRed: '#f14c4c',
                brightGreen: '#23d18b',
                brightYellow: '#f5f543',
                brightBlue: '#3b8eea',
                brightMagenta: '#d670d6',
                brightCyan: '#29b8db',
                brightWhite: '#e5e5e5',
            },
            fontSize: 14,
            fontFamily: 'monospace',
            cursorBlink: true,
            scrollOnUserInput: true,



        })
        fitAddon.current = new FitAddon();
        term.current.loadAddon(fitAddon.current);
        term.current.open(terminalRef.current);
        fitAddon.current.fit();

        //     connect to webSocket
        socket.current = new WebSocket("ws://localhost:8080/ws/terminal");

   socket.current.onmessage = (e)=>term.current.write(e.data);
socket.current.onopen = ()=>setIsConnectionIstablished(true);

         term.current.onData(data=>{

             socket.current.send(data)


         });
         socket.current.onclose = ()=>{
             term.current.write("\n\runable to connect backend \n\r");
             setIsConnectionIstablished(false);

         }




        const resizeObserver = new ResizeObserver(()=>{
            fitAddon.current.fit();

        })
        term.current.scrollToBottom();

        if(containerRef.current){
            resizeObserver.observe(containerRef.current);
        }

        resizeObserver.observe(terminalRef.current);
        return ()=>{
            resizeObserver.disconnect();
            socket.current.close();
            term.current.dispose();
        }


  },[ ])

     useEffect(() => {
         console.log(runCommand);
         if(runCommand === ""|| socket.current == null ||!isConnectionIstablised ) {
             return;
         }

       const running = setTimeout(() => {
           socket.current.send(runCommand);
           setRunCommand("");

       },500)
         return () => clearTimeout(running);
     },[isConnectionIstablised, runCommand, setRunCommand])

    return(

     <div ref={containerRef} className="h-full w-full pb-20 bg-[#1e1e1e] overflow-hidden " >
         <div ref={terminalRef} className={"h-full w-full  overflow-scroll"}></div>
     </div>
    )
}