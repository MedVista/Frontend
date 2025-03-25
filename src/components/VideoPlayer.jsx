import React, { useContext, useEffect, useState } from "react";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { Link,useNavigate } from "react-router-dom";
import { IoIosCall } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import { SocketContext } from "../Context";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go"; 
import HeaderPage from "./HeaderPageDetail";
import Clock from "../Images/clock.png";
import CountdownTimer from "./CountdownTimer";
import {
  UpdateAppointment,
} from "../composables/Fetchdata";
import { formatTimeRange } from "../composables/Common";
const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream,setStream, call ,callname,leaveCall,
    toggleMute,
    isMuted,
    setIsMuted,
    checkuservideo,
    isVideoOff,
    toggleVideo,
dataappointment

  } = useContext(SocketContext);
  //  const [isMuted, setIsMuted] = useState(false);
  // const [isVideoOff, setIsVideoOff] = useState(false);
  const handletoggleMute = () => {
    // setIsMuted((prev) => !prev);
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled; // เปิด/ปิดไมค์
    });
    toggleMute();
    // myVideo.current.srcObject.getAudioTracks().forEach(track => {
    //   track.enabled = !track.enabled; // เปิด/ปิดไมค์
    // })
  };

  const handletoggleVideo = () => {
   toggleVideo();
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled; // เปิด/ปิดกล้อง
    });
  };
  useEffect(() => {
    if(callAccepted == false){
       window.location.pathname = "/ssa2/"
    }else{
      if (userVideo.current) {
        console.log('userVideo is ready:', userVideo.current);
      }
    }
    
  }, [callAccepted, stream]);
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) { // ตรวจสอบว่า myVideo.current มีค่า
            myVideo.current.srcObject = currentStream;
          } else {
            console.error("myVideo is not defined");
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    },[])

    const endcall = () => {
      
      dataappointment.time_slot = dataappointment.time_slot.id;
      dataappointment.appointment_date = dataappointment.appointment_date;
      dataappointment.doctorId = dataappointment.doctorId?.id;
      dataappointment.patientId = dataappointment.patientId?.id;
      dataappointment.status = "Completed";

      UpdateAppointment(dataappointment, dataappointment.id).then((response) => {
        if (response == 200) {
          // alert("Appointment cancelled successfully.");
          // // setState(3)
          //   navigate("/appointment");
          leaveCall(localStorage.getItem('role'),dataappointment.id);
        } else {
          // alert("Something went wrong.");
        }
      });
    }
    function startTimer(duration, display) {
      var timer = duration, minutes, seconds;
      setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);
  
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
  
          display.textContent = minutes + ":" + seconds;
  
          if (--timer < 0) {
              timer = duration;
          }
      }, 1000);
  }

  return (
    <div className="relative w-full h-full">
      {stream && (
        <div>
          <video
        playsInline muted ref={myVideo} autoPlay
          className="w-72 h-48  max-sm:w-32 max-sm:h-32   rounded-2xl absolute top-24 right-14 object-cover z-10"
          style={{transform: "scaleX(-1)"}}
        />
          {/* {isVideoOff && <div className="w-72 h-48 rounded-2xl flex justify-center items-center absolute top-14 right-20 object-cover z-10 bg-white">
            <FaVideoSlash className="text-8xl"/>
            </div>} */}
          </div>
      )}
      {!userVideo && (
        <p className="absolute top-1/3 left-1/2 z-10 transform -translate-x-1/2 text-white">
          Waiting For Video
        </p>
      )}

      <div className="w-hull h-3/4  pt-2 md:pl-8 pr-8 pb-[72px]">
      <div className="w-full pb-2  flex justify-between items-center">
        <HeaderPage page="videocall" />
      </div>
        <div className="relative w-full h-full rounded-2xl bg-slate-700 ">
        {callAccepted && !callEnded && (
        <video playsInline ref={userVideo} autoPlay className="w-full h-full rounded-2xl object-cover z-10 bg-white" style={{transform: "scaleX(-1)"}}  />
      )}
          {/* {isVideoOff && <div className="w-full h-full rounded-2xl flex justify-center items-center absolute  object-cover z-9 bg-white">
            <FaVideoSlash className="text-8xl"/>
            </div>} */}

          {/* Button container positioned below the video */}
          
        </div>
      </div>
      <div className="w-full h-1/4 text-[#484646]  pr-14 pl-14 pt-5 space-y-4">
          <div className=" flex flex-col justify-center items-center font-bold">
          {/* <p className="  flex justify-center  items-center "><CiClock2 className="text-xl mr-2" /> <span id="time">05:00</span>  lefts</p> */}
          <span className="flex justify-center  items-center">
            <CiClock2 className="text-xl mr-2" />
             <CountdownTimer minutes={15} />
              lefts </span>
            <p className="text-2xl ">{localStorage.getItem('role')=='patient' ? call?.name : callname}</p>
            <p className="flex items-center">
             {formatTimeRange(dataappointment?.time_slot?.start_time +"-"+dataappointment?.time_slot?.end_time )}
          </p>
          </div>
          <div className="flex justify-center space-x-4 pt-2">
            <button
              className="rounded-xl w-12 h-12 bg-white flex justify-center items-center border-2 border-[#465EA6]"
              onClick={handletoggleMute}
            >
              {isMuted ? (
                <AiOutlineAudioMuted className="text-gray-500 text-2xl" />
              ) : (
                <AiOutlineAudio className="text-gray-500 text-2xl" />
              )}
            </button>
            <button
              className="rounded-xl w-12 h-12 bg-red-500 flex justify-center items-center "
              onClick={endcall}
            >
              <IoIosCall className="text-white text-2xl" />
            </button>
            <button
              className="rounded-xl w-12 h-12 bg-white flex justify-center items-center border-2 border-[#465EA6]"
              onClick={handletoggleVideo}
            >
              {isVideoOff ? (
                <FaVideoSlash className="text-gray-500 text-2xl" />
              ) : (
                <FaVideo className="text-gray-500 text-2xl" />
              )}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlayer;