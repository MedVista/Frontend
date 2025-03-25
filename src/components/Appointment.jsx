
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Modals from "./Modals";
import Card from "./Card";
import { useState, useEffect, useContext } from "react";
 import { FetchDoctor, FetchAppointments } from "../composables/Fetchdata";
 import { useNavigate } from "react-router-dom";
import { trimPath } from "../composables/Common";
 import { SocketContext } from "../Context";
 import LoadingPage from "./LoadingPage";
const Appointments = () => {
  // ตัวอย่างโค้ด State ต่าง ๆ

  const [type, setType] = useState("Upcoming"); // "Scheduled" | "Completed" | "Cancelled"
  const [isLoading, setIsLoading] = useState(true);
  const { stateCallModal } = useContext(SocketContext);
  const pathname = trimPath(window.location.pathname);
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
   const handleSelect = (type) => {
     setType(type);
   };

   useEffect(() => {
    FetchAppointments().then((data) => {
      if (data != 404) {
        setDatas(data);
      }
    });
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <LoadingPage />;
  }else{
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-gray-100 cursor-default text-[#484646]">
      
      {/* หากต้องการ Navbar อยู่ซ้ายบนถาวรในหน้าจอใหญ่ (Tablet/PC) 
          แต่สลับเป็นด้านบนบนมือถือ ให้ใช้ md:w-1/5 + fixed เฉพาะ md 
          (ส่วนมือถือ/เล็กจะ w-full และ position static) 
      */}
      {stateCallModal && <Modals type="call" />}

      <div className="w-full md:w-1/5 h-auto md:h-screen fixed md:static top-0 left-0 z-50 md:z-auto">
      <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
      </div>

      {/* ส่วน Content หลัก */}
      <div className="flex-1  h-auto md:h-screen overflow-y-auto flex flex-col pl-14 pr-2 py-4 md:px-14 md:py-2">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>

        {/* แถบเลือกประเภทนัด */}
        <div className="flex mb-8 w-full h-14  max-sm:h-12  text-xl rounded-full bg-white items-center border-2 shadow-md shadow-[#B2B1B1] justify-between px-1">
          <button
            className={`text-gray-500 py-2 px-4 rounded-full w-24 md:w-72 h-10
              max-sm:w-20
               max-sm:text-xs
               max-sm:py-1
                max-sm:px-1
                max-sm:h-8
              flex justify-center items-center
              ${type === "Upcoming" ? "bg-[#8DAEF2] text-white" : ""}`}
            onClick={() => handleSelect("Upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-full w-24 md:w-72 h-10
              flex justify-center items-center
              max-sm:w-20
               max-sm:text-xs
               max-sm:py-1
                max-sm:px-1
                max-sm:h-8
              ${type === "Completed" ? "bg-[#8DAEF2] text-white" : ""}`}
            onClick={() => handleSelect("Completed")}
          >
            Completed
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-full w-24 md:w-72 h-10
              max-sm:w-20
               max-sm:text-xs
               max-sm:py-1
                max-sm:px-1
                max-sm:h-8
              flex justify-center items-center
              ${type === "Cancelled" ? "bg-[#8DAEF2] text-white" : ""}`}
            onClick={() => handleSelect("Cancelled")}
          >
            Cancelled
          </button>
        </div>
        {datas?.filter((data) => data.status === type).length > 0 || (type === "Upcoming" && localStorage.getItem("role")== "doctor" && datas?.filter((data) => data.status === "Pending").length > 0 ) ? (
  <div className="mb-8 mt-2 w-full">
  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 w-full">
    {datas
      ?.filter((data) => data.status === type)
      .map((data) => (
        <Link to={`/appointment/${data.id}`} key={data.id}>
          <Card style="gap-2" appointment={data} />
        </Link>
      ))}
  </div>
  
  {type === "Upcoming" && localStorage.getItem("role") === "doctor" && 
    datas?.filter((data) => data.status === "Pending").length > 0 && (
      <div>
        <h3 className="text-xl font-semibold mb-4">Unconfirmed Appointment</h3>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 w-full">
          {datas
            ?.filter((data) => data.status === "Pending")
            .map((data) => (
              <Link to={`/appointment/${data.id}`} key={data.id}>
                <Card style="gap-2" appointment={data} />
              </Link>
            ))}
        </div>
      </div>
    )}
</div>
) 

: (
  <div className="w-full h-full text-center text-xl capitalize flex justify-center items-center text-gray-500 col-span-2">
    No {type.toLowerCase()} Appointments.
  </div>
)}






      </div>
    </div>
  );
}
};

export default Appointments;