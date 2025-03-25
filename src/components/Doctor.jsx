import { SocketContext } from "../Context";
import { useState, useEffect, useContext } from "react";
import { IoSearchSharp, IoStar } from "react-icons/io5";
import {
  FetchGetSpeciality,
  FetchSpecialityDoctorById,
  FetchAllDoctor
} from "../composables/Fetchdata";
import Modals from "./Modals";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import HeaderPage from "./HeaderPageDetail";
import LoadingPage from "./LoadingPage";
import { is } from "date-fns/locale";
const Doctor = () => {
    const api = process.env.REACT_APP_API_URL;
  const id = window.location.pathname.split("/")[4];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { stateCallModal } = useContext(SocketContext);
  const [dataSpeciality, setDataSpeciality] = useState([]);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [search, setSearch] = useState("");
  const [specialityName, setSpecialityName] = useState("");
  const handleDoctorClick = (id) => {
    navigate(`/home/${id}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      FetchGetSpeciality().then((data) => {
        setDataSpeciality(data);
        setSpecialityName(data.find((s) => s.id == id)?.name);
      });
      FetchAllDoctor().then((data) => {
        if(data.length > 0){
          setIsLoading(false);
          setDataDoctor(data);
        }
        
      });
      
    }
    fetchData();  
  }, []);
if(isLoading){
  return (
    <div>
      <LoadingPage />
    </div>
  );
}else{
  return (
    <div className="w-screen h-screen flex bg-[#EBEBEB] cursor-default text-[#484646]  ">
      {stateCallModal && <Modals type="call" />}
      <div className=" md:w-1/5 md:h-screen md:static md:top-0 md:left-0">
      <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
      </div>
      <div className="w-full md:w-4/5 ml-auto overflow-y-auto pt-5 pl-14 pr-2 pb-0 ">
        <div className="bg-[#EBEBEB] w-full z-20 ">
          <HeaderPage page="Doctors"  />
        </div>
        <div className="flex items-center w-full mb-6">
          <input
            type="text"
            placeholder="Search by doctor's name..."
            value={search}
            className="p-3 w-[95%] rounded-2xl shadow-md border border-gray-300 mr-3 bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#8DAEF2] w-10 h-10 flex justify-center items-center text-white p-2 rounded-full shadow-md">
            <IoSearchSharp className="text-2xl text-blue-950" />
          </button>
        </div>

        {dataDoctor.length > 0 ? (
          (() => {
            const filteredDoctors = dataDoctor.filter(
              (doctor) =>
                doctor.first_name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                doctor.last_name.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredDoctors.length === 0) {
              return (
                <div className="w-full h-96 flex items-center justify-center">
                  <h1 className="text-2xl text-gray-400">
                    No Doctor In This Speciality
                  </h1>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDoctors.map((doctors, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-md shadow-zinc-400 flex flex-col items-center p-4 justify-center "
                    
                  >
                    <img
                      src={`${api}${doctors.profile_picture}`}
                      alt="Doctor"
                      className="rounded-full border-2 border-white shadow-md mb-4 object-contain w-32 h-32"
                    />
                    <h4 className="font-bold text-center capitalize">
                      {"Dr." +
                        " " +
                        doctors?.first_name +
                        " " +
                        doctors?.last_name}
                    </h4>
                    <p className="bg-[#D9DFEA] rounded-full text-sm text-[#366CD9] py-1 px-4 mt-2">
                      {dataSpeciality.find((speciality) => speciality.id == doctors?.specialization)?.name}
                    </p>
                    <p className="text-xs flex items-center mt-1">
                      <IoStar className="mr-1 text-yellow-400" /> {doctors.avg_rating}
                    </p>
                    <button className="bg-[#465EA6] w-32 h-8 mt-4 text-white rounded-md" onClick={() => handleDoctorClick(doctors.id)}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <h1 className="text-2xl text-gray-400">
              No Doctor 
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

    }
    export default Doctor;