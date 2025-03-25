import React, { useContext, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../Context';
import VideoPlayer from './VideoPlayer';

const Notifications = () => {
  const { answerCall, call, callAccepted,setStream,myVideo,stream } = useContext(SocketContext);
  const navigate = useNavigate();
  const stylemodal = {
    /* Hidden by default */
    position: "fixed" /* Stay in place */,
    "z-index": "1" /* Sit on top */,
    "padding-top": "100px" /* Location of the box */,
    left: 0,
    top: 0,
    width: "100%" /* Full width */,
    height: "100%" /* Full height */,
    overflow: "auto" /* Enable scroll if needed */,
    "background-color": "rgb(0,0,0)" /* Fallback color */,
    "background-color": "rgba(0,0,0,0.4)" /* Black w/ opacity */,
  };
  useEffect(() => {
    if (callAccepted) {
      navigate('/videocall');
    }
  }, [callAccepted, navigate]); // Add callAccepted to dependency array
  // useEffect(() => {
  //   if (call.isReceivingCall) {
  //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //       .then((currentStream) => {
  //         setStream(currentStream);
  //         if (myVideo.current) {
  //           myVideo.current.srcObject = currentStream;
  //         } else {
  //           console.error("myVideo is not defined");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error accessing media devices.", error);
  //       }); 
  //   } else {
  //     if (stream) {
  //       stream.getTracks().forEach((track) => track.stop());
  //       myVideo.current.srcObject = null;
  //       setStream(null);
  //     }
  //   }
   
  // }, [call.isReceivingCall,]);
  return (
    <>
      {
      call.isReceivingCall && !callAccepted && (
        // <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={stylemodal} className="flex justify-center items-center  ">
          <div className="w-[30%] h-[30%] bg-white rounded-3xl p-5 flex flex-col justify-center items-center ">
          <h1>{call.name} is calling</h1>
          <Button variant="contained" color="primary" onClick={answerCall} disabled={!stream?.active}>
            Answer
          </Button>
          {/* <button onClick={answerCall} className='bg-blue-600 text-white h-10 w-20 b' disabled={!stream?.active}>Answer</button> */}
          {/* <VideoPlayer /> */}
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
    </>
  );
};

export default Notifications;
