const extensionToLanguage = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    xml: 'xml',
    sh: 'shell',
    go: 'go',
    php: 'php',
    rb: 'ruby',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    txt: 'plaintext',
};
const runCommands = {
    java: 'java ',
    py:"python3 ",
    js: "node "
}
export const getLanguage = (filename )=> {
    if(!filename){
        return "plaintext";
    }
    const ext = filename.split('.').pop().toLowerCase();
    return extensionToLanguage[ext];
}
export const getCommand = (node)=>{
    if(!node ){
        return "";
    }
    const ext = node.name.split('.').pop().toLowerCase();
    const run = runCommands[ext] || "";
    if(run === ""){
        return "";
    }
    return run+node.path+"\n";
}