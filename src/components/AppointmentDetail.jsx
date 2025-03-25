import Navbar from "./Navbar";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import { trimPath, formatISOToDate } from "../composables/Common";
import Calendar from "../Images/calendar.png";
import Clock from "../Images/clock.png";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import CancelAppointment from "../Images/CancelAppointment.png";
import { FormHelperText } from "@mui/material";
import {
  FetchAppointmentById,
  FetchTimeslots,
  UpdateAppointment,
  FetchCheckTimeSlotByDoctorId,
  AddReview,
  FetchReviewByAppointmentId,
  AddPrescription,
  FetchTimeslotsByDoctorId,
} from "../composables/Fetchdata";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { formatTimeRange } from "../composables/Common";
import { set, sub } from "date-fns";
import { SocketContext } from "../Context";
import Modals from "./Modals";
import { se } from "date-fns/locale";
import HeaderPageDetail from "./HeaderPageDetail";
import Appointmentstatus from "../Images/Appointmentstatus.png";
import IconProfile from "../Images/IconProfile.png";
import Email from "../Images/Email.png";
import Currentmedications from "../Images/Currentmedications.png";
import Allergies from "../Images/Allergies.png";
import Reasonforconsultation from "../Images/Reasonforconsultation.png";
import Prescription from "../Images/Prescription.png";
import Notes from "../Images/Notes.png";
import Dosage from "../Images/Dosage.png";
import Indications from "../Images/Indications.png";
import Instructions from "../Images/Instructions.png";
import Delect from "../Images/Del.png";
import Addmore from "../Images/Addmore.png";
import Weight from "../Images/Weight.png";
// import { set } from "date-fns";

import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "./LoadingPage";
const AppointmentDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    stream,
    myVideo,
    setTimeappointment,
    setStream,
  } = useContext(SocketContext);
  const api = process.env.REACT_APP_API_URL;
  const { stateCallModal } = useContext(SocketContext);
  const pathname = window.location.pathname;
  const id = pathname.split("/")[3];
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startdate, setStartDate] = useState();
  const [selectedDate, setSelectedDate] = useState(startdate);
  const [type, setType] = useState("");
  const [weekdays, setWeekDays] = useState(getCustomWeekDays(startdate));
  const [appointmenttime, setAppoinmentTime] = useState("");
  const [selectedtime, setSelectedTime] = useState(null);
  const [showpicker, setShowpicker] = useState(false);
  const [state, setState] = useState(1);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const [timeslotsforchecktime, setTimeslotsforchecktime] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [error, setError] = useState(null);
  const [stateTypeButton, setStateTypeButton] = useState("");
  const textareaRef = useRef(null);
  const [selectBtn, setSelectBtn] = useState(false);
  const [timeDoge, setTimeDoge] = useState([]);
  const [cournter, setCournter] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [statusReview, setStatusReview] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [timeSlotDoctor, setTimeSlotDoctor] = useState([]);
  const [statusAccept, setStatusAccept] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // เริ่มการโหลดข้อมูล
        setIsLoading(true);
        // Dismiss any existing toast before showing the new one
        toast.dismiss();

        const response = await FetchAppointmentById(id);
        if (response === 404) {
          toast.error("The requested page is not available!", {
            autoClose: 500, // หายไปใน 500ms
            removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
          });
          setTimeout(() => {
            navigate("/appointment"); // เปลี่ยนหน้าไปหน้าการนัดหมาย
          }, 1000); // รอให้ Toast แสดงก่อน
        } else {
          
          // setStartDate(dayjs(response.appointment_date));
          // setSelectedDate(dayjs(response.appointment_date));

          const date = dayjs(new Date()).format("YYYY-MM-DD");
          if(date == dayjs(new Date(response.appointment_date)).format("YYYY-MM-DD")){
          setStartDate(dayjs(new Date(response.appointment_date)).add(1, "day"));
          setSelectedDate(dayjs(new Date(response.appointment_date)).add(1, "day"));
          }else{
            setStartDate(dayjs(new Date(response.appointment_date)));
          setSelectedDate(dayjs(new Date(response.appointment_date)));
          }
          
          setWeekDays(getCustomWeekDays(dayjs(response.appointment_date)));
          setAppoinmentTime(response.time_slot?.start_time);
          setType(response.status);
          setData(response);
          setDiagnosis(response.diagnosisNotes);
          setPrescriptions(response.prescription);
          setSelectedPrescription(response.prescription[0]);

          if (localStorage.getItem("role") === "patient") {
            const reviewResponse = await FetchReviewByAppointmentId(id);
            setStatusReview(reviewResponse === 200);
            const timeslotData = await FetchTimeslotsByDoctorId(
              response.doctorId.id
            );
            setTimeSlotDoctor(timeslotData);

          }

          setIsLoading(false); // ปิดสถานะการโหลดเมื่อข้อมูลถูกโหลดเสร็จ
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        setTimeout(() => {
          navigate("/appointment"); // เปลี่ยนหน้าไปหน้าการนัดหมาย
          toast.dismiss();
        }, 1000);
      }
    };

    fetchData();
  }, [id]);

  const handleRating = (value) => {
    setRating(value);
  };

  const [drugs, setDrugs] = useState([
    {
      id: Date.now(), // ให้ id ไม่ซ้ำกัน
      drugName: "",
      dosage: "",
      indication: "",
      timeOfDay: "",
      amount: 1,
      unit: "",
      notes: "",
      mealTiming: "before meal",
    },
  ]);
  
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const handleDateChange = (date) => {
    if (date != null) {
      setStartDate(date);
      setSelectedDate(date);
      FetchCheckTimeSlotByDoctorId(formatISOToDate(date.$d), id).then(
        (data) => {
          if (data != 404) {
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
      setAppoinmentTime(time);
      setSelectedTime(time);
    }
  };

  function getCustomWeekDays(startDate) {
    const daysofweek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const weekdayslist = [];
    // const today = new Date();
    const today = dayjs().add(1, "day").$d;
    // Set time of today to midnight to compare only the date part
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i);

      // Set time of currentDate to midnight to compare only the date part
      currentDate.setHours(0, 0, 0, 0);

      const isPast = currentDate < today;
      const dayobject = {
        dayname: daysofweek[currentDate.getDay()],
        daynumber: currentDate.getDate(),
        monthname: monthsOfYear[currentDate.getMonth()],
        isPast,
      };

      weekdayslist.push(dayobject);
    }

    return weekdayslist;
  }
  const handleEditAndConfirm = () => {
    if (state == 1) {
      setState(2);
      FetchTimeslots().then((datas) => {
        setSelectedTime(
          datas?.filter(
            (time) => time.start_time == data.time_slot.start_time
          )[0].id
        );
        setTimeslots(datas);
      });
      FetchCheckTimeSlotByDoctorId(
        formatISOToDate(startdate.$d),
        data.doctorId.id
      ).then((data) => {
        if (data != 404) {
          setTimeslotsforchecktime(data);
        } else {
          setTimeslotsforchecktime([]);
        }
      });
    } else {
      setStateTypeButton("confirm");

      if (diagnosis.length != 0) {
        document.getElementById("my_modal_5").showModal();
      } else {
        setError("Please enter diagnosis");
      }

      // }
    }
  };
  const handleCancel = () => {
    setStateTypeButton("cancel");
    if (state == 1) {
      document.getElementById("my_modal_5").showModal();
    } else {
      setAppoinmentTime(data.time_slot.start_time);
      setSelectedTime(null);
      setState(1);
    }
  };
  const handleSubmitCancel = () => {
    data.time_slot = null;
    data.appointment_date = data.appointment_date;
    data.doctorId = data.doctorId?.id;
    data.patientId = data.patientId?.id;
    data.status = "Cancelled";
    UpdateAppointment(data, id).then((response) => {
      if (response == 200) {
        toast.success("Appointment cancelled successfully.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        // setState(3)
        setTimeout(() => {
          navigate("/appointment");
          toast.dismiss();
        }, 1000);
      } else {
        toast.error("Failed to cancel appointment. Please try again.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        setTimeout(() => {
          toast.dismiss();
        }, 1000);
      }
    });
  };
  const isTimeSelected = (timeId) => {
    return timeslotsforchecktime?.some(
      (selectedTimeSlot) => selectedTimeSlot?.time_slot?.id === timeId // Ensure all properties are safely accessed
    );
  };

  function minutesLeft() {
    if (data?.time_slot?.start_time) {
      const now = new Date(); // เวลาปัจจุบัน
      const target = new Date(
        data.appointment_date + "T" + data.time_slot?.start_time
      ); // เวลาเป้าหมาย
      const difference = target - now; // คำนวณเวลาที่เหลือ (มิลลิวินาที)

      if (difference <= 0) {
        // return "Time's up or has already passed!";
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return `Time left: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
      }
    }
  }
  const getUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream); // ตั้งค่า stream ที่ได้รับ
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };
  const handleSubmitCormfirm = () => {
    data.time_slot = selectedtime;
    data.appointment_date = formatISOToDate(selectedDate.$d);
    data.doctorId = data.doctorId?.id;
    data.patientId = data.patientId?.id;
    data.diagnosisNotes = diagnosis;
    UpdateAppointment(data, id).then((response) => {
      if (response == 200) {
        toast.success("Appointment updated successfully.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        FetchAppointmentById(id).then((response) => {
          if (response == 404) {
            navigate("/appointment");
          } else {
            setStartDate(dayjs(response.appointment_date));
            setSelectedDate(dayjs(response.appointment_date));
            setWeekDays(getCustomWeekDays(dayjs(response.appointment_date)));
            setAppoinmentTime(response.time_slot.start_time);
            setData(response);
            FetchTimeslots().then((data) => {
              console.log(1);
              setSelectedTime(
                data.filter(
                  (time) => time.start_time == response.time_slot.start_time
                )[0].id
              );
              setTimeslots(data);
            });
          }
        });
        setState(1);
      } else {
        toast.error("Failed to update appointment. Please try again.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
      }
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    });
  };

  useEffect(() => {
    if (stream?.active) {
      callUser(
        `${data.patientId.first_name} ${data.patientId.last_name}`,
        data.doctorId.specialization,
        data
      ); // เรียกใช้ callUser เมื่อ stream มีค่า
    }
  }, [stream]);
  useEffect(() => {
    if (diagnosis.length > 0) {
      setError(null);
    }
    if (textareaRef.current) {
      // รีเซ็ตความสูงเพื่อให้ textarea ขยายใหม่ตามเนื้อหาทุกครั้ง
      textareaRef.current.style.height = "auto";
      // ตั้งความสูงตาม scrollHeight ของเนื้อหาภายใน
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [diagnosis]);
  useEffect(() => {
    if (state == 2) {
      if (textareaRef.current) {
        // รีเซ็ตความสูงเพื่อให้ textarea ขยายใหม่ตามเนื้อหาทุกครั้ง
        textareaRef.current.style.height = "auto";
        // ตั้งความสูงตาม scrollHeight ของเนื้อหาภายใน
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [state]);
  useEffect(() => {
    if (callAccepted) {
      navigate("/videocall");
    }
  }, [callAccepted]);
  function joinMeeting() {
    if (minutesLeft() != undefined) {
      // eslint-disable-next-line no-restricted-globals
      // if (confirm(minutesLeft()) == true) {
      //   getUserMedia();
      // }
      document.getElementById("my_modal_6").showModal();
    } else {
      getUserMedia();
    }
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const customFormattedDate = `${day} ${month}. ${year}`;
    return customFormattedDate;
  }
  const selectTimeDoge = (time, id) => {
    setDrugs((prevDrugs) =>
      prevDrugs.map((drug) =>
        drug.id === id
          ? {
              ...drug,
              timeOfDay: drug.timeOfDay.includes(time)
                ? drug.timeOfDay.filter((t) => t !== time) // เอาเวลาออก
                : [...drug.timeOfDay, time], // เพิ่มเวลาใหม่
            }
          : drug
      )
    );
  };
  const addDrug = () => {
    setDrugs([
      ...drugs,
      {
        id: Date.now(), // ให้ id ไม่ซ้ำกัน
        drugName: "",
        dosage: "",
        indication: "",
        timeOfDay: [],
        amount: 1,
        unit: "",
        notes: "",
        mealTiming: "before meal",
      },
    ]);
    console.log(drugs);
  };

  // ลบ Drug โดยใช้ id
  const deleteDrug = (id) => {
    setDrugs(drugs.filter((drug) => drug.id !== id));
  };

  // แก้ไขข้อมูล Drug
  const handleChange = (id, field, value) => {
    // อัพเดตข้อมูลของ drugs
    setDrugs(
      drugs.map((drug) => (drug.id === id ? { ...drug, [field]: value } : drug))
    );
    const updatedErrors = { ...formErrors };

    console.log(
      updatedErrors[`${field}-${drugs.findIndex((d) => d.id === id)}`]
    );
    console.log("====================================");
    // ลบข้อผิดพลาดที่เกี่ยวข้องกับฟิลด์นั้นเมื่อมีการเปลี่ยนแปลงค่า
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`${field}-${drugs.findIndex((d) => d.id === id)}`]; // ลบข้อผิดพลาดเฉพาะฟิลด์ที่มีการแก้ไข
      return updatedErrors;
    });
  };

  const handleReviewSubmit = () => {
    const reviewData = {
      rating: rating,
      notes: review,
      isAnonymous: anonymous,
      appointmentId: id,
    };
    AddReview(reviewData).then((response) => {
      if (response == 201) {
        toast.success("Review submitted successfully.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        FetchReviewByAppointmentId(id).then((response) => {
          response == 200 ? setStatusReview(true) : setStatusReview(false);
        });
        // navigate("/appointment");
      } else {
        toast.error("Failed to submit the review. Please try again.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
      }
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    });
  };

  const submitprescription = async () => {
    const appointmentId = id;
    const errors = {};

    drugs.forEach((drug, index) => {
      if (!drug.drugName) errors[`drugName-${index}`] = "Drug Name is required";
      if (!drug.dosage) errors[`dosage-${index}`] = "Dosage is required";
      if (!drug.amount) errors[`amount-${index}`] = "Amount is required";
      if (!drug.indication)
        errors[`indication-${index}`] = "Indication is required";
      // if (!drug.notes) errors[`notes-${index}`] = "Notes are required";
      if (!drug.unit) errors[`unit-${index}`] = "Unit is required";
      if (!Array.isArray(drug.timeOfDay) || drug.timeOfDay.length === 0) {
        errors[`timeOfDay-${index}`] =
          "At least one time of day must be selected";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      const drugsWithAppointmentId = drugs.map(({ id, ...drug }) => ({
        ...drug,
        appointmentId: Number(appointmentId),
      }));
      AddPrescription(drugsWithAppointmentId).then((response) => {
        if (response === 201) {
          toast.success("Prescription added successfully.", {
            autoClose: 500, // หายไปใน 500ms
            removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
          });
          setTimeout(() => {
            toast.dismiss();
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Failed to submit prescriptions. Please try again.", {
            autoClose: 500, // หายไปใน 500ms
            removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
          });
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      });
    }
  };
  function calculateAge(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // ปรับเดือนและวัน
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // จำนวนวันในเดือนก่อนหน้า
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} y ${months} m ${days} d`;
  }
  const handleAcceptDecline = () => {
    data.doctorId = data.doctorId?.id;
    data.patientId = data.patientId?.id;
    data.time_slot = data.time_slot?.id;
    data.status = statusAccept ? "Upcoming" : "Cancelled";
    console.log(data);

    UpdateAppointment(data, id).then((response) => {
      if (response == 200) {
        toast.success("Appointment updated successfully.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
        FetchAppointmentById(id).then((response) => {
          if (response == 404) {
            navigate("/appointment");
          } else {
            setTimeout(() => {
              toast.dismiss();
              window.location.reload();
            }, 1100);
          }
        });
      } else {
        toast.error("Failed to update appointment. Please try again.", {
          autoClose: 500, // หายไปใน 500ms
          removeDelay: 500, // เลื่อนการลบ Toast เพื่อให้แสดงครบเวลา
        });
      }
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    });
  };
  if (isLoading) {
    return (
      <div>
        <Toaster
          toastOptions={{
            removeDelay: 500,
          }}
        />
        <LoadingPage />
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex bg-gray-100 cursor-default text-[#484646] ">
        {stateCallModal && <Modals type="call" />}
        <Toaster
          toastOptions={{
            removeDelay: 500,
          }}
        />
        <div className="md:w-1/5 h-screen fixed top-0 left-0">
        <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
        </div>
        <div className="md:w-4/5 w-full  md:ml-[20%] overflow-y-auto flex flex-col md:pr-14 p-2 pt-5 pl-12 pb-2">
          <HeaderPageDetail page="appointmentdetail" />
          <hr className="border-2" />
          <div className="w-full flex  items-center pt-5 space-x-5">
            <img
              src={
                localStorage.getItem("role") == "patient"
                  ? `${api}${data.doctorId?.profile_picture}`
                  : `${api}${data.patientId?.profile_picture}`
              }
              alt={
                localStorage.getItem("role") == "patient"
                  ? "ProfileDoctor"
                  : "ProfilePatient"
              }
              className="w-24 h-24 rounded-full bg-[#D9D9D9]"
            />
            <div>
              <h1 className="font-bold text-lg text-[#465EA6]">
                Schedule Appointment
              </h1>
              <p className="text-sm flex items-center text-black">
                <img src={Calendar} className="mr-2 " />{" "}
                {data.time_slot?.start_time
                  ? `${formatDate(data.appointment_date)} | 
                  ${formatTimeRange(
                    `${data.time_slot?.start_time}-${data.time_slot?.end_time}`
                  )}`
                  : formatDate(data.appointment_date)}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-between items-center pt-6">
            <div className="flex items-center space-x-5">
              <p className="w-12 h-12 rounded-3xl bg-[#DDE0E8] flex items-center justify-center">
                <img
                  src={Appointmentstatus}
                  alt="Appointmentstatus"
                  className="w-6 h-6 "
                />
              </p>
              <div className="text-[#484646]">
                <h2 className=" font-bold text-base ">Appointment Status</h2>
                <p className="text-sm flex items-center ">
                  {" "}
                  HN: 67-002245 ยังไม่ได้ทำ
                </p>
              </div>
            </div>
            {/* {localStorage.getItem("role") == "patient" && ( */}
            <p
              className={`w-32 h-10 flex justify-center items-center rounded-full text-white text-base font-semibold
               ${
                 type == "Upcoming"
                   ? "bg-[#465EA6]"
                   : type == "Completed"
                   ? "bg-[#53C070]"
                   : type == "Cancelled"
                   ? "bg-[#D95448]"
                   : "bg-[#BEBEBE]"
               } `}
            >
              {type == "Scheduled" ? "Upcoming" : type}
            </p>
            {/* )} */}
          </div>
          <h1 className="font-bold text-lg pt-5 ">
            {localStorage.getItem("role") == "patient"
              ? "Dr." +
                " " +
                data.doctorId?.first_name +
                " " +
                data.doctorId?.last_name
              : data.patientId?.first_name + " " + data.patientId?.last_name}
          </h1>
          {localStorage.getItem("role") == "patient" ? (
            <p className="  text-sm  text-[#AAA4A4]">
              {" "}
              {data?.doctorId?.specialization?.name}
            </p>
          ) : (
            ""
          )}
          <hr className="border-2 mt-5" />
          <div className="w-full flex max-sm:flex-col max-sm:space-y-4 justify-between sm:items-center pt-5 text-[#AAA4A4]">
            <div className="flex items-start space-x-3">
              <img
                src={
                  localStorage.getItem("role") == "patient"
                    ? Calendar
                    : IconProfile
                }
                className="mt-1 w-5"
              />
              {localStorage.getItem("role") == "patient" ? (
                <div>
                  <p className="text-[#484646]">Scheduled appointment date</p>
                  <p className="text-sm flex items-center ">
                    {formatDate(data.appointment_date) +
                      " | " +
                      formatTimeRange(
                        `${data.time_slot?.start_time}-${data.time_slot?.end_time}`
                      )}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[#484646]">Patient Name</p>
                  <p className="text-sm flex items-center ">
                    {data.patientId?.first_name +
                      " " +
                      data.patientId?.last_name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <img
                src={
                  localStorage.getItem("role") == "patient"
                    ? IconProfile
                    : Email
                }
                className="mt-1 w-5"
              />
              {localStorage.getItem("role") == "patient" ? (
                <div>
                  <p className="text-[#484646]">Patient Name</p>
                  <p className="text-sm flex items-center ">
                    {data.patientId?.first_name +
                      " " +
                      data.patientId?.last_name}{" "}
                    ({calculateAge(data.patientId?.date_of_birth)})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[#484646]">Patient Email</p>
                  <p className="text-sm flex items-center ">
                    {data.patientId?.email}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <img
                src={localStorage.getItem("role") == "patient" ? Email : Weight}
                className="mt-1 w-5"
              />
              {localStorage.getItem("role") == "patient" ? (
                <div>
                  <p className="text-[#484646]">Doctor Email</p>
                  <p className="text-sm flex items-center ">
                    {data?.doctorId?.email}
                    {/* ใส่ด้วย */}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[#484646]">Weight</p>
                  <p className="text-sm flex items-center ">
                    {data?.patientId?.weight}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 mt-7 w-full">
            <img src={Reasonforconsultation} className="mt-1 w-5" />
            <div className="w-full">
              <p className="text-[#484646]">Reason for consultation</p>
              {state == 1 ? (
                <p className="text-sm text-[#AAA4A4]  w-[60%] break-all">
                  {data.diagnosisNotes}
                </p>
              ) : (
                <div className="w-full ">
                  {error && <p className="text-red-500">{error}</p>}
                  <textarea
                    ref={textareaRef}
                    name=""
                    id=""
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value.trim())}
                    maxLength={2000}
                    className="w-full bg-[#E2E2E2] rounded-3xl text-start p-3 pb-5 resize-none"
                    style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    placeholder="Enter diagnosis Notes"
                  ></textarea>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-3 mt-7 w-full">
            <img src={Allergies} className="mt-1 w-5" />
            <div>
              <p className="text-[#484646]">Allergies</p>
              <p className="text-sm flex items-center text-[#AAA4A4] ">
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. */}
                {data.patientId?.allergies}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 mt-7 w-full">
            <img src={Currentmedications} className="mt-1 w-5" />
            <div>
              <p className="text-[#484646]">Current medications</p>
              <p className="text-sm flex items-center text-[#AAA4A4] ">
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. */}
                {data.patientId?.current_medications}
              </p>
            </div>
          </div>
          {data.status == "Completed" && <hr className="border-2 mt-5" />}
          {/* add drung */}

          {/* ADDPrescription */}
          {data.status == "Completed" &&
            localStorage.getItem("role") == "doctor" && (
              <div className="w-full mt-5 ">
                <div className=" w-full flex justify-between items-center ">
                  <p>Prescription</p>
                  <div className="flex items-center space-x-3">
                    <div className="space-x-5 pr-5 flex items-center ">
                      <button
                        className="border-2 rounded-full border-[#DCDCDC] text-black w-24 h-10 pt-1 pb-1"
                        //  onClick={()=>setState(0)}
                        onClick={() => window.location.reload()}
                      >
                        Cancel
                      </button>
                      <button
                        className="border-2 rounded-full bg-[#465EA6] text-white w-24 h-10  p-5 pt-1 pb-1"
                        // onClick={submitUpdate}
                        onClick={submitprescription}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {drugs.map((drug, index) => (
                  <div
                    key={index}
                    className="w-full space-y-5 mt-3 border rounded-xl pl-5 pr-5 pt-2 border-[#465EA6] pb-5"
                  >
                    <div className="flex justify-between items-center">
                      <p>Drug Details</p>
                      <img
                        src={Delect}
                        alt="Delect"
                        className="w-5 cursor-pointer"
                        onClick={() => deleteDrug(drug.id)}
                      />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-5">
                      <TextField
                        sx={{
                          "& .MuiInputBase-root": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`drugName-${index}`]
                              ? "red"
                              : "#465EA6",
                          },
                        }}
                        className="w-full rounded-3xl"
                        label="Drug Name"
                        value={drug.drugName}
                        onChange={(e) =>
                          handleChange(drug.id, "drugName", e.target.value)
                        }
                        error={!!formErrors[`drugName-${index}`]}
                        helperText={formErrors[`drugName-${index}`]}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                      <TextField
                        sx={{
                          "& .MuiInputBase-root": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`dosage-${index}`]
                              ? "red"
                              : "#465EA6",
                          },
                        }}
                        className="w-full rounded-3xl"
                        label="Dosage"
                        value={drug.dosage}
                        onChange={(e) =>
                          handleChange(drug.id, "dosage", e.target.value)
                        }
                        error={!!formErrors[`dosage-${index}`]}
                        helperText={formErrors[`dosage-${index}`]}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <TextField
                        sx={{
                          "& .MuiInputBase-root": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`indication-${index}`]
                              ? "red"
                              : "#465EA6",
                          },
                        }}
                        className="w-full rounded-3xl"
                        label="Indication"
                        value={drug.indication}
                        onChange={(e) =>
                          handleChange(drug.id, "indication", e.target.value)
                        }
                        error={!!formErrors[`indication-${index}`]}
                        helperText={formErrors[`indication-${index}`]}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </div>
                    <p>Drug Administration</p>
                    <div className="w-full grid grid-cols-2 gap-5">
                      <TextField
                        sx={{
                          "& .MuiInputBase-root": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`amount-${index}`]
                              ? "red"
                              : "#465EA6",
                          },
                        }}
                        className="w-full rounded-3xl"
                        label="Amount"
                        type="number"
                        value={drug.amount === 0 ? "" : drug.amount} // แสดงค่าว่างถ้าเป็น 0
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChange(
                            drug.id,
                            "amount",
                            value === "" ? "" : Math.max(0, value)
                          );
                        }}
                        onInput={(e) => {
                          if (e.target.value < 0) e.target.value = 0;
                        }}
                        error={!!formErrors[`amount-${index}`]}
                        helperText={formErrors[`amount-${index}`]}
                      />

                      <FormControl
                        fullWidth
                        sx={{
                          "& .MuiInputBase-root ": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`unit-${index}`]
                              ? "red"
                              : "#465EA6", // เพิ่มการเปลี่ยนสี border
                          },
                        }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Unit
                        </InputLabel>
                        <Select
                          value={drug.unit}
                          label="Unit"
                          onChange={(e) =>
                            handleChange(drug.id, "unit", e.target.value)
                          }
                          error={!!formErrors[`unit-${index}`]} // แสดงข้อผิดพลาดถ้ามี
                        >
                          <MenuItem value="tablet">tablet</MenuItem>
                          <MenuItem value="capsule">capsule</MenuItem>
                          <MenuItem value="mL">mL</MenuItem>
                          <MenuItem value="g">g</MenuItem>
                          <MenuItem value="drop">drop</MenuItem>
                          <MenuItem value="puff">puff (ยาพ่น)</MenuItem>
                          <MenuItem value="patch">patch (แผ่นแปะยา)</MenuItem>
                        </Select>
                        {formErrors[`unit-${index}`] && (
                          <FormHelperText error>
                            {formErrors[`unit-${index}`]}
                          </FormHelperText> // แสดงข้อความข้อผิดพลาด
                        )}
                      </FormControl>
                    </div>
                    <div className="w-full flex items-center justify-center space-x-3">
                      <button
                        className={`border rounded-full border-[#465EA6]    h-10   pt-1 pb-1 p-5 ${
                          drugs.find((d) => d.id === drug.id)?.mealTiming ==
                          "before meal"
                            ? "bg-[#465EA6] text-white"
                            : "text-[#484646]"
                        } `}
                        onClick={() => [
                          // setSelectBtn(!selectBtn),
                          handleChange(drug.id, "mealTiming", "before meal"),
                        ]}
                      >
                        Before meals
                      </button>
                      <button
                        className={`border rounded-full border-[#465EA6]   h-10   pt-1 pb-1 p-5 ${
                          drugs.find((d) => d.id === drug.id)?.mealTiming ==
                          "after meal"
                            ? "bg-[#465EA6] text-white"
                            : "text-[#484646]"
                        } `}
                        onClick={() => [
                          // setSelectBtn(!selectBtn),
                          handleChange(drug.id, "mealTiming", "after meal"),
                        ]}
                      >
                        After meals
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center space-x-3">
                      <div className="w-full flex items-center justify-center">
                        {["Morning", "Afternoon", "Evening"].map((time) => (
                          <span
                            key={time} // เพิ่ม key เพื่อหลีกเลี่ยงข้อผิดพลาดใน React
                            className="flex items-center space-x-2"
                            onClick={() => selectTimeDoge(time, drug.id)}
                          >
                            <p
                              className={`rounded-full w-5 h-5 border border-[#465EA6] ml-2 pr-2 ${
                                Array.isArray(drug?.timeOfDay) &&
                                drug.timeOfDay.includes(time)
                                  ? "bg-[#465EA6]"
                                  : ""
                              }`}
                            ></p>
                            <button>{time}</button>
                          </span>
                        ))}
                      </div>
                      {formErrors[`timeOfDay-${index}`] && (
                        <div className="text-red-500 text-sm mt-1">
                          {formErrors[`timeOfDay-${index}`]}{" "}
                          {/* แสดงข้อผิดพลาด */}
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <TextField
                        sx={{
                          "& .MuiInputBase-root": {
                            "border-radius": "1rem",
                            borderColor: formErrors[`notes-${index}`]
                              ? "red"
                              : "#465EA6",
                          },
                        }}
                        className="w-full rounded-3xl"
                        label="Note"
                        value={drug.notes}
                        onChange={(e) =>
                          handleChange(drug.id, "notes", e.target.value)
                        }
                        error={!!formErrors[`notes-${index}`]}
                        helperText={formErrors[`notes-${index}`]}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </div>
                  </div>
                ))}

                <span
                  className="flex items-center space-x-3 mt-5 cursor-pointer "
                  onClick={addDrug}
                >
                  <img src={Addmore} alt="Addmore" className="w-5" />
                  <p>Add More Drug</p>
                </span>
              </div>
            )}
          {data.status == "Completed" &&
            localStorage.getItem("role") == "patient" &&
            !statusReview && (
              <div className="flex flex-col  justify-center  p-4 w-full">
                {/* <hr className="border-[1.5px] mt-5 mb-10 w-[95%]" /> */}
                <h1 className="font-medium text-2xl mb-5">Write a review</h1>
                <div className="bg-white shadow-md rounded-2xl  p-6 w-full border-2 border-[#465EA6]">
                  <h2 className="text-lg font-semibold mb-4">Doctor Service</h2>
                  <div className="w-full flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        onClick={() => handleRating(star)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={star <= rating ? "gold" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-8 h-8 cursor-pointer ${
                          star <= rating ? "text-yellow-500" : "text-gray-400"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.417 8.403L12 18.896l-7.417 4.104L6 15.597 0 9.75l8.332-1.595L12 .587z"
                        />
                      </svg>
                    ))}
                  </div>

                  <TextField
                    // disabled={state === 0}
                    id="outlined-textarea"
                    //  multiline
                    className="w-full rounded-3xl"
                    label="Write your review"
                    placeholder="Would you like to write anything about the service with this doctor?"
                    value={review}
                    inputProps={{
                      maxLength: 400,
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        "border-radius": "1rem",
                        // "height": "100px",
                        overflow: "hidden",
                      },
                    }}
                    onChange={(e) => setReview(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <span className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={() => setAnonymous(!anonymous)}
                      // checked={selectedAllDays}
                      class="checkbox   w-4 rounded-md h-4 border-2 border-[#D9D9D9] [--chkbg:theme(colors.indigo.600)] [--chkfg:#465EA6] checked:border-[#465EA6]"
                    />

                    <p className="font-medium">Leave your review anonymously</p>
                  </span>
                  <div className="w-full flex justify-center items-center mt-4">
                    <button
                      className="bg-[#465EA6] text-white px-4 py-2 rounded-full "
                      onClick={handleReviewSubmit}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          {/* ShowPrescription */}
          {prescriptions.length > 0 && (
            <div className="w-full flex mt-5  ">
              <div className="w-1/3">
                <p>Prescription</p>
                <div className="w-full space-y-2 mt-3">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className={`flex max-sm:flex-col items-center  p-2 rounded-2xl cursor-pointer md:w-40 lg:w-52 w-28 ${
                        selectedPrescription.id === prescription.id
                          ? "bg-[#D9DFEA] border-[#465EA6] border-2"
                          : "hover:bg-gray-100 "
                      }`}
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      {/* <span className="text-2xl mr-4">💊</span> */}
                      <img
                        src={Prescription}
                        alt="Prescription"
                        className="w-8 mr-3 ml-4 "
                      />
                      <div>
                        <h4 className="text-sm font-semibold max-sm:text-xs">
                          {prescription.drugName}
                        </h4>
                        <p className="text-xs text-[#484646]">
                          {prescription.dosage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-2/3 text-[#484646] ">
                <p>Drug Administration </p>
                <div className="space-y-4 w-full mt-3">
                  <div className=" w-full flex items-center space-x-3">
                    <img src={Indications} alt="Indications" className="w-6 " />
                    <div>
                      <p className="font-semibold text-[#AAA4A4]">
                        Indications
                      </p>
                      <p>{selectedPrescription?.indication}</p>
                    </div>
                  </div>
                  <div className=" w-full flex items-center space-x-3">
                    <img src={Dosage} alt="Dosage" className="w-6 " />
                    <div>
                      <p className="font-semibold text-[#AAA4A4]">Dosage</p>
                      <p>
                        {selectedPrescription?.amount +
                          " " +
                          selectedPrescription?.unit}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full flex items-center space-x-3">
                    <img
                      src={Instructions}
                      alt="Instruction"
                      className="w-6 "
                    />
                    <div>
                      <p className="font-semibold text-[#AAA4A4]">
                        Instructions
                      </p>
                      <p>
                        Take {selectedPrescription?.mealTiming},{" "}
                        {selectedPrescription?.timeOfDay.join(" and ")}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full flex items-center space-x-3">
                    <img src={Notes} alt="Notes" className="w-6 " />
                    <div>
                      <p className="font-semibold text-[#AAA4A4]">Notes</p>
                      <p>{selectedPrescription?.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Rating */}

          {type == "Upcoming" && (state == 2 || state == 3) && (
            <div className=" ">
              <div className=" w-full flex flex-col justify-center  items-start mb-4 pt-4 relative space-y-4">
                <h3 className="text-xl font-bold">Schedule</h3>
                <div className="w-1/3">
                  <TextField
                    label="Choose Date"
                    value={
                      selectedDate ? selectedDate.format("DD-MM-YYYY") : ""
                    }
                    onClick={() => setDatePickerOpen(true)}
                    InputProps={{
                      readOnly: true, // ทำให้พิมพ์ไม่ได้
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    error={!!errors.selectedDate}
                    helperText={errors.selectedDate}
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "1rem",
                        borderColor: errors.selectedDate ? "red" : "",
                        cursor: "pointer", // ให้รู้ว่าสามารถกดได้
                      },
                      "& .MuiFormLabel-root.Mui-error": {
                        color: "red",
                      },
                    }}
                    className="w-full"
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
              <h3 className="text-xl font-bold mb-2">Time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-5 pl-2 text-lg ">
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
            </div>
          )}
          {type == "Upcoming" && localStorage.getItem("role") == "patient" && (
            <div className="flex justify-center items-center w-full space-x-16 font-bold">
              <button
                className={`mt-4  bg-[#D95448] text-white px-4 py-2 rounded-full ml-4 ${
                  state != 1 ? "w-40" : "w-52"
                }`}
                onClick={() => handleCancel()}
              >
                {state == 1 ? "Cancel Appointment" : "Cancel"}
              </button>
              <button
                className={`mt-4  bg-[#465EA6] text-white px-4 py-2 rounded-full ml-4 ${
                  state != 1 ? "w-40" : "w-52"
                }`}
                onClick={() => handleEditAndConfirm()}
              >
                {state == 1 ? "Edit Appointment" : "Confirm"}
              </button>
            </div>
          )}
          {localStorage.getItem("role") == "doctor" && type == "Upcoming" && (
            <div className="flex justify-center items-center w-full space-x-16 font-bold">
              <button
                className="mt-4 w-40 bg-[#465EA6] text-white px-4 py-2 rounded"
                onClick={joinMeeting}
              >
                Join Meeting
              </button>
            </div>
          )}
          {type == "Pending" && localStorage.getItem("role") == "doctor" && (
            <div className="flex justify-center items-center w-full space-x-16 font-bold">
              <button
                className="mt-4 w-40 bg-[#D95448] text-white px-4 py-2 rounded"
                onClick={() => {
                  document.getElementById("my_modal_7").showModal();
                  setStatusAccept(false);
                }}
              >
                Decline
              </button>
              <button
                className="mt-4 w-40 bg-[#465EA6] text-white px-4 py-2 rounded"
                onClick={() => {
                  document.getElementById("my_modal_7").showModal();
                  setStatusAccept(true);
                }}
              >
                Accept
              </button>
            </div>
          )}
        </div>
        <dialog
          id="my_modal_5"
          className="modal modal-bottom sm:modal-middle w-screen h-screen"
        >
          {state !== 3 ? (
            <div className="modal-box bg-white flex flex-col justify-center">
              <h3 className="font-bold text-2xl text-center">
                {stateTypeButton === "confirm"
                  ? "Are you sure you want to update this appointment?"
                  : "Do you want to cancel?"}
              </h3>
              <form
                method="dialog"
                className="flex justify-center items-center"
              >
                <div className="modal-action">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                  <div className="space-x-3">
                    <button className="bg-[#D9D9D9] w-32 h-10 text-[#484646] rounded-xl shadow-md">
                      Cancel
                    </button>
                    <button
                      className={`${
                        stateTypeButton === "confirm"
                          ? "bg-[#59A670]"
                          : "bg-[#D95448]"
                      } w-32 h-10 text-white rounded-xl shadow-md`}
                      onClick={
                        stateTypeButton === "confirm"
                          ? handleSubmitCormfirm
                          : handleSubmitCancel
                      }
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="modal-box bg-white h-[20%] flex !justify-center !items-center">
              <h3 className="font-bold text-2xl text-center">Cancel Success</h3>
            </div>
          )}
        </dialog>

        <dialog
          id="my_modal_6"
          className="modal modal-bottom sm:modal-middle w-screen h-screen"
        >
          {state !== 3 ? (
            <div className="modal-box bg-white flex flex-col justify-center">
              <h3 className="font-bold text-2xl text-center">
                You want to call this patient now?
              </h3>
              <p className="py-4 text-center text-lg">{minutesLeft()}</p>
              <form
                method="dialog"
                className="flex justify-center items-center"
              >
                <div className="modal-action">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                  <div className="space-x-3">
                    <button className="bg-[#D9D9D9] w-32 h-10 text-[#484646] rounded-xl shadow-md">
                      Cancel
                    </button>
                    <button
                      className="bg-[#465EA6] w-32 h-10 text-white rounded-xl shadow-md"
                      onClick={() => getUserMedia()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="modal-box bg-white h-[20%] flex !justify-center !items-center">
              <h3 className="font-bold text-2xl text-center">Cancel Success</h3>
            </div>
          )}
        </dialog>

        <dialog
          id="my_modal_7"
          className="modal modal-bottom sm:modal-middle w-screen h-screen"
        >
          <div
            className={`modal-box bg-white flex flex-col justify-center ${
              statusAccept ? "text-[#465EA6]" : "text-[#D95448]"
            }`}
          >
            <div className="w-full flex justify-center items-center">
            
              <img src={CancelAppointment} alt="Cancel" className="w-20" />
             
            </div>
            <h3 className="font-bold text-2xl text-center">
              {statusAccept
                ? "Are you sure you want to accept?"
                : "Are you sure you want to decline?"}
            </h3>
            <p className="py-4 text-center text-lg">
              {statusAccept
                ? "Please confirm if you wish to proceed with the acceptance to prevent any disruption in your care."
                : "Please confirm if you wish to proceed with the decline to prevent any disruption in your care."}
            </p>
            <form method="dialog" className="flex justify-center items-center">
              <div className="modal-action">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <div className="space-x-3">
                  <button className="bg-[#D9D9D9] w-32 h-10 text-[#484646] rounded-xl shadow-md">
                    Cancel
                  </button>
                  <button
                    className={`${
                      statusAccept ? "bg-[#465EA6]" : "bg-[#D95448]"
                    } w-32 h-10 text-white rounded-xl shadow-md`}
                    onClick={() => handleAcceptDecline()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    );
  }
};
export default AppointmentDetail;
