import React, {useEffect, useRef, useState} from 'react';
import Editor from '@monaco-editor/react';
import {getLanguage} from "../assets/languagemapper.js";
import Console from "./Terminal.jsx";

const CodeEditor = ({ file,containerName}) => {
    const [code,setCode] = useState("");
    const containerRef = useRef(null);
    const editorRef = useRef(null);
  const ws = useRef(null);
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };


useEffect(() => {
    if(!file || !containerName){
        return;
    }
    ws.current = new WebSocket(`ws://localhost:8080/ws/codeEditor?path=${file.path}&containerName=${containerName}`);

    ws.current.onopen = (e) => {
        console.log("open "+e.message);
    }
    ws.current.onmessage = (e) => {setCode(e.data);}
    ws.current.onClose = (e) => {
        console.log("close "+e.message);
    }

    ws.current.onError = (e) => {Console.log("websocket error: "+e.message);}
    return () => {
        ws.current.close();
    }


},[file,containerName])
    const handleChange = (val) => {
    setCode(val);
    if(ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(val);
    }
    }
    return (
        <div ref={containerRef} style={{ height: "100%", width: "100%"  }}>
            <Editor
                height="100%"
                value={code}
                language={getLanguage(file?file.name:"java")}
                defaultLanguage={"java"}
                defaultValue={code}
                theme="vs-dark"
                onChange={handleChange}
                onMount={handleEditorDidMount}
                options={{
                    wordWrap:"on",
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding:{
                      top:10,
                      bottom:10,
                    },
                }}
            />

        </div>
    );
};

export default CodeEditor;