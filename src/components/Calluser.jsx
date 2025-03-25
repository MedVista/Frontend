import Navbar from "./Navbar"
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from "./VideoPlayer";
const Calluser = () => {
    const {  callAccepted, name, setName, callEnded, leaveCall, callUser,stream,myVideo,
        setStream, } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const navigate = useNavigate();
  const call = () => {

    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true })
        .then((currentStream) => {
            setStream(currentStream); // ตั้งค่า stream ที่ได้รับ
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream; 
            }
        })
        .catch((error) => {
            console.error('Error accessing media devices.', error);
        });
};
useEffect(() => {
  if (stream?.active) {
      callUser(idToCall); // เรียกใช้ callUser เมื่อ stream มีค่า
  }
}, [stream, idToCall]);
  useEffect(() => {
    if (callAccepted) {
      navigate('/videocall');
    }
  }, [callAccepted, navigate]);
  
    return (
        <div className="w-screen h-screen flex bg-[#EBEBEB] text-[#484646] cursor-default">
      <div className="w-1/5">
        <Navbar />
      </div>
      <div className="w-4/5 h-full  flex flex-col pr-14 pt-8 pl-14 pb-2 bg-gray-100">
      <p>call to </p>
        <input type="text" value={idToCall} className="bg-white border-2" onChange={(e) => setIdToCall(e.target.value)} />
        <button onClick={() => call(idToCall)} className="bg-blue-500 text-white">Call</button>
        {/* <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className="w-60"
        /> */}
      </div>
      </div>
    )
}
export default Calluser