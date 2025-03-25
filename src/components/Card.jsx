import { useState, useEffect } from "react";
import { formatDate, formatTimeRange } from "../composables/Common";
import { FiClock } from "react-icons/fi";

const CardDoctor = (props) => {
  const [type, setType] = useState("");
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (props.doctors !== undefined && props.type === "home") {
      setType("doctor");
    } else if (props.patients !== undefined && props.type === "home") {
      setType("patient");
    } else {
      setType("appointment");
    }
  }, [props.doctors, props.patients, props.type]);

  return (
    <div
  className={`bg-[#465EA6] rounded-xl ${props.style} shadow-md shadow-[#B2B1B1]`}
>
  <div className="w-full text-white lg:px-10 px-2 py-5 space-x-2 flex  sm:flex-row items-center justify-between">
    <div className="mb-4 sm:mb-0">
      <h4 className="font-bold lg:text-xl mb-2 capitalize">
        {localStorage.getItem("role") === "patient"
          ? "Dr. " +
            props.appointment?.doctorId.first_name +
            " " +
            props.appointment?.doctorId?.last_name
          : props.appointment?.patientId?.first_name +
            " " +
            props.appointment?.patientId?.last_name}
      </h4>

      {localStorage.getItem("role") === "patient" && (
        <p className="bg-[#F2CD88] rounded-full text-xs lg:text-sm w-32 h-6 text-center text-black flex justify-center items-center">
          {props.appointment?.doctorId?.specialization.name}
        </p>
      )}

      <p>{formatDate(props.appointment?.appointment_date)}</p>
      <p className="flex items-center lg:text-sm text-xs">
        <FiClock className="mr-2" />
        {props.appointment.time_slot
          ? formatTimeRange(
              props.appointment.time_slot?.start_time +
                "-" +
                props.appointment.time_slot?.end_time
            )
          : "-"}
      </p>
    </div>

    <img
      src={
        localStorage.getItem("role") === "patient"
          ? `${api}${props.appointment.doctorId.profile_picture}`
          : `${api}${props.appointment.patientId.profile_picture}`
      }
      alt={
        localStorage.getItem("role") === "patient" ? "Doctor" : "Patient"
      }
      className="rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-4 border-white object-cover"
    />
  </div>

  {props.patients?.type === "Unconfirmed" && (
    <div className="flex w-full justify-center space-x-5 mb-5 text-white font-bold">
      <button className="bg-[#59A670] w-32 h-10 flex justify-center items-center text-sm p-2 rounded-3xl mt-1 shadow-md">
        Confirm
      </button>
      <button className="bg-[#D95448] w-32 h-10 flex justify-center items-center text-sm p-2 rounded-3xl mt-1 shadow-md">
        Decline
      </button>
    </div>
  )}
</div>
  );
};

export default CardDoctor;
