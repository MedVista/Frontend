import { SocketContext } from "../Context";
import { useState, useEffect, useContext } from "react";
import { IoSearchSharp, IoStar } from "react-icons/io5";
import {
  FetchGetSpeciality,
  FetchSpecialityDoctorById,
} from "../composables/Fetchdata";
import Modals from "./Modals";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import HeaderPage from "./HeaderPageDetail";

const Dermatology = () => {
  const api = process.env.REACT_APP_API_URL;
  const id = window.location.pathname.split("/")[4];
  const navigate = useNavigate();
  const { stateCallModal } = useContext(SocketContext);
  const [dataSpeciality, setDataSpeciality] = useState([]);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [search, setSearch] = useState("");
  const [specialityName, setSpecialityName] = useState("");

  const handleDoctorClick = (id) => {
    navigate(`/home/${id}`);
  };

  useEffect(() => {
    FetchGetSpeciality().then((data) => {
      setDataSpeciality(data);
      setSpecialityName(data.find((s) => s.id == id)?.name);
    });
    FetchSpecialityDoctorById(id).then((data) => {
      setDataDoctor(data);
    });
  }, [id]);

  return (
    <div className="w-screen h-screen flex bg-[#EBEBEB] cursor-default text-[#484646]">
      {stateCallModal && <Modals type="call" />}
      <div className="w-1/5 h-screen fixed top-0 left-0">
        <Navbar />
      </div>
      <div className="w-full md:w-4/5 ml-auto overflow-y-auto p-4 pl-14 md:p-8 pb-0">
        <div className="bg-[#EBEBEB] w-full">
          <HeaderPage page="speciality" data={specialityName} />
        </div>
        <div className="flex items-center w-full mb-6">
          <input
            type="text"
            placeholder="Search by doctor's name..."
            value={search}
            className="p-3 w-full md:w-[95%] rounded-2xl shadow-md border border-gray-300 mr-3 bg-white"
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
                doctor.first_name.toLowerCase().includes(search.toLowerCase()) ||
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-md shadow-zinc-400 flex flex-col items-center p-4 justify-center"
                  >
                    <img
                      src={`${api}${doctor.profile_picture}`}
                      alt="Doctor"
                      className="rounded-full border-2 border-white shadow-md mb-4 object-contain w-24 h-24 md:w-32 md:h-32"
                    />
                    <h4 className="font-bold text-center capitalize">
                      {"Dr. " + doctor.first_name + " " + doctor.last_name}
                    </h4>
                    <p className="bg-[#D9DFEA] rounded-full text-sm text-[#366CD9] py-1 px-4 mt-2">
                      {doctor.specialization.name}
                    </p>
                    <p className="text-xs flex items-center mt-1">
                      <IoStar className="mr-1 text-yellow-400" /> 4.9 (100 reviews)
                    </p>
                    <button
                      className="bg-[#465EA6] w-32 h-8 mt-4 text-white rounded-md"
                      onClick={() => handleDoctorClick(doctor.id)}
                    >
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
              No Doctor In This Speciality
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dermatology;