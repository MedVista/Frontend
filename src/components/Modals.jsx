
import React, { useContext, useEffect,useState } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../Context';
const Modals = (props) => {
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
  const [data, setData] = useState(props.data);
  // useEffect(() => {
  //   console.log(typeof data);
    
  //   console.log(props.type);
    
  // }, []);
  useEffect(() => {
    if (callAccepted) {
      navigate('/videocall');
    }
  }, [callAccepted, navigate]); // Add callAccepted to dependency array
  useEffect(() => {
    
    if (call.isReceivingCall) {
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
    }else{
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [call.isReceivingCall]);
  return (
    <div style={stylemodal} className="flex  justify-center items-center">
      <div className=" h-[30%] max-sm:w-[80%] max-md:w-[50%] md:w-[30%]  bg-white rounded-3xl p-5 flex flex-col ">
        {props.type !='call'&&<h1 className="text-4xl font-bold text-black">✉️ Message</h1>}
        {(typeof data === "object" && props.type) == 'register' && (
          Object.values(data).map((item) => {
            return (
              <p className=" py-2 text-red-600 text-lg text-start ">
                {item} 
              </p>
            );
          })
        ) 
          }
        {(typeof data === "number" && props.type == 'register') && <div className="flex justify-center items-center h-full">
            <p className="text-3xl font-semibold text-black text-center">
              {data == 201 ? "Sucess" : ""}
            </p>
          </div>}
          {props.type == 'login' && 
          <div className="flex justify-center items-center h-full">
            <p className="text-3xl font-semibold text-black text-center">{data == "200" ?"Login Success":"Login Failed"}</p>
            </div>}
            {
                props.type == 'logout' && <div className="flex justify-center items-center h-full">
                <p className="text-3xl font-semibold text-black text-center">Logout Success</p>
                </div>
            }
            {props.type =="call" && call.isReceivingCall && !callAccepted && 
              (
                <div className=' h-full flex flex-col justify-center items-center' >
                  <h1>{call.name} is calling</h1>
                  <Button variant="contained" color="primary" onClick={answerCall} disabled={!stream?.active}>
                    Answer
                  </Button>
                </div>              
              )
              }
              
      </div>
    </div>
  );
};
export default Modals;
