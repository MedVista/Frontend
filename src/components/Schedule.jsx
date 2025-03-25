import React from "react";
import Navbar from "./Navbar";
import HeaderPageDetail from "./HeaderPageDetail";
import Modals from "./Modals";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeRange } from "../composables/Common";
import { SocketContext } from "../Context";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import {
  FetchTimeslots,
  AddTimesSlot,
  AddNote,
  FetchTimeslotsByDoctorId,
  FetchNotesByDoctorId,
  DeleteNote,
  UpdateNote,
  FetchAppointments,
  UpdateTimeslot,
  DelectTimeSlot
} from "../composables/Fetchdata";
import dayjs from "dayjs";
import Delete from "../Images/Delete.png";
import Edit from "../Images/Edit.png";
import LoadingPage from "./LoadingPage";
import toast, { Toaster } from "react-hot-toast";
import { set } from "date-fns";

const Scheduled = () => {
  const api = process.env.REACT_APP_API_URL;
  const { stateCallModal } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedAllTimes, setSelectedAllTimes] = useState(false);
  const [state, setState] = useState(0);
  const navigate = useNavigate();

  // ข้อมูลเกี่ยวกับตารางเวลาหมอ
  const [timeSlotDoctor, setTimeSlotDoctor] = useState([]);
  const [dataAppointment, setDataAppointment] = useState([]);
  const [dataSchedule, setDataSchedule] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState(false);

  // Notes
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");

  // เก็บ error ต่าง ๆ
  const [errors, setErrors] = useState({});
  const [monthHighlightDays, setMonthHighlightDays] = useState({});
  const [initialValue, setInitialValue] = useState(dayjs());
  const [dateMain, setDateMain] = useState(null);
  const [statusEdit, setStatusEdit] = useState(false);
  const [neverEdit, setNeverEdit] = useState(false);
  // ดึงข้อมูลตั้งแต่แรก
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        toast.dismiss();

        // 1) ดึง timeslot เดิมของหมอ
        const timeslotDoctorData = await FetchTimeslotsByDoctorId(
          localStorage.getItem("id")
        );
        const lastTimeSlot =
          timeslotDoctorData !== 404 ? timeslotDoctorData : [];

        if (timeslotDoctorData !== 404 && lastTimeSlot) {
          // แปลงข้อมูลเพื่อผูกกับการเลือก time slot
          const transformedData = lastTimeSlot?.map((schedule) => ({
            day_of_week: schedule.day_of_week,
            time_slots: schedule.time_slots?.map((timeSlot) => timeSlot.id),
            id: schedule.id,
          }));
          setTimeSlotDoctor(lastTimeSlot);
          setDataSchedule(transformedData);
          
          setStatusUpdate(true);
        } else {
          setTimeSlotDoctor([]);
          setStatusUpdate(false);
        }

        // 3) ดึง Notes
        const notesData = await FetchNotesByDoctorId(
          localStorage.getItem("id"),
          formatDateForFetch(dayjs().$d, true)
        );
        if (notesData !== 404) {
          setNotes(notesData);
        } else {
          setNotes([]);
        }

        // 4) ดึง timeslots ทั้งหมด
        const timeslotsData = await FetchTimeslots();
        setTimeslots(timeslotsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setStatusUpdate(false);
        toast.dismiss();
        toast.error("An error occurred while fetching data.");
        setTimeout(() => {
          toast.dismiss();
          navigate("/home");
        }, 1000);
      }
    };
    fetchData();
  }, []);

  // ตรงนี้ใช้ format วันที่เพื่อดึง Notes
  function formatDateForFetch(date, fetch) {
    const d = dayjs(date).toDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    if (fetch) {
      return `${yyyy}-${mm}-${dd}`;
    } else {
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  const handleTimeToggle = (day, id = null) => {
    setDataSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      const existingDaySchedule = newSchedule.find(
        (schedule) => schedule.day_of_week === day
      );

      if (id === null) {
        // 🟢 กรณีเลือกทั้งหมด
        if (existingDaySchedule) {
          // if (existingDaySchedule.time_slots.length === timeslots.length) {
          //   existingDaySchedule.time_slots = []; // ❌ ยกเลิกทั้งหมด
          // } else {
            existingDaySchedule.time_slots = timeslots.map((time) => time.id); // ✅ เลือกทั้งหมด
          // }
        } else {
          newSchedule.push({
            day_of_week: day,
            time_slots: timeslots.map((time) => time.id),
            id: null,
          });
        }
      } else {
        // 🟢 กรณีเลือกทีละตัว
        if (existingDaySchedule) {
          if (existingDaySchedule.time_slots.includes(id)) {
            existingDaySchedule.time_slots =
              existingDaySchedule.time_slots.filter((time) => time !== id);
          } else {
            existingDaySchedule.time_slots.push(id);
          }
        } else {
          newSchedule.push({
            day_of_week: day,
            time_slots: [id],
            id: null,
          });
        }
      }

      // อัปเดตค่า selectedAllTimes
      const isAllSelected =
        existingDaySchedule?.time_slots.length === timeslots.length;
      setSelectedAllTimes(isAllSelected);

      return newSchedule;
    });
  };

  // ฟังก์ชัน Clear Time Slot แต่ละวัน
  const clearTimeSlot = (day) => {
    if (statusUpdate) {
      let idtimeslotclear = timeSlotDoctor.find(
        (schedule) => schedule.day_of_week === day
      )?.id;
      console.log('====================================');
      console.log(idtimeslotclear == undefined);
      
      console.log('====================================');
      if(idtimeslotclear == undefined){
        setDataSchedule(dataSchedule.filter((schedule) => schedule.day_of_week !== day));
      }else{
      DelectTimeSlot(idtimeslotclear).then((response) => {
        if (response === 204) {
          toast.success("Time slot cleared successfully", {
            autoClose: 500,
            removeDelay: 500,
          });

          setTimeout(() => {
            toast.dismiss();
            window.location.reload();
          }, 1000);
        }
      });
      }
     

    } else {

      setDataSchedule((prevSchedule) => {
        return prevSchedule.map((schedule) => {
          if (schedule.day_of_week === day) {
            return { ...schedule, time_slots: [] };
          }
          return schedule;
        });
      });
    }
  };

  // ฟังก์ชันกด Save
  const handleSave = () => {
    const newErrors = { selectedDays: "" };
    const filteredSchedule = dataSchedule.filter(
      (schedule) => schedule.time_slots && schedule.time_slots.length > 0
    );
    let Isvalue = []

    dataSchedule.forEach((schedule) => {

      if(schedule.time_slots.length === 0){
        Isvalue.push(schedule.day_of_week)
      }

      if (schedule.time_slots.length === 0) {
        toast.error(`Please select at least one time slot for each ${schedule.day_of_week}`, {
          autoClose: 500,
          removeDelay: 500,
        });
        setTimeout(() => {
          toast.dismiss();
        }, 1000);
      }
    });
    const data = filteredSchedule.map((schedule) => {
      return { ...schedule, doctorId: localStorage.getItem("id") };
    });
    
    
    // ถ้ามีตารางอยู่แล้วให้ UpdateTimeslot ถ้าไม่มีก็ AddTimesSlot
    if (statusUpdate && Isvalue == 0 ) {
      UpdateTimeslot(data, timeSlotDoctor[0].id).then((response) => {
        if (response === 200) {
          toast.success("Schedule updated successfully", {
            autoClose: 500,
            removeDelay: 500,
          });
          FetchTimeslotsByDoctorId(localStorage.getItem("id")).then((data) => {
            if (data !== 404) {
              setTimeSlotDoctor(data);
            }
          });
          setTimeout(() => {
            toast.dismiss();
            window.location.reload();
          }, 1000);
        } else {
          setNeverEdit(false);
          toast.error(
            "This booking slot is already booked and cannot be updated.",
            { autoClose: 500, removeDelay: 500 }
          );
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      });
    } 
    if(!statusUpdate && Isvalue == 0){
      AddTimesSlot(data).then((response) => {
        if (response === 201) {
          toast.success("Schedule updated successfully", {
            autoClose: 500,
            removeDelay: 500,
          });
          FetchTimeslotsByDoctorId(localStorage.getItem("id")).then((data) => {
            if (data !== 404) {
              let Data = data?.pop();
              setTimeSlotDoctor(Data);
            }
          });
          setTimeout(() => {
            toast.dismiss();
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Schedule conflicts detected", {
            autoClose: 500,
            removeDelay: 500,
          });
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      });
    }

  };

  // ฟังก์ชันตรวจสอบ Error การเลือก
  useEffect(() => {
    if (!selectedDays?.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedDays: "",
      }));
    } else if (!selectedTimes?.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedTimes: "",
      }));
    }
  }, [selectedDays, selectedTimes]);

  // ฟังก์ชันย้อนกลับ
  const goback = () => {
    if (state === 1) {
      setState(0);
    } else {
      navigate("/home");
    }
  };
  const handleCancel = () => {
    console.log(timeSlotDoctor);
    setDataSchedule(
      timeSlotDoctor?.map((schedule) => ({
        day_of_week: schedule.day_of_week,
        time_slots: schedule.time_slots?.map((timeSlot) => timeSlot.id),
      }))
    );
    setStatusEdit(false);
  };
  useEffect(() => {
    const transformedData = timeSlotDoctor?.map((schedule) => ({
      day_of_week: schedule.day_of_week,
      time_slots: schedule.time_slots?.map((timeSlot) => timeSlot.id),
      id: schedule.id,
    }));
    function hasChanges(oldData, newData) {
      const oldSet = new Set(oldData.map(JSON.stringify));
      const newSet = new Set(newData.map(JSON.stringify));

      if (oldSet.size !== newSet.size) return true;

      for (const item of newSet) {
        if (!oldSet.has(item)) return true;
      }

      return false;
    }
    setNeverEdit(hasChanges(transformedData, dataSchedule));
  }, [dataSchedule]);
  
  // ถ้ากำลังโหลด
  if (isLoading) {
    return (
      <div>
        <Toaster toastOptions={{ removeDelay: 500 }} />
        <LoadingPage />
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex bg-gray-100 cursor-default text-[#484646]">
        {stateCallModal && <Modals type="call" />}
        <Toaster toastOptions={{ removeDelay: 500 }} />

        {/* Navbar ด้านซ้าย */}
        <div className="md:w-1/5 lg:w-1/5 h-screen static top-0 left-0">
          <Navbar />
        </div>

        {/* เนื้อหา */}
        <div className="md:w-4/5 max-sm:w-full  overflow-y-auto flex flex-col pr-2 pt-5 pl-14 pb-2">
          <div className="w-full pb-2 flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <p
                className="w-9 flex justify-center h-9 rounded-full text-blue-700 bg-[#DCDCDC] text-2xl cursor-pointer"
                onClick={goback}
              >
                &lt;
              </p>
              <h1 className="font-bold text-2xl">
                {state === 0 ? "Schedule" : "Edit Availability"}
              </h1>
            </div>
            {/* <div className="text-right flex items-center">
              <div className="border-r-2 border-[#DCDCDC] pr-5 text-2xl cursor-pointer">
                <IoMoonOutline className="text-2xl" />
              </div>
              <GoBell className="text-2xl ml-3 mr-5 cursor-pointer" />
              <img
                src={`${api}${localStorage.getItem("profile_picture")}`}
                alt="LogoHome"
                className="rounded-full mt-2 w-12 h-12 mb-2"
              />
            </div> */}
          </div>
          <hr className="border-2" />

          {/* {state === 0 && (
            <div className="w-full flex justify-center items-center pt-3 mt-5">
              <div className="w-3/4 flex items-center justify-center flex-col ">

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    defaultValue={initialValue}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{ day: ServerDay }}
                    slotProps={{ day: { highlightedDays } }}
                    sx={{
                      border: "2px solid #465EA6",
                      borderRadius: "10px",
                      width: "100%",
                      maxWidth: {
                        xs: "100%", // สำหรับหน้าจอเล็ก (mobile)
                        sm: "400px", // สำหรับหน้าจอขนาดเล็ก (sm)
                        md: "400px", // สำหรับหน้าจอขนาดกลาง (md)
                      },
                      height:{
                        xs: "380px", // สำหรับหน้าจอเล็ก (mobile)
                        sm: "400px", // สำหรับหน้าจอขนาดเล็ก (sm)
                        md: "400px", // สำหรับหน้าจอขนาดกลาง (md)
                      },
                      "max-height": "none !important",
                      "& .MuiDayCalendar-root": {
                        height: "350px !important",
                      },
                      "& .MuiDayCalendar-weekDayLabel": {
                        width: {
                          xs: "30px", // สำหรับหน้าจอเล็ก (mobile)
                          sm: "50px", // สำหรับหน้าจอขนาดเล็ก (sm)
                          md: "70px", // สำหรับหน้าจอขนาดกลาง (md)
                        },
                        maxWidth: {
                          xs: "30px", // สำหรับหน้าจอเล็ก (mobile)
                          sm: "45px", // สำหรับหน้าจอขนาดเล็ก (sm)
                          md: "45px", // สำหรับหน้าจอขนาดกลาง (md)
                        },
                        height: "45px !important",
                      },
                      "& .MuiBadge-root": {
                        maxWidth: {
                          xs: "35px", // สำหรับหน้าจอเล็ก (mobile)
                          sm: "50px", // สำหรับหน้าจอขนาดเล็ก (sm)
                          md: "50px", // สำหรับหน้าจอขนาดกลาง (md)
                        },
                        width: {
                          xs: "50px", // สำหรับหน้าจอเล็ก (mobile)
                          sm: "70px", // สำหรับหน้าจอขนาดเล็ก (sm)
                          md: "70px", // สำหรับหน้าจอขนาดกลาง (md)
                        },
                        height: "45px !important",
                      },
                    }}
                  />
                </LocalizationProvider>

               
                <div className=" w-full flex justify-between items-center mt-2 text-xs">
                  <span className="flex items-center space-x-1">
                    <span>🟢</span>
                    <p>Available</p>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🔴</span>
                    <p>Unavailable</p>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🟡</span>
                    <p>Booked</p>
                  </span>
                </div>

                <button
                  className="bg-[#465EA6] text-white rounded-md p-2 mt-2 w-48"
                  onClick={handleEditAvailbility}
                >
                  Edit Availability
                </button>

                
                <div className="w-full h-[350px] flex flex-col justify-between items-center mt-2 border-2 border-[#465EA6] rounded-2xl p-3">
                  <div className="w-full p-2">
                    <h1 className="font-bold">Notes</h1>
                    <div className="space-y-4 w-full overflow-y-auto h-[200px]">
                      {notes?.map((noteItem, index) => (
                        <div
                          key={noteItem.id}
                          className="flex items-center w-full space-x-3"
                        >
                          <div className="w-full space-y-2">
                            <div className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={
                                  editingIndex === index
                                    ? editedText
                                    : noteItem.note_details
                                }
                                className={`w-full p-1 bg-inherit focus:outline-none 
                                  ${
                                    editingIndex === index
                                      ? "border-2 border-[#465EA6] pl-3 rounded-full cursor-default"
                                      : "cursor-pointer"
                                  } 
                                  ${
                                    noteItem.is_checked
                                      ? "line-through text-[#AAA4A4]"
                                      : ""
                                  }
                                `}
                                onChange={(e) => setEditedText(e.target.value)}
                                onClick={() => handleText(noteItem.id, index)}
                              />
                              {editingIndex === index ? (
                                <button
                                  className="ml-2 bg-[#465EA6] text-white px-3 py-1 rounded-full"
                                  onClick={() => handleSaveNote(index)}
                                >
                                  Save
                                </button>
                              ) : (
                                <>
                                  <img
                                    src={Edit}
                                    alt="Edit"
                                    className="w-5 cursor-pointer"
                                    onClick={() => handleEdit(index)}
                                  />
                                  <img
                                    src={Delete}
                                    alt="Delete"
                                    className="w-5 cursor-pointer"
                                    onClick={() => handleDelete(index)}
                                  />
                                </>
                              )}
                            </div>
                            <hr className="border-[1.5px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-start mt-5 cursor-pointer p-3">
                    <h2 className="font-bold">New Note</h2>
                    <div className="w-full flex space-x-5 h-8">
                      <input
                        type="text"
                        placeholder="Enter your note"
                        className="w-full p-1 pl-3 bg-inherit focus:outline-none border-2 border-[#465EA6] rounded-full hover:border-[#465EA6]"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <button
                        className="max-sm:w-32 max-sm:text-xs w-32 flex justify-center items-center bg-[#465EA6] rounded-full text-white"
                        onClick={handleAddNote}
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          <div className="w-full">
            <div className="w-full p-5 pt-0 text-sm">
              <div className="mb-5 mt-10 space-y-3">
                <label className="block font-medium">
                  Please select from start date to end date for which you want
                  to set Availability
                </label>
              </div>

              <div className="mb-10">
                {/* <div className="flex justify-between mb-4">
                  <label className="block font-medium">Select Days</label>
                </div> */}
                <div className="flex flex-col justify-between gap-2 max-sm:p-5">

                  {/* <div className=" w-full flex flex-wrap justify-center sm:justify-between gap-2 mb-4 sm:mb-0">
                    {days.map((day) => {
                      const scheduleForDay = Array.isArray(dataSchedule)
                        ? dataSchedule.find(
                            (schedule) => schedule.day_of_week === day
                          )
                        : undefined;
                      const timeSlotForDay = Array.isArray(timeSlotDoctor)
                        ? timeSlotDoctor.find(
                            (schedule) => schedule.day_of_week === day
                          )
                        : undefined;

                      return (
                        <button
                          key={day}
                          className={`py-5 px-8 rounded-xl border-2 text-lg font-medium 
                              ${
                                scheduleForDay &&
                                scheduleForDay.time_slots?.length > 0
                                  ? "bg-green-500 border-green-700"
                                  // : timeSlotForDay &&
                                  //   timeSlotForDay.time_slots?.length > 0
                                  // ? "bg-yellow-500 border-yellow-700"
                                  : "border-gray-300"
                              }
                            `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div> */}

                  <div className=" flex space-x-10 h-full items-center">
                    
                    <div className="w-1/3 max-sm:w-2/3">
                    <FormControl
                              fullWidth
                              sx={{
                                "& .MuiInputBase-root ": {
                                  borderRadius: "1rem",
                                },
                              }}
                            >
                              <InputLabel id="demo-simple-select-label">
                              Select Days
                              </InputLabel>
                              <Select
                                // value={gender}
                                label="Select Days"
                                // onChange={(e) => setGender(e.target.value)}
                                value={selectedDays}
                      onChange={(e) => setSelectedDays(e.target.value)}
                              >
                                {days.map((day) => (
                                  <MenuItem key={day} value={day}>
                                    {day}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                    </div>
                    {statusEdit && 
                    <button
                    className="bg-[#465EA6] text-white rounded-3xl  text-lg py-4 px-8 text-center "
                    onClick={() => document.getElementById("my_modal_6").showModal()}
                  >
                    Clear
                  </button>}

                    {errors.selectedDays && (
                      <div className="text-red-500 mt-2">
                        {errors.selectedDays}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex flex-row items-center justify-between mb-4">
                  <label className=" font-medium ">
                    Availability Time
                  </label>
                  <span
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleTimeToggle(selectedDays, null)}
                  >
                    <input
                      type="checkbox"
                      disabled={!selectedDays || !statusEdit}
                      checked={selectedAllTimes || dataSchedule.find(
                        (schedule) => schedule.day_of_week === selectedDays)?.time_slots?.length === 12}
                      className="checkbox w-4 rounded-md h-4 border-2 border-[#D9D9D9] checked:border-[#465EA6]"
                    />
                    <p>Select All Times</p>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {timeslots.map((time) => {
                    const isSelected =
                      (Array.isArray(dataSchedule) &&
                        dataSchedule.some(
                          (schedule) =>
                            schedule.day_of_week === selectedDays &&
                            schedule.time_slots.includes(time.id)
                        )) ||
                      selectedTimes.includes(time.id); // ตรวจสอบจาก selectedAllTimes ด้วย

                    return (
                      <button
                        key={time.id}
                        disabled={!selectedDays || !statusEdit}
                        onClick={() => handleTimeToggle(selectedDays, time.id)}
                        className={`py-2 px-4 rounded-xl border-2 text-lg ${
                          isSelected
                            ? "bg-[#D9DFEA] border-[#465EA6]"
                            : "border-gray-300"
                        }`}
                      >
                        {formatTimeRange(`${time.start_time}-${time.end_time}`)}
                      </button>
                    );
                  })}
                </div>

                {errors.selectedTimes && (
                  <div className="text-red-500 mt-2">
                    {errors.selectedTimes}
                  </div>
                )}
              </div>

              {statusEdit && (
                <div className="space-x-5 pr-5 flex items-center justify-center text-lg">
                  <button
                    className="border-2 rounded-full border-[#DCDCDC] text-black w-32 h-10 pt-1 pb-1"
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    className="border-2 rounded-full bg-[#465EA6] text-white w-32 h-10 p-5 pt-1 pb-1"
                    disabled={!neverEdit}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              )}
              {!statusEdit && (
                <div className="space-x-5 pr-5 flex items-center justify-center text-lg">
                  <button
                    className="border-2 rounded-full bg-[#465EA6] text-white w-32 h-10 p-5 pt-1 pb-1"
                    onClick={() => setStatusEdit(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <dialog
            id="my_modal_6"
            className="modal modal-bottom sm:modal-middle w-screen h-screen"
          >
            <div className="modal-box bg-white flex flex-col justify-center">
              <h3 className="font-bold text-2xl text-center">
                You are about to clear the time slot for {selectedDays}
              </h3>
              <p className="py-4 text-center text-lg"></p>
              <form method="dialog" className="flex justify-center items-center">
                <div className="modal-action">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                    <div className="space-x-3">
                      <button
                        className="bg-[#59A670] w-32 h-10 text-white rounded-xl shadow-md"
                        // onClick={() => handlestate()}
                        onClick={() => clearTimeSlot(selectedDays)}
                      >
                        Confirm
                      </button>
                      <button className="bg-[#D9D9D9] w-32 h-10 text-[#B2B1B1] rounded-xl shadow-md"
                      onClick={() => document.getElementById("my_modal_6").close()}
                      >
                        Cancel
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

export default Scheduled;
