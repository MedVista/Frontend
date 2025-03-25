import { SocketContext } from "../Context";
import { useState, useEffect, useContext } from "react";
import { IoSearchSharp, IoStar } from "react-icons/io5";
import {

  FetchPatientByDoctorID
} from "../composables/Fetchdata";
import Modals from "./Modals";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import HeaderPage from "./HeaderPageDetail";
import LoadingPage from "./LoadingPage";
import toast, { Toaster } from "react-hot-toast";
const Patientlist = () => {
    const api = process.env.REACT_APP_API_URL;
const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { stateCallModal } = useContext(SocketContext);
  const [dataSpeciality, setDataSpeciality] = useState([]);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [dataPatient, setDataPatient] = useState([]);
  const [search, setSearch] = useState("");
  const [specialityName, setSpecialityName] = useState("");
  const handleDoctorClick = (id) => {
    navigate(`/home/${id}`);
  };
  useEffect(() => {
   if(localStorage.getItem("role")== "doctor"){

    FetchPatientByDoctorID(localStorage.getItem("id")).then((data) => {
      if(data != 404){
        setDataPatient(data);
      }

      
      setIsLoading(false);
    });

  }else{
    toast.error("You are not authorized to view this page",{
      autoClose: 500,
            removeDelay: 500,
    });
    setTimeout(() => {
      navigate("/");
      toast.dismiss();
    }
    , 1000);
  }
  }, []);

  if(isLoading){
    return (
      <div>
        <Toaster toastOptions={{ removeDelay: 500 }} />
        <LoadingPage />
      </div>
    );
}else{
  return (
    <div className="w-screen h-screen flex bg-gray-100 cursor-default text-[#484646]  ">
      {stateCallModal && <Modals type="call" />}
      <div className="md:w-1/5 md:h-screen md:static md:top-0 md:left-0">
      <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
      </div>
      <div className="w-full md:w-4/5 ml-auto overflow-y-auto pt-5 pl-14 pr-2 pb-0  ">
        <div className="bg-gray-100 w-full ">
          <HeaderPage page="Patients List"  />
        </div>
        <div className="flex items-center w-full mb-6">
          <input
            type="text"
            placeholder="Search by patient’s name..."
            value={search}
            className="p-3 w-[95%] rounded-2xl shadow-md border border-gray-300 mr-3 bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#8DAEF2] w-10 h-10 flex justify-center items-center text-white p-2 rounded-full shadow-md">
            <IoSearchSharp className="text-2xl text-blue-950" />
          </button>
        </div>

        {dataPatient.length > 0 ? (
          <div className="w-full flex flex-col justify-center items-center pr-[53px]">
            {dataPatient.map((patient) => (
              <div className="w-full bg-white rounded-xl shadow-md p-4 pr-5 mb-4 flex items-center justify-between">
                <div className="w-full flex items-center">
                <img src={`${api}/${patient?.profile_picture}`} alt="patient" className="w-16 bg-blue-800 h-16 rounded-full" />
                <div className="ml-4">
                    <h1 className="text-base font-medium text-[#484646]">{patient.first_name +" "+patient.last_name}</h1>
                    <p className="text-sm text-[#AAA4A4]">{patient.email}</p>
                    </div>
                    </div>
                    <p className="text-[#465EA6]">Profile</p>
                </div>))}

            </div>
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <h1 className="text-2xl text-gray-400">
              No Patient
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
}
export default Patientlist;