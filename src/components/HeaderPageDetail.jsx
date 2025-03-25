import { Link, useNavigate } from "react-router-dom";
import { IoIosCall } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import { SocketContext } from "../Context";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
const HeaderPage = (props) => {
  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const next = () => {
    if (props.page == "videocall") {
      window.location.pathname = `ssa2/appointment/${localStorage.getItem(
        "appointmentId"
      )}`;
    } else {
      props.page == "appointmentdetail"
        ? navigate("/appointment")
        : props.page == "speciality"
        ? navigate("/home")
        : navigate("/home");
    }
  };
  return (
    <div className="w-full pb-2  flex justify-between items-center">
      <div className="flex items-center space-x-5">
        {/* <Link to ={props.page == "videocall" || "appointmentdetail" ?"/appointment":""}><p className=" w-9 flex justify-center h-9 rounded-full text-blue-700 bg-[#DCDCDC] text-2xl cursor-pointer">&lt;</p></Link> */}
        <p
          className=" w-9 flex justify-center h-9 rounded-full text-blue-700 bg-[#DCDCDC] text-2xl cursor-pointer"
          onClick={() => next()}
        >
          &lt;
        </p>
        <h1 className="font-medium text-2xl">
          {props.page == "appointmentdetail"
            ? "Appointment Details"
            : props.page == "speciality"
            ? props.data
            : props.page == "Schedule"
            ? "Schedule"
            : props.page == "Doctors"
            ?"Doctors"
            :props.page == "Patients List"
            ?"Patients List"
            : ""}
        </h1>
      </div>
      {/* <div className="text-right flex  items-center">
        <div className="border-r-2 border-[#DCDCDC] pr-5 text-2xl cursor-pointer">
          <IoMoonOutline className="text-2xl   " />
        </div>
        <GoBell className="text-2xl ml-3 mr-5 cursor-pointer" />
        <Link to={`/profile`}>
          <img
            src={`${api}${localStorage.getItem("profile_picture")}`}
            alt="LogoHome"
            className=" rounded-full mt-2 w-12 h-12 mb-2 "
          />
        </Link>
      </div> */}
    </div>
  );
};
export default HeaderPage;
