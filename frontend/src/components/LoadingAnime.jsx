;
import background from "../assets/backGround.png";
export default function LoadingAnime() {
    return (
        <>
        <div className="flex justify-center items-center h-screen  w-screen flex-col  gap-3 absolute bg-blend-darken  " >
            <div className="flex justify-center items-center relative animate-bounce">
                   CodeKrida
                <div className={"w-[100px] h-[100px] border-r-3 border-r-[var(--accent-9)] border-l-3 absolute  border-l-red-700  rounded-full animate-spin duration-500"}></div>
            </div>
        </div>
        </>
    )
}
