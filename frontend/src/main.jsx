import { createRoot } from 'react-dom/client'
import './index.css'

import {Theme} from "@radix-ui/themes";
import App from "./App";
import Workspace from "./Workspace.jsx";
// const userdetails = {
//     name:"shivam",
//     email:"shivayarana777@gmail.com",
//     worlspaceName:"shivayarana777"
// }
createRoot(document.getElementById('root')).render(

    <Theme accentColor="indigo" className={"h-full w-full"}>

         <App/>

    </Theme>
)
