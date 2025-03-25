import login from "../Images/login-patient.png";
import logoright from "../Images/logo.png";
import logdform from "../Images/logo-form.png";
import { FaUser, FaLock } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { Route, useNavigate, Link } from "react-router-dom";
import { FetchLogin } from "../composables/Fetchdata";
import Incorrect from "../Images/incorrect.png";
import Correct from "../Images/correct.png";
import { SocketContext } from "../Context";
import BackgourdSelectRole from "../Images/BackgourdSelectRole.png";
import Modals from "./Modals";
import DoctorSelectRole from "../Images/DoctorSelectRole.png";
import PatientSelectRole from "../Images/PatientSelectRole.png";
import BackgourdLoginPatient from "../Images/BackgourdLoginPatient.png";
import BackgourdLoginDoctor from "../Images/BackgourdLoginDoctor.png";
import Hide from "../Images/Hide.png";
import UnHide from "../Images/UnHide.png";

const LoginComponent = () => {
  const pathname = window.location.pathname;
  const { setusername } = useContext(SocketContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [fetchresponse, setFetchSponse] = useState("");
  const [state, setState] = useState(0);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleRole = (role) => {
    setRole(role);
    setState(1);
  };
  
  async function submitForm(e) {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    FetchLogin(data).then((response) => {
      if (response?.accessToken) {
        setFetchSponse("200");
        setusername();
        navigate("/home")
      } else {
        setShowResponse(true);
        setFetchSponse(response);
      }
    });
  }
  
  return (
    <div
      style={{
        backgroundImage: `url(${BackgourdSelectRole})`,
      }}
      className="flex h-screen w-screen text-[#484646]"
    >
      {state == 0 ? (
        // หน้าเลือก Role - แบบ Responsive
        <div className="w-screen h-screen flex flex-col justify-center items-center text-white font-medium px-4">
          <h1 className="text-2xl md:text-4xl text-center">Choose your role to continue</h1>
          <h2 className="text-base md:text-lg text-center">
            Log in as a patient or doctor to get started
          </h2>
          <div className="mt-6 md:mt-10 text-black flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10">
            <div
              className="bg-white w-full md:w-60 h-48 md:h-60 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-3 md:space-y-5 hover:bg-slate-200 cursor-pointer"
              onClick={() => handleRole("patient")}
            >
              <img src={PatientSelectRole} alt="Patient" className="w-28 md:w-40" />
              <p className="text-xl font-bold">Patient</p>
            </div>
            <div
              className="bg-white w-full md:w-60 max-sm:w-52 h-48 md:h-60 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-3 md:space-y-5 hover:bg-slate-200 cursor-pointer"
              onClick={() => handleRole("doctor")}
            >
              <img src={DoctorSelectRole} alt="Doctor" className="w-28 md:w-40" />
              <p className="text-xl font-bold">Doctor</p>
            </div>
          </div>
        </div>
      ) : (
        // หน้า Login - แบบ Responsive
        <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
          <div
            style={{
              backgroundImage: `url(${
                role == "patient" ? BackgourdLoginPatient : BackgourdLoginDoctor
              })`,
            }}
            className="hidden md:block md:w-[60%] h-full"
          ></div>
          <div className="w-full md:w-[40%] h-full bg-[#EBEBEB] px-4 md:px-0 flex flex-col items-center">
            <img
              src={logdform}
              alt="Top Logo Right"
              className="mx-auto mt-6 md:mt-10 w-32 md:w-auto"
            />
            <h1 className="text-2xl md:text-4xl font-medium text-center">
              Welcome to MedVista
            </h1>
            <h2 className="text-sm md:text-lg text-[#878484] font-medium text-center mb-4 md:mb-8">
              Your Gateway to Smarter Healthcare
            </h2>
            <div className="w-full flex flex-col justify-center items-center space-y-4 p-4 md:p-10  md:pb-10">
              <div className="w-full">
                <p className={showResponse ? 'text-red-500':""}>Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full h-10 focus:outline-none text-base md:text-xl bg-inherit border-b-[1.5px] ${showResponse ? 'border-red-500':" border-black"}`}
                />
              </div>
              <div className="w-full relative">
                <p className={showResponse ? 'text-red-500':""} >Password</p>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 focus:outline-none text-base md:text-xl bg-inherit border-b-[1.5px] ${showResponse ? 'border-red-500':" border-black"}`}
                  required
                />
                <img 
                  src={showPassword ? UnHide:Hide} 
                  alt="Hide" 
                  className="w-5 md:w-6 absolute right-1 top-8 cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)} 
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-6 md:mb-10 space-y-2 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox border-[#465EA6] [--chkbg:theme(colors.white)] [--chkfg:#465EA6] checked:border-[#465EA6] w-4 h-4 rounded-md mr-2"
                  />
                  <span className="text-sm md:text-base">Remember Password</span>
                </label>
                <a
                  href="/ssa2/forgotpassword"
                  className="text-[#465EA6] text-sm md:text-base hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mx-4 md:w-72 h-12 md:h-14 bg-[#465EA6] text-white text-lg md:text-xl py-2 rounded-full hover:bg-blue-600 transition duration-300"
              onClick={(e) => submitForm(e)}
            >
              Login
            </button>
            <div className="h-full flex flex-col justify-end pb-10 md:pb-20">
              <p className="text-center mt-6 text-sm md:text-base">
                Don't have an account?{" "}
                <Link to={role == "patient" ? "/register" : "/register/doctor"}>
                  <a className="text-[#465EA6] hover:underline">Sign up</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
