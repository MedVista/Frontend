import Navbar from "./Navbar";
import VideoPlayer from "./VideoPlayer";
const VideoCall = () => {
    return (
        <div className="w-screen h-screen flex bg-[#EBEBEB] text-[#484646] cursor-default">
        <div className=" md:w-1/5 md:h-screen md:static md:top-0 md:left-0">
          <Navbar page="videocall" />
        </div>
        <div className="md:w-4/5 w-full pl-14 md:pl-0 h-full  flex flex-col  bg-gray-100">
            <VideoPlayer />
        </div>
        </div>
    );
}
export default VideoCall;