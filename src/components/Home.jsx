import Navbar from "./Navbar";
import { IoSearchSharp, IoStar } from "react-icons/io5";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import Dermatology from "../Images/Dermatology.png";
import ENT from "../Images/ENT.png";
import General from "../Images/GeneralDoctor.png";
import Internal from "../Images/InternalMedicine.png";
import OB from "../Images/OB-GYN.png";
import Pediatric from "../Images/Pediatric.png";
import Physiatry from "../Images/Physiatry.png";
import Psychiatry from "../Images/Psychiatry.png";
import Card from "./Card";
import Notifications from "./Notifications";
import { useState, useEffect, useContext } from "react";
import Edit from "../Images/Edit.png";
import Delete from "../Images/Delete.png";
import { useNavigate, Link } from "react-router-dom";
import {
  FetchDoctor,
  FetchAppointments,
  FetchGetSpeciality,
  UpdateNote,
  FetchNotesByDoctorId,
  DeleteNote, AddNote,
} from "../composables/Fetchdata";
import { formatDate } from "../composables/Common";
import Modals from "./Modals";
import { SocketContext } from "../Context";
import LoadingPage from "./LoadingPage";
import dayjs from "dayjs";
const Home = () => {
  const { stateCallModal } = useContext(SocketContext);
  const api = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState(true);
 const [initialValue, setInitialValue] = useState(dayjs());
  const [doctor, setDoctor] = useState([]);
  const [dataSpecialization, setDataSpecialization] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedRange, setSelectedRange] = useState("thisWeek");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [editedText, setEditedText] = useState("");
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const data = {
    thisWeek: [
      { day: "Mon", appointments: 100, cancelled: 20 },
      { day: "Tue", appointments: 120, cancelled: 15 },
      { day: "Wed", appointments: 150, cancelled: 25 },
      { day: "Thu", appointments: 130, cancelled: 10 },
      { day: "Fri", appointments: 170, cancelled: 30 },
      { day: "Sat", appointments: 190, cancelled: 40 },
      { day: "Sun", appointments: 180, cancelled: 20 },
    ],
    lastWeek: [
      { day: "Mon", appointments: 90, cancelled: 10 },
      { day: "Tue", appointments: 110, cancelled: 20 },
      { day: "Wed", appointments: 140, cancelled: 30 },
      { day: "Thu", appointments: 120, cancelled: 15 },
      { day: "Fri", appointments: 160, cancelled: 25 },
      { day: "Sat", appointments: 180, cancelled: 35 },
      { day: "Sun", appointments: 170, cancelled: 15 },
    ],
  };
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
  useEffect(() => {
    // if(localStorage.getItem("schedule") === "true"){
      const fetchdoctordata = async () => {
        if (localStorage.getItem("role") === "patient") {
          const response1 = await FetchDoctor();
          setDoctor(response1);
        }
      };
      if (localStorage.getItem("role") === "patient") {
        fetchdoctordata();
        FetchGetSpeciality().then((data) => {
          setDataSpecialization(data);
        });
      }else{
        FetchNotesByDoctorId(localStorage.getItem("id")).then((data) => {
          if (data !== 404) {
            setNotes(data);
          } else {
            setNotes([]);
          }
        });
      }
  
      FetchAppointments().then((response) => {
        if (response !== 404) {
          setAppointments(response);
        } else {
          setAppointments([]);
        }
      });
  
      setIsLoading(false);
    // }else{
    //   navigate("/schedule");
    // }
    
  }, []);

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const checkappointmentstaus = (data) => {
    return data?.some((item) => item.status === "Scheduled");
  };
  function FetchNotes(time) {
    FetchNotesByDoctorId(localStorage.getItem("id"), time).then((data) => {
      if (data !== 404) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    });
  }
  const handleDoctorClick = (id) => {
    navigate(`/home/${id}`);
  };
  const handleText = (id, index) => {
    if (editingIndex === index) {
      // กรณีคีย์ note ที่กำลังแก้ไขอยู่
      return;
    } else {
      const updatedNote = notes.find((note) => note.id === id);
      const data = {
        date: updatedNote.date,
        doctorId: updatedNote.doctorId,
        note_details: updatedNote.note_details,
        is_checked: !updatedNote.is_checked,
      };
      UpdateNote(data, updatedNote.id).then((res) => {
        if (res === 200) {
          FetchNotes(formatDateForFetch(updatedNote.date, true));
        }
      });
    }
  };
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedText(notes[index].note_details);
  };
  const handleSaveNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].note_details = editedText;

    const data = {
      date: notes[index].date,
      doctorId: notes[index].doctorId,
      note_details: editedText,
      is_checked: notes[index].is_checked,
    };
    UpdateNote(data, notes[index].id).then((response) => {
      console.log(response);
    });

    setNotes(updatedNotes);
    setEditingIndex(null);
  };
  const handleDelete = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
    DeleteNote(notes[index].id).then((response) => {
      console.log(response);
    });
  };
  const handleAddNote = () => {
    function formatDate(date) {
      const d = dayjs(date).toDate();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    const data = {
      is_checked: false,
      date: formatDate(initialValue.$d),
      doctorId: localStorage.getItem("id"),
      note_details: note,
    };
    AddNote(data).then((response) => {
      setNotes([...notes, response]);
      setNote("");
    });
  };
  if (isLoading) {
    return <LoadingPage />;
  } else {
    return (
      <div className="min-h-screen w-screen flex flex-col md:flex-row bg-gray-100 cursor-default text-[#484646]">
        {/* แสดง Modal ถ้ามี */}
        {stateCallModal && <Modals type="call" />}

        {/* Navbar ด้านซ้าย (หรือด้านบนถ้าหน้าจอเล็ก) */}
        <div className={`w-full md:w-1/5 md:h-screen md:static md:top-0 md:left-0 bg-white`}>
          <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
        </div>

        {/* ส่วน Content */}
        <div className="flex-1  overflow-y-auto">
          <div className="pl-14 pt-5 md:pr-8 md:pt-8 pr-2">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="text-left">
                <span className="text-2xl font-bold capitalize flex mb-1">
                  Welcome&nbsp;<p className="font-normal">
                    {localStorage.getItem("firstname")}!
                  </p>
                </span>
                <p>{formatDate()}</p>
              </div>
            </header>

            {/* Upcoming Appointments (เฉพาะ patient) */}
            {localStorage.getItem("role") === "patient" &&
              checkappointmentstaus(appointments) && (
                <section className="mb-6 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Upcoming Appointment</h3>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {appointments
                      .filter((data) => data.status === "Scheduled")
                      .map((data, index) => (
                        <Link to={`/appointment/${data.id}`} key={index}>
                          <Card style="w-[500px] gap-2" appointment={data} />
                        </Link>
                      ))}
                  </div>
                </section>
              )}

            <Notifications />

            {/* Specialities (เฉพาะ patient) */}
            {localStorage.getItem("role") === "patient" && (
              <section className="mb-6">
                <h3 className="text-xl font-bold mb-5">Specialities</h3>
                <div className="flex flex-wrap gap-2 justify-center md:justify-between">
                  {dataSpecialization.map((icon, index) => (
                    <div
                      className="flex flex-col justify-center items-center w-32 cursor-pointer"
                      key={index}
                    >
                      <div
                        className="rounded-full flex justify-center items-center w-16 h-16 mb-2 bg-[#D9DFEA] shadow-md shadow-zinc-400"
                        onClick={() => navigate(`/home/speciality/${icon.id}`)}
                      >
                        <img
                          src={
                            icon.name === "General Doctor"
                              ? General
                              : icon.name === "Pediatrics"
                              ? Pediatric
                              : icon.name === "Dermatology"
                              ? Dermatology
                              : icon.name === "Internal Medicine"
                              ? Internal
                              : icon.name === "Psychiatry"
                              ? Psychiatry
                              : icon.name === "ENT"
                              ? ENT
                              : icon.name === "Physiatry"
                              ? Physiatry
                              : OB
                          }
                          alt="Speciality"
                          className="w-10"
                        />
                      </div>
                      <p className="text-sm text-center">{icon.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommended Doctors (เฉพาะ patient) */}
            {localStorage.getItem("role") === "patient" && (
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Recommended Doctors</h3>
                  {/* <p className="underline cursor-pointer">See All</p> */}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {doctor.slice(0, 4).map((doctors, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl shadow-md shadow-zinc-400 flex flex-col items-center p-4 justify-center"
                    >
                      <img
                        src={`${api}${doctors.profile_picture}`}
                        alt="Doctor"
                        className="rounded-full border-2 border-white shadow-md mb-4 object-contain w-32 h-32"
                      />
                      <h4 className="font-bold capitalize text-center">
                        {"Dr. " + doctors?.first_name + " " + doctors?.last_name}
                      </h4>
                      <p className="bg-[#D9DFEA] rounded-full text-sm text-[#366CD9] py-1 px-4 mt-2">
                        {
                          dataSpecialization.find(
                            (item) => item.id === doctors.specialization
                          )?.name
                        }
                      </p>
                      <p className="text-xs flex items-center mt-1">
                        <IoStar className="mr-1 text-yellow-400" /> {doctors.avg_rating}
                      </p>
                      <button
                        className="bg-[#465EA6] w-32 h-8 mt-4 text-white rounded-md"
                        onClick={() => handleDoctorClick(doctors.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ส่วนนอกเหนือจาก patient (เช่น doctor) */}
            {localStorage.getItem("role") !== "patient" && (
              <div className="w-full h-auto md:h-[90%] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center space-y-3">
                  <h1 className="w-full text-xl font-bold">
                    Today’s Upcoming Appointment
                  </h1>
                  {appointments
                    .filter(
                      (data) =>
                        data.status === "Upcoming" &&
                        data.appointment_date ===
                          new Date().toISOString().split("T")[0]
                    )
                    .map((data) => (
                      <Link to={`/appointment/${data.id}`} className="w-full" key={data.id}>
                        <Card style="w-[80%] gap-2" appointment={data} />
                      </Link>
                    ))}
                </div>

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
            )}
            {/* สิ้นสุด Section */}
          </div>
        </div>
      </div>
    );
  }
};

export default Home;