import {
    FaJs, FaHtml5, FaCss3Alt, FaReact, FaFileCode, FaFileAlt,
    FaFileExcel, FaFileWord, FaFilePdf, FaFileImage, FaFileArchive,
    FaPython, FaJava, FaPhp, FaMarkdown, FaCoffee, FaFilePowerpoint,
    FaFolder, FaFolderOpen
} from 'react-icons/fa';
import {SiTypescript} from "react-icons/si";

// Extension-to-icon mapping
const fileIcons = {
    js: <FaJs className="text-yellow-300 inline-mr-1" />,
    jsx: <FaReact className="text-cyan-400 inline-mr-1" />,
    ts:   <SiTypescript/>,
    tsx: <FaReact className="text-blue-400 inline-mr-1" />,
    html: <FaHtml5 className="text-orange-500 inline-mr-1" />,
    css: <FaCss3Alt className="text-blue-400 inline-mr-1" />,
    json: <FaFileCode className="text-green-400 inline-mr-1" />,
    md: <FaMarkdown className="text-purple-400 inline-mr-1"  />,
    py: <FaPython className="text-yellow-400 inline-mr-1" />,
    java: <FaCoffee className="text-red-500 inline-mr-1" />,
    php: <FaPhp className="text-indigo-500 inline-mr-1" />,
    pdf: <FaFilePdf className="text-red-600 inline-mr-1" />,
    doc: <FaFileWord className="text-blue-700 inline-mr-1" />,
    docx: <FaFileWord className="text-blue-700 inline-mr-1" />,
    xls: <FaFileExcel className="text-green-700 inline-mr-1" />,
    xlsx: <FaFileExcel className="text-green-700 inline-mr-1" />,
    ppt: <FaFilePowerpoint className="text-orange-600 inline-mr-1" />,
    pptx: <FaFilePowerpoint className="text-orange-600 inline-mr-1" />,
    zip: <FaFileArchive className="text-yellow-700 inline-mr-1" />,
    rar: <FaFileArchive className="text-yellow-700 inline-mr-1" />,
    png: <FaFileImage className="text-pink-400 inline-mr-1" />,
    jpg: <FaFileImage className="text-pink-400 inline-mr-1" />,
    jpeg: <FaFileImage className="text-pink-400 inline-mr-1" />,
    svg: <FaFileImage className="text-pink-400 inline-mr-1" />,

};
const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return fileIcons[ext] || <FaFileAlt />;
};
export default getFileIcon;