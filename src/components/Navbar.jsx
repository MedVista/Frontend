import Logo from "../Images/logo-navbar.png";
import LogoLogout from "../Images/logo-logout.png";
import HomeWhite from "../Images/Homewhite.png";
import HomeBlue from "../Images/Homeblue.png";
import AppointmentWhite from "../Images/Appointmentwhite.png";
import AppointmentBlue from "../Images/Appointmentblue.png";
import DoctorBlue from "../Images/Doctorblue.png";
import DoctorWhite from "../Images/Doctorwhite.png";
import ProfileBlue from "../Images/Profileblue.png";
import ProfileWhite from "../Images/Profilewhite.png";
import HelpBlue from "../Images/Helpblue.png";
import HelpWhite from "../Images/Helpwhite.png";
import ScheduleWhite from "../Images/Schedulewhite.png";
import ScheduleBlue from "../Images/Scheduleblue.png";
import PatientListBlue from "../Images/Patientlistblue.png";
import PatientListWhite from "../Images/Patientlistwhite.png";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { SocketContext } from "../Context";
import Modals from "./Modals";

const Navbar = (props) => {
  const api = process.env.REACT_APP_API_URL;
  const pathname = window.location.pathname;
  const [newname, setNewName] = useState("");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const logout = () => {
    localStorage.clear();
    setShowModal(true);
    setStatusModal(true);
    setTimeout(() => {
      setShowModal(false);
      setStatusModal(false);
      navigate("/login");
    }, 2000);
  };

  const redirect = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {showModal && <Modals type="logout" />}

      {/* ปุ่ม Toggle สำหรับ Mobile เท่านั้น (ซ่อนบน iPad ขึ้นไป) */}
      <button
        className="md:hidden fixed top-4 left-3 z-50 bg-gray-200 p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div

        className={`fixed inset-y-0 left-0  z-20
           ${statusModal ? " bg-opacity-50" : ""}
           ${props.color}
          h-full p-4 pr-2 shadow-lg transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative
          md:w-full lg:w-full
          `}
      >
        <div className="h-full w-full flex flex-col items-center justify-between">
          <div className="w-full">
          <img src={Logo} alt="Logo" className="w-48 mb-6" />
          {[
            { path: "/home", label: "Home", icons: [HomeWhite, HomeBlue] },
            { path: "/appointment", label: "Appointment", icons: [AppointmentWhite, AppointmentBlue] },
            localStorage.getItem("role") === "patient" && {
              path: "/doctors",
              label: "Doctors",
              icons: [DoctorWhite, DoctorBlue],
            },
            localStorage.getItem("role") === "doctor" && {
              path: "/patientlist",
              label: "Patient List",
              icons: [PatientListWhite, PatientListBlue],
            },
            localStorage.getItem("role") === "doctor" && {
              path: "/schedule",
              label: "Schedule",
              icons: [ScheduleWhite, ScheduleBlue],
            },
            { path: "/profile", label: "Profile", icons: [ProfileWhite, ProfileBlue] },

          ]
            .filter(Boolean)
            .map(({ path, label, icons }) => (
              <button
                key={path}
                className={`flex items-center lg:pl-7 max-sm:pl-3 sm:pl-3 w-full rounded-xl py-2 mb-4 ${
                  pathname.includes(path) ? "bg-[#465EA6] text-white" : "text-[#465EA6]"
                }`}
                onClick={() => redirect(path)}
              >
                <img
                  src={pathname.includes(path) ? icons[0] : icons[1]}
                  alt={label}
                  className="mr-2 w-5"
                />
                {label}
              </button>
            ))}
          <hr className="border-gray-300 w-[100%] my-4" />
          {localStorage.getItem("accessToken") && (
            <button
              className="flex items-center pl-7 w-full pb-5 text-red-500"
              onClick={logout}
            >
              <img src={LogoLogout} alt="Logout" className="pr-6 w-10" /> Logout
            </button>
          )}
          </div>
          <div className="w-full">
          <hr className="border-gray-300 w-[100%] my-4" />
          <div className="flex items-center ">
            <Link to="/profile">
              <img
                src={`${api}${localStorage.getItem("profile_picture")}`}
                alt="Profile"
                className="rounded-full w-12 h-12 md:w-8 md:h-8"
              />
            </Link>
            <div className="pl-3 md:pl-1 ">
              <p className="text-base text-gray-800 md:text-sm">{localStorage.getItem("fullname")}</p>
              <p className="text-sm text-gray-500 md:text-xs">{localStorage.getItem("email")}</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Overlay (สำหรับปิด Sidebar ตอน Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;