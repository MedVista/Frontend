import Navbar from "./Navbar";
import React, { useState, useRef, useEffect, useContext } from "react";
import { IoStar } from "react-icons/io5";
import Experience from "../Images/experience.png";
import Patients from "../Images/patient.png";
import Reviews from "../Images/reviews.png";
import Calendar from "../Images/calendar.png";
import "react-datepicker/dist/react-datepicker.css";

import {
  FetchDoctorById,
  FetchTimeslots,
  CreateAppointment,
  FetchCheckTimeSlotByDoctorId,
  FetchGetSpeciality,
  FetchTimeslotsByDoctorId,
} from "../composables/Fetchdata";
import { useNavigate } from "react-router-dom";
import IconProfile from "../Images/IconProfile.png";
import Email from "../Images/Email.png";
import { formatTimeRange, formatISOToDate } from "../composables/Common";
import { set } from "date-fns";
import { DatePicker } from "antd";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { SocketContext } from "../Context";
import Modals from "./Modals";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import { da, se } from "date-fns/locale";
import Map from "../Images/Map.png";
import Reasonforconsultation from "../Images/Reasonforconsultation.png";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
const DoctorDetail = () => {
  const id = window.location.pathname.split("/")[3];
  const api = process.env.REACT_APP_API_URL;
  const { stateCallModal } = useContext(SocketContext);
  const [startdate, setStartDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(startdate);
  const [weekdays, setWeekDays] = useState([]);
  const [selectedtime, setSelectedTime] = useState(null);
  const [showpicker, setShowpicker] = useState(false);
  const [state, setState] = useState(1);
  const [diagnosis, setDiagnosis] = useState("");
  const [doctor, setDoctor] = useState([]);
  const navigate = useNavigate();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const [error, setError] = useState(null);
  const [timeslotsforchecktime, setTimeslotsforchecktime] = useState([]);
  const [dataSpecialization, setDataSpecialization] = useState([]);
  const [timeSlotDoctor, setTimeSlotDoctor] = useState([]);
  const [datePickerOpen1, setDatePickerOpen1] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSpecialization = await FetchGetSpeciality();
        setDataSpecialization(dataSpecialization);

        const timeslotDoctorData = await FetchTimeslotsByDoctorId(id);
        const lastTimeSlot =
          timeslotDoctorData !== 404 ? timeslotDoctorData : 404;

        if (timeslotDoctorData !== 404 && lastTimeSlot) {
          setTimeSlotDoctor(lastTimeSlot);
        } else {
          setTimeSlotDoctor([]);
        }

        const doctorData = await FetchDoctorById(id);
        if (doctorData !== 404) {
          setDoctor(doctorData);

          const timeslotForCheck = await FetchCheckTimeSlotByDoctorId(
            formatISOToDate(dayjs().$d || null),
            id
          );
          if (timeslotForCheck !== 404) {
            setTimeslotsforchecktime(timeslotForCheck);
          } else {
            setTimeslotsforchecktime([]);
          }
        } else {
          setDoctor([]);
        }

        const timeslotsData = await FetchTimeslots();
        setTimeslots(timeslotsData);

        if (
          dataSpecialization.length > 0 &&
          doctorData !== 404 &&
          lastTimeSlot !== 404 &&
          timeslotsData.length > 0
        ) {
          setIsLoading(false);
        } else {
          toast.dismiss();
          toast.error("The requested page is not available!", {
            autoClose: 500,
            removeDelay: 500,
          });

          setTimeout(() => {
            toast.dismiss();
            navigate("/home");
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDateChange = (date) => {
    if (date != null) {
      setStartDate(date);
      setSelectedDate(date);

      FetchCheckTimeSlotByDoctorId(formatISOToDate(date.$d), id).then(
        (data) => {
          if (data !== 404) {
            setTimeslotsforchecktime(data);
          } else {
            setTimeslotsforchecktime([]);
          }
        }
      );
    }
  };

  const handleTimeSelect = (time) => {
    if (!isTimeSelected(time)) {
      setSelectedTime(time);
    }
  };

  const handleModalClose = () => {
    setTimeout(() => {
      setState(1);
    }, 200);
  };

  const handleSubmit = async () => {
    const dayOfWeek = selectedDate.$d.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const data = {
      doctorId: doctor.id,
      appointment_date: formatISOToDate(selectedDate.$d),
      time_slot: selectedtime,
      status: "Pending",
      diagnosisNotes: diagnosis,
      patientId: localStorage.getItem("id"),
      doctor_booking_slot: timeSlotDoctor.find(
        (time) => time.day_of_week === dayOfWeek
      ).id,
    };
    const response = await CreateAppointment(data);
    if (response === 201) {
      toast.success("Appointment booked successfully");
      setDiagnosis("");
      setTimeout(() => {
        toast.dismiss();
        navigate("/home");
      }, 1000);
    } else {
      toast.dismiss();
      toast.error("Failed to book appointment");
    }
  };

  const handleStateChange = () => {
    if (diagnosis.length === 0) {
      setError("Please enter diagnosis notes");
    } else {
      setError(null);
      setState(2);
    }
  };

  useEffect(() => {
    if (diagnosis.length > 0) {
      setError(null);
    }
  }, [diagnosis]);

  const isTimeSelected = (timeId) => {
    if (typeof timeId === "number") {
      return timeslotsforchecktime?.some(
        (selectedTimeSlot) => selectedTimeSlot.time_slot?.id === timeId
      );
    }
    return false;
  };

  const checkTime = () => {
    let newErrors = {};
    if (selectedDate === "") {
      newErrors.selectedDate = "Please select date";
      setErrors(newErrors);
    } else if (selectedtime === null) {
      newErrors.selectedTime = "Please select time";
      setErrors(newErrors);
    } else {
      document.getElementById("my_modal_5").showModal();
    }
  };

  function formatDateMoadal(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const customFormattedDate = `${day} ${month}. ${year}`;
    return customFormattedDate;
  }

  useEffect(() => {
    let updatedErrors = { ...errors };
    if (selectedDate !== "") updatedErrors.selectedDate = false;
    if (selectedtime !== null) updatedErrors.selectedTime = false;
    setErrors(updatedErrors);
  }, [selectedDate, selectedtime]);

  if (isLoading) {
    return (
      <div>
        <Toaster toastOptions={{ removeDelay: 500 }} />
        <LoadingPage />
      </div>
    );
  } else {
    return (
      /*
        1) ใช้ flex-col บนจอเล็ก, md:flex-row สำหรับจอที่ใหญ่ขึ้น
        2) Navbar ชิดซ้ายเต็มความสูง, ส่วน Content ใช้ md:ml-[20%] เพื่อเว้นที่ให้ Navbar
      */
      <div className="w-screen min-h-screen flex flex-col md:flex-row bg-gray-100 cursor-default text-[#484646]">
        {stateCallModal && <Modals type="call" />}
        <Toaster toastOptions={{ removeDelay: 500 }} />

        {/* Navbar */}
        <div className="w-full md:w-1/5 md:h-screen md:fixed top-0 left-0">
        <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
        </div>

        {/* Content Area */}
        <div className="w-full md:w-4/5 md:ml-[20%] overflow-y-auto flex flex-col px-14 md:px-14 py-8">
          <h1 className="font-bold text-2xl mb-4">Doctor Information</h1>

          {/* Section Doctor Profile */}
          <div className="flex flex-col sm:flex-row pb-4">
            <img
              src={`${api}${doctor.profile_picture}`}
              alt="Doctor"
              className="rounded-xl w-52 h-48 max-sm:w-32 max-sm:h-32 mb-4 sm:mb-0 sm:mr-4 shadow-md object-contain"
            />
            <div className="space-y-3">
              <h2 className="text-xl font-bold">
                Dr. {doctor.first_name + " " + doctor.last_name}
              </h2>
              <p className="text-base text-[#AAA4A4]">
                {
                  dataSpecialization?.find(
                    (specialization) =>
                      specialization.id === doctor.specialization
                  )?.name
                }
              </p>
              <p className="text-base flex items-center text-[#484646]">
                <img src={Map} alt="Map" className="w-5 mr-2" />
                {doctor.main_hospital}
              </p>
            </div>
          </div>

          {/* ส่วน Summary (Years Experience, Patient, Reviews ฯลฯ) ปรับ flex-wrap สำหรับหน้าจอเล็ก */}
          <div className="flex flex-wrap justify-between max-sm:flex-col max-sm:items-start  items-center text-[#484646]">
            <p className="flex items-center mb-3 sm:mb-0">
              <img src={Experience} alt="Experience" className="pr-2" />
              {doctor.experience}+ years experienceยังไม่ได้ทำ
            </p>
            <span className="flex items-center mb-3 sm:mb-0">
              <img src={Patients} alt="Patients" className="pr-2" />
              <div className="text-center">
                <p>20 ยังไม่ได้ทำ</p>
                <p>patients ยังไม่ได้ทำ</p>
              </div>
            </span>
            <span className="flex items-center">
              <img src={Reviews} alt="Reviews" className="pr-2 w-10" />
              <div className="text-center pr-20">
                <p>5.0 ยังไม่ได้ทำ</p>
                <p>119 reviews ยังไม่ได้ทำ</p>
              </div>
            </span>
          </div>

          <p className="w-full pt-5">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
            aliqua...ยังไม่ได้ทำ
          </p>

          {/* เลือกวันเวลา Schedule */}
          <div className="w-full flex flex-col mb-4 pt-4 relative space-y-4">
            <h3 className="text-xl font-bold">Schedule</h3>
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <TextField
                label="Choose Date"
                value={selectedDate ? selectedDate.format("DD-MM-YYYY") : ""}
                onClick={() => setDatePickerOpen(true)}
                InputProps={{ readOnly: true }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                error={!!errors.selectedDate}
                helperText={errors.selectedDate}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "1rem",
                    borderColor: errors.selectedDate ? "red" : "",
                    cursor: "pointer",
                  },
                  "& .MuiFormLabel-root.Mui-error": { color: "red" },
                }}
              />
              <DatePicker
                className="datePicker z-50 w-full absolute left-55 max-sm:left-72 top-15"
                value={startdate}
                open={datePickerOpen}
                onOpenChange={setDatePickerOpen}
                onChange={(e) => handleDateChange(e)}
                disabledDate={(currentDate) => {
                  if (!currentDate) return false;

                  const isBeforeTomorrow = currentDate.isBefore(
                    dayjs().add(1, "day"),
                    "day"
                  );
                  const startOfWeek = dayjs().startOf("week"); // วันอาทิตย์นี้
                  const endOfWeek = dayjs().startOf("week").add(7, "days"); // วันเสาร์นี้

                  const isInThisWeek =
                    currentDate.isAfter(startOfWeek.subtract(1, "day")) &&
                    currentDate.isBefore(endOfWeek.add(1, "day"));
                  const dayOfWeek = currentDate.format("ddd"); // เอาวันของสัปดาห์ (เช่น "Sun", "Mon", ...)

                  const isDayAvailable = timeSlotDoctor
                    ?.map((time) => time.day_of_week)
                    ?.includes(dayOfWeek); // ตรวจสอบว่าเลือกวันได้หรือไม่จาก `timeSlotDoctor`

                  console.log("startOfWeek", startOfWeek);
                  console.log("endOfWeek", endOfWeek);
                  console.log("dayOfWeek", dayOfWeek);
                  console.log("currentDate", currentDate);
                  console.log("isDayAvailable", isDayAvailable);
                  console.log("isInThisWeek", isInThisWeek);
                  console.log("isBeforeTomorrow", isBeforeTomorrow);

                  return isBeforeTomorrow || !isInThisWeek || !isDayAvailable; // ห้ามเลือกวันก่อนพรุ่งนี้ และวันที่ไม่อยู่ในสัปดาห์นี้
                }}
              />
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-xl font-bold mb-2">Time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-5 pl-2 text-lg">
                {timeSlotDoctor
                  .find(
                    (time) =>
                      time.day_of_week === dayjs(selectedDate.$d).format("ddd")
                  )
                  ?.time_slots?.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time.id)}
                      className={`p-2 border-2 rounded-3xl ${
                        selectedtime === time.id && !isTimeSelected(time.id)
                          ? "bg-[#D9DFEA] border-[#465EA6]"
                          : isTimeSelected(time.id)
                          ? "bg-[#EBEBEB] border-[#D9D9D9] text-[#CDCDCD] cursor-default"
                          : "bg-[#EBEBEB] border-[#D9D9D9]"
                      }`}
                    >
                      {formatTimeRange(`${time.start_time}-${time.end_time}`)}
                    </button>
                  ))}
              </div>
              {errors.selectedTime && (
                <p className="text-red-500">{errors.selectedTime}</p>
              )}
            </div>
          )}

          <div className="flex justify-center items-center w-full mt-4">
            <button
              className="bg-[#465EA6] text-white py-2 px-4 rounded w-48"
              onClick={() => checkTime()}
            >
              Book Now
            </button>
          </div>

          {/* Modal */}
          <dialog
            id="my_modal_5"
            className="modal modal-middle w-screen h-screen z-50 bg-transparent"
          >
            <Toaster toastOptions={{ removeDelay: 500 }} />
            <div
              className={`modal-box bg-white ${
                state === 1
                  ? " h-[50%]  max-sm:!max-w-[90%]  sm:!max-w-[80%] max-md:!max-w-[60%] lg:!max-w-[45%]"
                  : state === 2
                  ? " max-sm:!max-w-[90%]  sm:!max-w-[80%] max-md:!max-w-[60%] lg:!max-w-[45%]"
                  : ""
              }`}
            >
              {state === 2 ? (
                // รายละเอียด Booking Overview
                <div>
                  <h3 className="font-medium text-2xl text-center text-[#465EA6]">
                    Booking Overview
                  </h3>
                  <h2 className="text-xl font-bold">
                    Dr. {doctor.first_name + " " + doctor.last_name}
                  </h2>
                  <p className="text-base text-[#AAA4A4]">
                    {
                      dataSpecialization?.find(
                        (specialization) =>
                          specialization.id === doctor.specialization
                      )?.name
                    }
                  </p>
                  <hr className="border-[1.5px] mt-5" />
                  <form
                    method="dialog"
                    className="flex flex-col justify-center items-center"
                    onSubmit={handleModalClose}
                  >
                    <div className="modal-action w-full h-full flex flex-col justify-center items-center">
                      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="flex items-center justify-center mb-4 md:mb-0">
                          <img src={Calendar} className="mr-2" />
                          <div>
                            <h1 className="font-medium text-lg text-[#484646]">
                              Schedule Appointment
                            </h1>
                            <p className="text-sm flex items-center text-[#AAA4A4]">
                              {formatDateMoadal(
                                dayjs(selectedDate?.$d).format("YYYY-MM-DD")
                              ) +
                                " | " +
                                formatTimeRange(
                                  timeslots?.find(
                                    (time) => time.id === selectedtime
                                  )?.start_time +
                                    "-" +
                                    timeslots?.find(
                                      (time) => time.id === selectedtime
                                    )?.end_time
                                )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 mb-4 md:mb-0">
                          <img src={IconProfile} className="mt-1 w-5" />
                          <div>
                            <p className="text-[#484646]">Patient Name</p>
                            <p className="text-sm flex items-center capitalize text-[#AAA4A4]">
                              {localStorage.getItem("fullname")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <img src={Email} className="mt-1 w-5" />
                          <div>
                            <p className="text-[#484646]">Doctor Email</p>
                            <p className="text-sm flex items-center ">
                              {doctor?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mt-7 w-full">
                        <img src={Reasonforconsultation} className="mt-1 w-5" />
                        <div className="w-full">
                          <p className="text-[#484646]">
                            Reason for consultation
                          </p>
                          <p className="text-sm text-[#AAA4A4] w-full md:w-[60%] break-all">
                            {diagnosis}
                          </p>
                        </div>
                      </div>

                      <div className="space-x-3 mt-4">
                        <button
                          className="bg-[#D9D9D9] w-48 max-sm:w-32 h-10 text-[#484646] rounded-full shadow-md"
                          onClick={() => setDiagnosis("")}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-[#465EA6] w-48 max-sm:w-32 h-10 text-white rounded-full shadow-md"
                          onClick={handleSubmit}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                // สถานะที่ 1 => ใส่เหตุผล
                <div className="flex flex-col w-full h-full justify-center items-center text-[#465EA6]">
                  <h2 className="text-2xl font-medium pb-3">
                    Reason for consultation
                  </h2>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue === "" || inputValue.trim() !== "") {
                        setDiagnosis(inputValue);
                      }
                    }}
                    maxLength={2000}
                    className="w-[90%] h-[70%] bg-[#DADDE4] rounded-3xl p-3 overflow-hidden border-2 border-[#465EA6] focus:border-[#465EA6] focus:outline-none hover:border-[#465EA6]"
                    placeholder="Enter diagnosis Notes"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    className="mt-4 bg-[#465EA6] text-white py-2 px-4 rounded-full w-48"
                    onClick={() => handleStateChange()}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={handleModalClose}>close</button>
            </form>
          </dialog>
        </div>
      </div>
    );
  }
};

export default DoctorDetail;
