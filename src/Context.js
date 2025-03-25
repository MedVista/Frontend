import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
const SocketContext = createContext();

// const socket = io("http://localhost:5000", {path: "/ssa2-socket/",transports: ["websocket", "polling"],});
// const socket = io('http://localhost:5000/meeting')
// const socket = io('https://backviedeocall.onrender.com/',{path: '/ssa2-socket/',transports: ['websocket','polling']});
const socket = io('https://capstone24.sit.kmutt.ac.th/', {path: '/ssa2-socket/',transports: ['websocket','polling']});

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [socketId, setSocketId] = useState("");
  const [callname, setCallName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioTrack, setAudioTrack] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stateCallModal, setStateCallModal] = useState(false);
  const [dataappointment, setDataappointment] = useState("");
  useEffect(() => {
    socket.on("id", (id) => {
      setSocketId(id);
    });
    socket.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.on(
      "callUser",
      ({ from, name: callerName, signal, dataappointment }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
        setDataappointment(dataappointment);
        setStateCallModal(true);
        localStorage.setItem("appointmentId", dataappointment.id);
      }
    );

    socket.on("callUserEnded", () => {
      setCallEnded(true);

      // Stop the video from the other user
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }

      // Destroy the peer connection
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      
      window.location.pathname = `/ssa2/appointment/${localStorage.getItem(
        "appointmentId"
      )}`;
      localStorage.removeItem("appointmentId");
      // window.location.pathname = "/ssa2";
    });

    socket.on("userDisconnected", ({ id, name }) => {
      alert(`${name} has disconnected from the call.`);
      window.location.pathname = "/ssa2";
      // setTimeout(() => {window.location.pathname = '/ssa2'}, 5000);
      // หรือคุณอาจต้องการจัดการ UI อื่น ๆ ที่นี่
    });
    socket.on("videoStatus", ({ id, status }) => {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = status;
    });
    socket.on("audioStatus", ({ id, status }) => {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = status;
    });
    socket.on("callUserError", ({ error }) => {
      alert(error);
      window.location.pathname = "/ssa2/appointment";
    });
    socket.on("Accepted", ({ name }) => {
      setCall({});
      setStateCallModal(false);

      // myVideo.current = null;
      // userVideo.current = null;
    });

    return () => {
      socket.off("allUsers");
      socket.off("callUser");
      socket.off("callEnded");
      socket.off("userDisconnected");
    };
  }, []);
  useEffect(() => {
    const fullname = localStorage.getItem("fullname");
    if (fullname != null && socketId) {
      setusername();
    }
  }, [socketId]);
  const callUser = (id, time, dataappointment) => {

    localStorage.setItem("appointmentId", dataappointment.id);
    setDataappointment(dataappointment);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: socketId,
        name,
        dataappointment: dataappointment,
      });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
      setVideoTrack(currentStream.getVideoTracks()[0]);
    });

    // เก็บ audio track เพื่อใช้ใน toggleMute
    setAudioTrack(peer.streams[0].getAudioTracks()[0]);

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setCallName(signal.name);
      peer.signal(signal.signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        name,
        from: socketId,
      });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
      console.log(currentStream.getVideoTracks()[0]);
      setVideoTrack(currentStream.getVideoTracks()[0]);
    });

    // เก็บ audio track
    setAudioTrack(peer.streams[0].getAudioTracks()[0]);

    peer.signal(call.signal);
    connectionRef.current = peer;
    setCallAccepted(true);
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit("callEnded", socketId);

    window.location.pathname = `/ssa2/appointment/${localStorage.getItem(
      "appointmentId"
    )}`;
    localStorage.removeItem("appointmentId");
  };
  const setusername = () => {
    const role = localStorage.getItem("role");
    const fullname = localStorage.getItem("fullname");
    let Name = "";
    if (role === "patient") {
      Name = `${fullname}`;
      setName(Name);
    } else {
      Name = `Dr. ${fullname}`;
      setName(Name);
    }

    socket.emit("username", Name, socketId);
  };
  const toggleMute = () => {
    setIsMuted((prev) => !prev);

    // เปิด/ปิด audio track
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled; // เปลี่ยนสถานะของ track
    }
    socket.emit("toggleaudio", { socketId: socketId, status: isMuted });
  };
  const toggleVideo = () => {
    // เปลี่ยนสถานะของ video track
    setIsVideoOff((prev) => !prev);
    socket.emit("togglevideo", { socketId: socketId, status: isVideoOff });
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        setStream,
        name,
        setName,
        callEnded,
        socketId,
        callUser,
        leaveCall,
        answerCall,
        callname,
        setusername,
        toggleMute,
        isMuted,
        toggleVideo,
        isVideoOff,
        stateCallModal,
        setStateCallModal,
        dataappointment,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
