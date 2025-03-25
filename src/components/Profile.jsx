import Navbar from "./Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import Camera from "../Images/camera.png";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Emergencycontact from "../Images/emergency-contact.png";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Modals from "./Modals";
import EmailChangePassword from "../Images/EmailChangePassword.png";
import { formatPhoneNumber } from "../composables/Common";
import { SocketContext } from "../Context";
import {
  FetchGetProfile,
  FetchUpdateProfile,
  DelectUser,
  FetchGetSpeciality,
  FetchReview,
  FetchEmailChangePassword
} from "../composables/Fetchdata";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import Hide from "../Images/Hide.png";
import Visible from "../Images/visible.png";
import Work from "../Images/work.png";
import File from "../Images/file.png";
import { set } from "date-fns";

const Profile = () => {
  const api = process.env.REACT_APP_API_URL;
  const { stateCallModal } = useContext(SocketContext);
  const navigate = useNavigate();

  // ------------------------------------------------------
  // State
  // ------------------------------------------------------
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [citizenNumber, setCitizenNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previousValueCitizen, setPreviousValueCitizen] = useState("");
  const [showpicker, setShowpicker] = useState(false);
  const [previousValuePhoneNumber, setPreviousValuePhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [state, setState] = useState(0);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, SetEmail] = useState("");
  const [personalInformation, setPersonalInformation] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [main_clinic_hospital, setMain_Clinic_Hospital] = useState("");
  const [secondary_hospital, setSecondary_hospital] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate2, setStartDate2] = useState("");
  const [endDate2, setEndDate2] = useState("");
  const [datePickerOpen1, setDatePickerOpen1] = useState(false);
  const [datePickerOpen2, setDatePickerOpen2] = useState(false);
  const [datePickerOpen3, setDatePickerOpen3] = useState(false);
  const [datePickerOpen4, setDatePickerOpen4] = useState(false);
  const [data, setData] = useState([]);
  const [emergency_contact, setEmergency_contact] = useState("");
  const [errors, setErrors] = useState("");
  const [file, setFile] = useState("");
  const [dataSpecialization, setDataSpecialization] = useState([]);
  const [dataReview, setDataReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousValueEmergency, setPreviousValueEmergency] = useState("");
  const [changePage, setChangePage] = useState(false);
  const [selectState, setSelectState] = useState("");

  const role = localStorage.getItem("role");

  // ------------------------------------------------------
  // Utility Functions
  // ------------------------------------------------------
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const profileRes = await FetchGetProfile(
          localStorage.getItem("id"),
          localStorage.getItem("role")
        );
        console.log('====================================');
        console.log(profileRes);
        console.log('====================================');
        setData(profileRes);
        setFirstname(profileRes?.first_name);
        setLastname(profileRes?.last_name);
        setCitizenNumber(profileRes?.citizen_number == null ? "" : formatCitizenNumber(profileRes?.citizen_number, ""));
        setDateOfBirth(profileRes?.date_of_birth);
        setGender(profileRes?.gender);
        setPhoneNumber(formatPhoneNumber(profileRes?.phone_number, ""));
        setAddress(profileRes?.address);
        setAllergies(profileRes?.allergies);
        setCurrentMedications(profileRes?.current_medications);
        SetEmail(profileRes?.email);
        setLicenseNumber(profileRes?.license_number);
        setMain_Clinic_Hospital(profileRes?.main_hospital);
        setStartDate(profileRes?.main_start_date);
        setEndDate(profileRes?.main_end_date);
        setSecondary_hospital(profileRes?.secondary_hospital);
        setStartDate2(profileRes?.secondary_start_date);
        setEndDate2(profileRes?.secondary_end_date);
        setPersonalInformation(profileRes?.personal_information);

        setEmergency_contact(
          profileRes?.emergency_contact === null || profileRes?.emergency_contact === undefined
            ? ""
            : formatPhoneNumber(profileRes?.emergency_contact , "")
        );
        setSpeciality(profileRes?.specialization);

        if (role === "doctor") {
          const dataSpec = await FetchGetSpeciality();
          setDataSpecialization(dataSpec);

          const reviewResponse = await FetchReview(localStorage.getItem("id"));
          if (reviewResponse !== 404) {
            setDataReview(reviewResponse);
          } else {
            setDataReview([]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        toast.error("An error occurred while fetching data.", {
          autoClose: 500,
          removeDelay: 500,
        });
      }
    };

    fetchData();
  }, []);
  const formatCitizenNumber = (value, previousValue) => {
    const numericValue = value.replace(/\D/g, "");
    const formatted = numericValue
      .replace(/(\d{1})(\d{0,4})/, "$1 $2")        // 1 xxxx
      .replace(/(\d{1} \d{4})(\d{0,5})/, "$1 $2")  // 1 xxxx xxxxx
      .replace(/(\d{1} \d{4} \d{5})(\d{0,2})/, "$1 $2")    // 1 xxxx xxxxx xx
      .replace(/(\d{1} \d{4} \d{5} \d{2})(\d{0,1})/, "$1 $2") // 1 xxxx xxxxx xx x
      .slice(0, 17);

    if (
      value.length < previousValue.length &&
      previousValue[previousValue.length - 1] === " "
    ) {
      return formatted.slice(0, -1);
    }

    return formatted;
  };

  function daysPassed(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMs = currentDate - givenDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    if (differenceInDays === 0) {
      return "Today";
    } else if (differenceInDays === 1) {
      return "1 day";
    } else {
      return `${differenceInDays} days`;
    }
  }

  function changeDateFormat(dateStr) {
    if (dateStr !== undefined && dateStr !== "" && dateStr !== null) {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }
    return "";
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1 text-yellow-500">
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <svg
              key={`full-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.417 8.403L12 18.896l-7.417 4.104L6 15.597 0 9.75l8.332-1.595L12 .587z" />
            </svg>
          ))}
        {hasHalfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <defs>
              <clipPath id="half-star">
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.417 8.403L12 18.896l-7.417 4.104L6 15.597 0 9.75l8.332-1.595L12 .587z"
              fill="currentColor"
              clipPath="url(#half-star)"
            />
            <path
              d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.417 8.403L12 18.896l-7.417 4.104L6 15.597 0 9.75l8.332-1.595L12 .587z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <svg
              key={`empty-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
              />
            </svg>
          ))}
      </div>
    );
  };

  const calculateAverageRating = (data) => {
    if (data.length === 0) {
      return 0;
    } else {
      const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
      return (totalRating / data.length).toFixed(1);
    }
  };

  // ------------------------------------------------------
  // Handle Functions
  // ------------------------------------------------------
  const handleChangeCitizen = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCitizenNumber(
      inputValue,
      previousValueCitizen
    );
    setPreviousValueCitizen(citizenNumber);
    setCitizenNumber(formattedValue);
  };

  const handleDatePicker = () => {
    setShowpicker(!showpicker);
    const pickerInput = document.getElementsByClassName("ant-picker")[0];
    if (pickerInput) {
      pickerInput.click();
    } else {
      console.error("Element with class 'ant-picker-input' not found!");
    }
  };

  const handleDateChange = (date, type) => {
    const day = String(date.$d.getDate()).padStart(2, "0");
    const month = String(date.$d.getMonth() + 1).padStart(2, "0");
    const year = date.$d.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    switch (type) {
      case "startmain":
        setStartDate(formattedDate);
        break;
      case "endmain":
        setEndDate(formattedDate);
        break;
      case "startsecondary":
        setStartDate2(formattedDate);
        break;
      case "endsecondary":
        setEndDate2(formattedDate);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (endDate !== "" && endDate2 !== "") {
      startDate > endDate && setEndDate("");
      startDate2 > endDate2 && setEndDate2("");
    }
  }, [startDate, startDate2, endDate, endDate2]);

  const handleChangePhoneNumberAndEmergency =(e,type)=>{
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(
      inputValue,
      type === "phone" ? previousValuePhoneNumber : previousValueEmergency
    );
    if (type === "phone") {
      setPreviousValuePhoneNumber(phoneNumber);
      setPhoneNumber(formattedValue);
      
    }else{
      setPreviousValueEmergency(emergency_contact);
      setEmergency_contact(formattedValue);
    }

  }


  const previewFile = (files) => {
    if (!files) {
      return;
    }
    setFile(files);
    const filepreview = files;
    if (filepreview) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("preview");
        imgElement.src = e.target.result;
        imgElement.style.display = "block";
      };
      reader.readAsDataURL(filepreview);
    }
  };

  // ฟังก์ชันรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นจาก API
  const defaultdata = () => {
    setGender(data?.gender);
    setPhoneNumber(formatPhoneNumber(data?.phone_number, ""));
    setAddress(data?.address);
    setAllergies(data?.allergies);
    setCurrentMedications(data?.current_medications);
    setEmergency_contact(
      data?.emergency_contact === null || data?.emergency_contact === undefined
        ? ""
        : formatPhoneNumber(data?.emergency_contact, "")
    );
    setMain_Clinic_Hospital(data?.main_hospital);
    setStartDate(data?.main_start_date);
    setEndDate(data?.main_end_date);
    setSpeciality(data?.specialization);
    setPersonalInformation(data?.personal_information);
    setSecondary_hospital(data?.secondary_hospital);
    setStartDate2(data?.secondary_start_date);
    setEndDate2(data?.secondary_end_date);
    setFile("");
  };

  // ------------------------------------------------------
  // Check Before Navigate to Next State Tab
  // ------------------------------------------------------
  const checkHandledata = (newState) => {
    setSelectState(newState);

    let condition = "";
    if (role === "doctor") {
      condition =
        personalInformation !== data?.personal_information ||
        file !== "" ||
        speciality !== data?.specialization ||
        startDate !== data?.main_start_date ||
        endDate !== data?.main_end_date ||
        main_clinic_hospital !== data?.main_hospital ||
        secondary_hospital !== data?.secondary_hospital ||
        startDate2 !== data?.secondary_start_date ||
        endDate2 !== data?.secondary_end_date ||
        phoneNumber !== formatPhoneNumber(data?.phone_number, "");
    } else {
      condition =
        formatPhoneNumber(data?.phone_number, "") !== phoneNumber ||
        data?.gender !== gender ||
        address !== data?.address ||
        allergies !== data?.allergies ||
        currentMedications !== data?.current_medications ||
        file !== "" ||
        phoneNumber !== formatPhoneNumber(data?.phone_number, "") 
        ||
        emergency_contact !==
          (data?.emergency_contact === null || data?.emergency_contact === undefined
            ? ""
            : formatPhoneNumber(data?.emergency_contact, ""));
    }

    if (condition) {
      setChangePage(true);
      document.getElementById("my_modal_6").showModal();
    } else {
      setState(newState);
      setChangePage(false);
      defaultdata();
    }
  };

  // ------------------------------------------------------
  // ยืนยันเปลี่ยน state
  // ------------------------------------------------------
  const handlestate = () => {
    setState(selectState);
    setChangePage(false);
    defaultdata();
  };

  // ------------------------------------------------------
  // Fetch Data (Profile, Doctor, Reviews)
  // ------------------------------------------------------


  // ------------------------------------------------------
  // Validate & Submit
  // ------------------------------------------------------
  const submitUpdate = () => {
    const newErrors = {};

    if (role === "doctor") {
      newErrors.specialization =
        speciality === "" ? "Specialization is required" : false;
      newErrors.personalInformation =
        personalInformation === "" ? "Personal Information is required" : false;
      newErrors.main_clinic_hospital =
        main_clinic_hospital === ""
          ? "Main Clinic / Hospital is required"
          : false;

      newErrors.phoneNumber =
        phoneNumber === ""
          ? "Phone number is required"
          : phoneNumber.replace(/-/g, "").length !== 10
          ? "Phone number must be 10 digits"
          : !phoneNumber.replace(/-/g, "").match(/^0[689]\d{8}$/)
          ? "Phone number must be a valid Thai mobile number"
          : false;

      if (startDate == null && endDate !== null) {
        newErrors.startDate =
          startDate === null ? "Start Date is required" : false;
      } else if (startDate2 == null && endDate2 !== null) {
        newErrors.startDate2 =
          startDate2 === null ? "Start Date is required" : false;
      }

      if (startDate2 !== null && endDate2 !== null) {
        newErrors.secondary_hospital =
          secondary_hospital === ""
            ? "Secondary Clinic / Hospital is required"
            : false;
      }
    } else {
      newErrors.address = address === "" ? "Address is required" : false;
      newErrors.gender = gender === "" ? "Gender is required" : false;
      newErrors.phoneNumber =
        phoneNumber === ""
          ? "Phone number is required"
          : phoneNumber.replace(/-/g, "").length !== 10
          ? "Phone number must be 10 digits"
          : !phoneNumber.replace(/-/g, "").match(/^0[689]\d{8}$/)
          ? "Phone number must be a valid Thai mobile number"
          : false;

      if (emergency_contact && emergency_contact.length > 1) {
        newErrors.emergency_contact =
          emergency_contact.replace(/-/g, "").length !== 10
            ? "Emergency Contact must be exactly 10 digits"
            : !emergency_contact.replace(/-/g, "").match(/^0[689]\d{8}$/)
            ? "Emergency Contact must be a valid Thai mobile number"
            : false;
      }
    }

    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some(
      (error) => typeof error === "string"
    );

    let condition = "";
    if (role === "doctor") {
      condition =
        personalInformation !== data?.personal_information ||
        file !== "" ||
        speciality !== data?.specialization ||
        startDate !== data?.main_start_date ||
        endDate !== data?.main_end_date ||
        main_clinic_hospital !== data?.main_hospital ||
        secondary_hospital !== data?.secondary_hospital ||
        startDate2 !== data?.secondary_start_date ||
        endDate2 !== data?.secondary_end_date ||
        phoneNumber.replace(/-/g, "") !== data?.phone_number;
    } else {
      condition =
        phoneNumber.replace(/-/g, "") !== data?.phone_number ||
        address !== data?.address ||
        allergies !== data?.allergies ||
        currentMedications !== data?.current_medications ||
        file !== "" ||
        emergency_contact.replace(/-/g, "") !== data?.emergency_contact;
    }

    if (condition) {
      if (isValid) {
        let updatedData = { ...data };
        updatedData.phone_number = phoneNumber.replace(/-/g, "");
        updatedData.gender = gender;

        if (file !== "") {
          updatedData.profile_picture = file;
        } else {
          // ถ้าไม่มีไฟล์ใหม่ ให้ลบ profile_picture ออกจาก payload
          const { profile_picture, ...rest } = updatedData;
          updatedData = { ...rest };
        }

        if (role === "patient") {
          updatedData.address = address;
          updatedData.allergies = allergies;
          updatedData.current_medications = currentMedications;
          updatedData.emergency_contact = emergency_contact.replace(/-/g, "");
        } else {
          updatedData.specialization = speciality;
          updatedData.personal_information = personalInformation;
          updatedData.date_of_birth = "";
          updatedData.experience = "";

          // ลบ certificate ถ้าไม่มีไฟล์
          const { certificate, ...rest } = updatedData;
          updatedData = { ...rest };

          updatedData.main_hospital = main_clinic_hospital;
          updatedData.main_start_date = startDate;
          updatedData.main_end_date = endDate == "" || endDate == null ? "" : endDate;
          updatedData.secondary_hospital = secondary_hospital;
          updatedData.secondary_start_date = startDate2 == "" || startDate2 == null ? "" : startDate2;
          updatedData.secondary_end_date = endDate2 == "" || endDate2 == null ? "" : endDate2;
        }

        FetchUpdateProfile(
          localStorage.getItem("id"),
          localStorage.getItem("role"),
          updatedData
        ).then((response) => {
          if (response === 200) {
            toast.success("Profile updated successfully.", {
              autoClose: 500,
              removeDelay: 500,
            });
            FetchGetProfile(
              localStorage.getItem("id"),
              localStorage.getItem("role")
            ).then((response) => {
              setData(response);
              setFirstname(response?.first_name);
              setLastname(response?.last_name);
              setCitizenNumber(formatCitizenNumber(response?.citizen_number, ""));
              setDateOfBirth(response?.date_of_birth);
              setGender(response?.gender);
              setPhoneNumber(formatPhoneNumber(response?.phone_number, ""));
              setAddress(response?.address);
              setAllergies(response?.allergies);
              setCurrentMedications(response?.current_medications);
              SetEmail(response?.email);
              setLicenseNumber(response?.license_number);
              setMain_Clinic_Hospital(response?.main_hospital);
              setStartDate(response?.main_start_date);
              setEndDate(response?.main_end_date);
              setPersonalInformation(response?.personal_information);
              setSecondary_hospital(response?.secondary_hospital);
              setStartDate2(response?.secondary_start_date);
              setEndDate2(response?.secondary_end_date);
              setEmergency_contact(
                response?.emergency_contact === null || response?.emergency_contact === undefined
                  ? ""
                  : formatPhoneNumber(response?.emergency_contact, "")
              );
              setSpeciality(response?.specialization);
              localStorage.removeItem("profile_picture");
              localStorage.setItem("profile_picture", response.profile_picture);
            });
            setTimeout(() => {
              toast.dismiss();
              window.location.reload();
            }, 1000);
          } else {
            toast.error("Profile updated failed.", {
              autoClose: 500,
              removeDelay: 500,
            });
            setTimeout(() => {
              toast.dismiss();
            }, 1000);
          }
        });

        
      }
    } else {
      toast("Please change the data to update", {
        autoClose: 500,
        removeDelay: 500,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  // ------------------------------------------------------
  // Delete Account
  // ------------------------------------------------------
  const deleteAccount = () => {
    DelectUser(localStorage.getItem("id"), localStorage.getItem("role")).then(
      (response) => {
        if (response === 204) {
          toast.success("Account deleted successfully.", {
            autoClose: 500,
            removeDelay: 500,
          });
          setTimeout(() => {
            toast.dismiss();
            localStorage.clear();
            navigate("/login");
          }, 1000);
        } else {
          toast.error("Account deleted failed.", {
            autoClose: 500,
            removeDelay: 500,
          });
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      }
    );
  };

  // ------------------------------------------------------
  // MUI Theme
  // ------------------------------------------------------
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "black",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: "black !important",
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "black",
            "&:hover": {
              backgroundColor: "#EBEBEB",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root.Mui-disabled": {
              color: "black",
            },
          },
        },
      },
    },
  });

  // ------------------------------------------------------
  // Clear Error เมื่อแก้ไขบาง Field
  // ------------------------------------------------------
  useEffect(() => {
    let updatedErrors = { ...errors };
    if (address !== "") updatedErrors.address = false;
    if (gender !== "") updatedErrors.gender = false;
    if (phoneNumber !== "") updatedErrors.phoneNumber = false;
    if (speciality !== "") updatedErrors.specialization = false;
    if (main_clinic_hospital !== "") updatedErrors.main_clinic_hospital = false;
    if (startDate !== "") updatedErrors.startDate = false;
    if (endDate !== "") updatedErrors.endDate = false;
    if (allergies !== "") updatedErrors.allergies = false;
    if (currentMedications !== "") updatedErrors.currentMedications = false;
    if (emergency_contact !== "") updatedErrors.emergency_contact = false;
    if (personalInformation !== "")
      updatedErrors.personalInformation = false;
    if (secondary_hospital !== "")
      updatedErrors.secondary_hospital = false;
    if (startDate2 !== "") updatedErrors.startDate2 = false;
    if (endDate2 !== "") updatedErrors.endDate2 = false;
    setErrors(updatedErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    phoneNumber,
    gender,
    address,
    allergies,
    currentMedications,
    speciality,
    main_clinic_hospital,
    startDate,
    endDate,
    emergency_contact,
    startDate2,
    secondary_hospital,
    personalInformation,
  ]);
 const sendInstruction = () => {
    const data = {
      email: email,
    };
    FetchEmailChangePassword(data);
    setState(5);
  };
  if (isLoading) {
    return (
      <div>
        <Toaster toastOptions={{ removeDelay: 500 }} />
        <LoadingPage />
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex flex-col md:flex-row bg-gray-100 text-[#484646]">
        {stateCallModal && <Modals type="call" />}
        <Toaster toastOptions={{ removeDelay: 500 }} />

        {/* Navbar */}
        <div className="w-full md:w-1/5 md:h-screen md:fixed md:top-0 md:left-0 z-20">
        <Navbar color={stateCallModal?"bg-opacity-50":"bg-white"} />
        </div>

        {/* Content */}
        <div className="w-full md:w-4/5 md:ml-auto overflow-y-auto p-8 pb-0">
          <div className="w-full">
            <header className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-left mb-4 md:mb-0">
                <span className="text-2xl font-bold capitalize flex">
                  {role === "patient" ? "Patient" : "Doctor"} Profile
                </span>
              </div>
            </header>
          </div>

          {/* Cover + Profile Picture */}
          <div className="w-full relative flex flex-col items-center">
            <div className="w-full h-60 bg-[#465EA6] rounded-3xl relative">
              <div
                className="w-48 h-48 bg-[#465EA6] absolute rounded-full border-8 border-white
                           -bottom-20  left-4 lg:left-32  flex justify-center items-center p-5"
              >
                <img
                  src={`${api}${data?.profile_picture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl"
                />
                {file && state === 1 && (
                  <img
                    id="preview"
                    className="absolute w-32 h-32 rounded-2xl z-1 cursor-pointer bg-white"
                    onClick={() => document.getElementById("file").click()}
                  />
                )}
                <input
                  type="file"
                  disabled={state === 0}
                  id="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => previewFile(e.target.files[0])}
                />
                {state === 1 && (
                  <span
                    className="absolute -right-5 rounded-full border-2 p-2 top-24 bg-[#465EA6] cursor-pointer"
                    onClick={() => document.getElementById("file").click()}
                  >
                    <img src={Camera} alt="Camera" className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* ส่วนแสดงชื่อ / ปุ่ม Save/Cancel */}
            <div className="w-full mt-28 md:mt-0 rounded-3xl flex justify-end">
              <div className="w-full md:w-2/3 pt-5 flex flex-col md:flex-row justify-between pl-5">
                <div className="mb-4 md:mb-0">
                  <p className="font-bold lg:text-lg md:text-base">
                    {role === "doctor" ? "Dr." : ""}
                    {firstname + " " + lastname}
                  </p>
                  <p className="text-[#AAA4A4] lg:text-base md:text-sm">
                    {role === "doctor"
                      ? dataSpecialization?.find(
                          (specialization) =>
                            specialization.id === data.specialization
                        )?.name
                      : email}
                  </p>
                </div>
                {state === 0 && role === "patient" && (
                  <div className="flex pr-5 items-center gap-2">
                    <div className="text-right">
                      <p className="font-bold lg:text-lg md:text-sm">
                        {emergency_contact === "" ? "-" : emergency_contact}
                      </p>
                      <p className="text-[#AAA4A4] lg:text-base md:text-sm">Emergency Contact</p>
                    </div>
                    <img
                      src={Emergencycontact}
                      alt="Emergency Contact"
                      className="w-10 h-10"
                    />
                  </div>
                )}
                {state === 1 && (
                  <div className="flex space-x-5 pr-5 items-center pb-3 md:pb-0">
                    <button
                      className="border-2 rounded-full border-[#DCDCDC] text-black w-24 h-10"
                      onClick={() => [defaultdata(),setState(0)]}
                    >
                      Cancel
                    </button>
                    <button
                      className="border-2 rounded-full bg-[#465EA6] text-white w-24 h-10"
                      onClick={submitUpdate}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section (General, Edit Profile, etc.) */}
          <div className="w-full flex flex-col md:flex-row mt-5">
            <div className="w-full md:w-1/3 p-5 space-y-10 font-bold">
              <p
                className={`${
                  state === 0 ? "text-[#465EA6]" : "text-[#AAA4A4]"
                } cursor-pointer`}
                onClick={() => checkHandledata(0)}
              >
                General
              </p>
              <p
                className={`${
                  state === 1 ? "text-[#465EA6]" : "text-[#AAA4A4]"
                } cursor-pointer`}
                onClick={() => checkHandledata(1)}
              >
                Edit Profile
              </p>
              <p
              className={`${
                state === 4 ? "text-[#465EA6]" : "text-[#AAA4A4]"
              } cursor-pointer`}
              onClick={() => checkHandledata(4)}
              >
              Change Password
              </p>
              {role !== "patient" && (
                <>
                  <p
                    className={`${
                      state === 3 ? "text-[#465EA6]" : "text-[#AAA4A4]"
                    } cursor-pointer`}
                    onClick={() => checkHandledata(3)}
                  >
                    Reviews
                  </p>
                </>
              )}
              <p
                className="text-red-500 cursor-pointer"
                onClick={() =>
                  document.getElementById("my_modal_6").showModal()
                }
              >
                Delete Account
              </p>
            </div>

            {/* ข้อมูลรายละเอียดในแต่ละ tab */}
            {(state !=4 && state !=5) && <ThemeProvider theme={theme}>
             
             <div className="w-full h-full md:w-2/3 p-5">
             {role !== "patient" && (state === 0 || state === 1) && (
               <div className="w-full mb-5">
                 <TextField
                   disabled={state === 0}
                   sx={{
                     "& .MuiInputBase-root": { borderRadius: "1rem" },
                   }}
                   className="w-full rounded-3xl"
                   label="Personal Information"
                   value={personalInformation}
                   error={typeof errors.personalInformation === "string"}
                   helperText={errors.personalInformation}
                   onChange={(e) => setPersonalInformation(e.target.value)}
                   slotProps={{
                     inputLabel: {
                       shrink: true,
                     },
                   }}
                 />
               </div>
             )}

             {state !== 3 && (
               <>
                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 ">
                   {/* ส่วน firstname / lastname ถ้า state == 1 */}
                   {state === 1 && (
                     <>
                       <TextField
                         disabled
                         sx={{
                           "& .MuiInputBase-root": { borderRadius: "1rem" },
                         }}
                         label="Firstname"
                         value={firstname}
                         onChange={(e) => setFirstname(e.target.value)}
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                       />
                       <TextField
                         disabled
                         sx={{
                           "& .MuiInputBase-root": { borderRadius: "1rem" },
                         }}
                         label="Lastname"
                         value={lastname}
                         onChange={(e) => setLastname(e.target.value)}
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                       />
                     </>
                   )}

                   {/* ถ้าเป็น Patient แสดง Citizen Number, ถ้าเป็น Doctor อาจแสดง License */}
                   {role === "patient" ? (
                     <>
                       <TextField
                         disabled
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         label="Citizen Number"
                         value={citizenNumber}
                         onChange={handleChangeCitizen}
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                       />
                       <div className="w-full relative">
                         <TextField
                           disabled
                           sx={{
                             "& .MuiInputBase-root": {
                               borderRadius: "1rem",
                             },
                           }}
                           label="Date of Birth"
                           value={changeDateFormat(dateOfBirth)}
                           slotProps={{
                             inputLabel: {
                               shrink: true,
                             },
                           }}
                           onClick={handleDatePicker}
                           className="w-full"
                         />
                         <DatePicker
                           disabled
                           className="datePicker z-50 w-full absolute -left-0 top-3"
                           maxDate={dayjs().subtract(1, "day")}
                           open={datePickerOpen}
                           onOpenChange={setDatePickerOpen}
                         />
                       </div>
                     </>
                   ) : (
                     (state === 0 || state === 1) && (
                       <>
                         <TextField
                           disabled
                           sx={{
                             "& .MuiInputBase-root": {
                               borderRadius: "1rem",
                             },
                           }}
                           label="License Number"
                           value={
                             licenseNumber == null || licenseNumber === "null"
                               ? ""
                               : licenseNumber
                           }
                           slotProps={{
                             inputLabel: {
                               shrink: true,
                             },
                           }}
                         />
                         <TextField
                           disabled={state === 0}
                           sx={{
                             "& .MuiInputBase-root": {
                               borderRadius: "1rem",
                             },
                           }}
                           label="Phone Number"
                           value={phoneNumber}
                           error={typeof errors.phoneNumber === "string"}
                           helperText={errors.phoneNumber}
                           onChange={(e)=>handleChangePhoneNumberAndEmergency(e,"phone")}
                           slotProps={{
                             inputLabel: {
                               shrink: true,
                             },
                           }}
                         />
                       </>
                     )
                   )}
           {state == 0 &&  role != "patient" && (
                     <FormControl
                       fullWidth
                       sx={{
                         "& .MuiInputBase-root ": {
                           "border-radius": "1rem",
                         },
                       }}
                     >
                       <InputLabel id="demo-simple-select-label">
                         Gender
                       </InputLabel>
                       <Select
                         error={typeof errors.gender === "string"}
                         helperText={errors.gender}
                         disabled={state === 0}
                         value={gender}
                         label="Gender"
                         onChange={(e) => setGender(e.target.value)}
                       >
                         <MenuItem value="Male">Male</MenuItem>
                         <MenuItem value="Female">Female</MenuItem>
                         <MenuItem value="Other">Other</MenuItem>
                       </Select>
                     </FormControl>
                   )}

                   {role == "doctor" && state == 1 ? (
                     <FormControl
                       fullWidth
                       sx={{
                         "& .MuiInputBase-root ": {
                           "border-radius": "1rem",
                         },
                       }}
                     >
                       <InputLabel id="demo-simple-select-label">
                         Speciality
                       </InputLabel>
                       <Select
                         value={speciality}
                         label="Speciality"
                         onChange={(e) => setSpeciality(e.target.value)}
                       >
                         {dataSpecialization.map((specialization) => (
                           <MenuItem value={specialization.id}>
                             {specialization.name}
                           </MenuItem>
                         ))}

                         {/* <MenuItem value="Female">Female</MenuItem>
                   <MenuItem value="Other">Other</MenuItem> */}
                       </Select>
                     </FormControl>
                   ) : (
                     state == 0 && (
                       <TextField
                         disabled
                         label="Email"
                         value={email}
                         sx={{
                           "& .MuiInputBase-root": {
                             "border-radius": "1rem",
                           },
                         }}
                         onChange={(e) => SetEmail(e.target.value)}
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                       />
                     )
                   )}
                   {/* ส่วน Gender / Phone Number ของ Patient */}
                   {role === "patient" && (
                     <>
                       {state === 0 ? (
                         <FormControl
                           fullWidth
                           sx={{
                             "& .MuiInputBase-root ": {
                               borderRadius: "1rem",
                             },
                           }}
                         >
                           <InputLabel id="demo-simple-select-label">
                             Gender
                           </InputLabel>
                           <Select
                             error={typeof errors.gender === "string"}
                             helperText={errors.gender}
                             disabled={state === 0}
                             value={gender}
                             label="Gender"
                             onChange={(e) => setGender(e.target.value)}
                           >
                             <MenuItem value="Male">Male</MenuItem>
                             <MenuItem value="Female">Female</MenuItem>
                             <MenuItem value="Other">Other</MenuItem>
                           </Select>
                         </FormControl>
                       ) : null}

                       <TextField
                         disabled={state === 0}
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         label="Phone Number"
                         value={phoneNumber}
                         onChange={(e) => handleChangePhoneNumberAndEmergency(e,"phone")}
                         error={typeof errors.phoneNumber === "string"}
                         helperText={errors.phoneNumber}
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                       />
                     </>
                   )}

                   {/* ส่วน email (state == 1) */}
                   {state === 1 && (
                     <TextField
                       disabled
                       label="Email"
                       type="email"
                       value={email}
                       sx={{
                         "& .MuiInputBase-root": {
                           borderRadius: "1rem",
                         },
                       }}
                       onChange={(e) => SetEmail(e.target.value)}
                       slotProps={{
                         inputLabel: {
                           shrink: true,
                         },
                       }}
                     />
                   )}

                   {/* ถ้าเป็น Patient => Emergency Contact */}
                   {state === 1 && role === "patient" && (
                     <TextField
                       disabled={state === 0}
                       sx={{
                         "& .MuiInputBase-root": {
                           borderRadius: "1rem",
                         },
                       }}
                       label="Emergency Contact"
                       value={emergency_contact}
                       onChange={(e)=>handleChangePhoneNumberAndEmergency(e,"emergency")}
                       error={typeof errors.emergency_contact === "string"}
                       helperText={errors.emergency_contact}
                       slotProps={{
                         inputLabel: {
                           shrink: true,
                         },
                       }}
                     />
                   )}
                 </div>

                 {/* ส่วน Address / Allergies / Current Medications (Patient) */}
                 {role === "patient" && (
                   <div className="w-full mt-5  pt-0 space-y-5">
                     <TextField
                       disabled={state === 0}
                       error={typeof errors.address === "string"}
                       helperText={errors.address}
                       className="w-full rounded-3xl"
                       label="Address"
                       sx={{
                         "& .MuiInputBase-root": { borderRadius: "1rem" },
                       }}
                       value={address}
                       onChange={(e) => setAddress(e.target.value)}
                       slotProps={{
                         inputLabel: {
                           shrink: true,
                         },
                       }}
                     />
                     <TextField
                       disabled={state === 0}
                       className="w-full rounded-3xl"
                       label="Allergies"
                       sx={{
                         "& .MuiInputBase-root": { borderRadius: "1rem" },
                       }}
                       value={allergies}
                       onChange={(e) => setAllergies(e.target.value)}
                       slotProps={{
                         inputLabel: {
                           shrink: true,
                         },
                       }}
                     />
                     <TextField
                       disabled={state === 0}
                       className="w-full rounded-3xl"
                       label="Current Medications"
                       sx={{
                         "& .MuiInputBase-root": { borderRadius: "1rem" },
                       }}
                       value={currentMedications}
                       onChange={(e) =>
                         setCurrentMedications(e.target.value)
                       }
                       slotProps={{
                         inputLabel: {
                           shrink: true,
                         },
                       }}
                     />
                   </div>
                 )}
               </>
             )}

             {/* แสดง Work Experience / Certificate เมื่อเป็น Doctor และ state == 0 */}
             {role !== "patient" && state === 0 && (
               <div className="w-full flex flex-col mt-5  md:flex-row space-y-5 md:space-y-0">
                 <div className="md:w-1/2 md:pr-5">
                   <h2 className="font-bold">Work Experience</h2>
                   <div className="flex items-center mt-2">
                     <img src={Work} alt="Work" className="w-10 h-10 mr-5" />
                     <div>
                       <p>{data.main_hospital}</p>
                       <p className="text-[#AAA4A4]">5 years 1 month (ตัวอย่าง)</p>
                     </div>
                   </div>
                 </div>
                 <div className="md:w-1/2 md:pl-5">
                   <h2 className="font-bold">Certificate</h2>
                   <div className="flex items-center mt-2">
                     <img src={File} alt="File" className="w-10 h-10 mr-5" />
                     <div>
                       <p className="text-[#465EA6] cursor-pointer" onClick={() => document.getElementById("pdfLink").click()}>
                       {data.certificate.split('/').pop()}
                       </p>
                       <a href={`${api}${data?.certificate}`} id="pdfLink" target="_blank"></a>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Edit Work Experience / Certificate เมื่อเป็น Doctor และ state == 1 */}
             {role !== "patient" && state === 1 && (
               <div className="w-full mt-5  space-y-5">
                 <div>
                   <h2 className="font-bold">Certificate</h2>
                   <div className="flex items-center">
                     <img src={File} alt="File" className="w-10 h-10 mr-5 ml-5" />
                     <div>
                       <p className="text-[#465EA6] cursor-pointer" onClick={() => document.getElementById("pdfLink").click()}>
                       {data.certificate.split('/').pop()}
                       </p>
                       <a href={`${api}${data?.certificate}`} id="pdfLink" target="_blank"></a>
                     </div>
                   </div>
                 </div>
                 <div className="w-full space-y-6">
                   <h2 className="font-bold">Work Experience</h2>
                   <TextField
                     label="Main Clinic / Hospital"
                     value={main_clinic_hospital}
                     onChange={(e) => setMain_Clinic_Hospital(e.target.value)}
                     error={typeof errors.main_clinic_hospital === "string"}
                     helperText={errors.main_clinic_hospital}
                     className="w-full !mb-5"
                     sx={{
                       "& .MuiInputBase-root": { borderRadius: "1rem" },
                     }}
                     slotProps={{
                       inputLabel: {
                         shrink: true,
                       },
                     }}
                   />
                   <div className="flex grid-cols-2 gap-5">
                     {/* Start Date */}
                     <div className="w-full relative !mb-5">
                       <TextField
                         label="Start Date"
                         value={startDate ? changeDateFormat(startDate) : ""}
                         error={typeof errors.startDate === "string"}
                         helperText={errors.startDate}
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         onClick={() => setDatePickerOpen1(true)}
                         className="w-full"
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                         InputProps={{
                           endAdornment: startDate && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setStartDate(null);
                                 setDatePickerOpen1(false);
                               }}
                               className="text-gray-500 hover:text-black"
                             >
                               ✖
                             </button>
                           ),
                         }}
                       />
                       <DatePicker
                         className="datePicker z-50 w-full absolute -left-0 top-3"
                         value={startDate ? dayjs(startDate) : null}
                         open={datePickerOpen1}
                         onOpenChange={setDatePickerOpen1}
                         onChange={(e) => handleDateChange(e, "startmain")}
                       />
                     </div>
                     {/* End Date */}
                     <div className="w-full relative !mb-5">
                       <TextField
                         label="End Date"
                         value={endDate ? changeDateFormat(endDate) : ""}
                         error={typeof errors.endDate === "string"}
                         helperText={errors.endDate}
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         onClick={() => setDatePickerOpen2(true)}
                         className="w-full"
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                         InputProps={{
                           endAdornment: endDate && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setEndDate(null);
                                 setDatePickerOpen2(false);
                               }}
                               className="text-gray-500 hover:text-black"
                             >
                               ✖
                             </button>
                           ),
                         }}
                       />
                       <DatePicker
                         className="datePicker z-50 w-full absolute -left-0 top-3"
                         value={endDate ? dayjs(endDate) : null}
                         minDate={startDate ? dayjs(startDate).add(2, "day").endOf("day") : undefined}

                         open={datePickerOpen2}
                         onOpenChange={setDatePickerOpen2}
                         onChange={(e) => handleDateChange(e, "endmain")}
                       />
                     </div>
                   </div>

                   <TextField
                     label="Secondary Clinic / Hospital"
                     value={secondary_hospital}
                     onChange={(e) => setSecondary_hospital(e.target.value)}
                     error={typeof errors.secondary_hospital === "string"}
                     helperText={errors.secondary_hospital}
                     className="w-full !mb-5"
                     sx={{
                       "& .MuiInputBase-root": { borderRadius: "1rem" },
                     }}
                     slotProps={{
                       inputLabel: {
                         shrink: true,
                       },
                     }}
                   />
                   <div className="flex grid-cols-2 gap-5 !mb-5">
                     {/* Start Date 2 */}
                     <div className="w-full relative !mb-5">
                       <TextField
                         label="Start Date"
                         value={
                           startDate2 ? changeDateFormat(startDate2) : ""
                         }
                         error={typeof errors.startDate2 === "string"}
                         helperText={errors.startDate2}
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         onClick={() => setDatePickerOpen3(true)}
                         className="w-full"
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                         InputProps={{
                           endAdornment: startDate2 && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setStartDate2(null);
                                 setDatePickerOpen3(false);
                               }}
                               className="text-gray-500 hover:text-black"
                             >
                               ✖
                             </button>
                           ),
                         }}
                       />
                       <DatePicker
                         className="datePicker z-50 w-full absolute -left-0 top-3"
                         value={startDate2 ? dayjs(startDate2) : null}
                         open={datePickerOpen3}
                         onOpenChange={setDatePickerOpen3}
                         onChange={(e) =>
                           handleDateChange(e, "startsecondary")
                         }
                       />
                     </div>
                     {/* End Date 2 */}
                     <div className="w-full relative !mb-5">
                       <TextField
                         label="End Date"
                         value={endDate2 ? changeDateFormat(endDate2) : ""}
                         error={typeof errors.endDate2 === "string"}
                         helperText={errors.endDate2}
                         sx={{
                           "& .MuiInputBase-root": {
                             borderRadius: "1rem",
                           },
                         }}
                         onClick={() => setDatePickerOpen4(true)}
                         className="w-full"
                         slotProps={{
                           inputLabel: {
                             shrink: true,
                           },
                         }}
                         InputProps={{
                           endAdornment: endDate2 && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setEndDate2(null);
                                 setDatePickerOpen4(false);
                               }}
                               className="text-gray-500 hover:text-black"
                             >
                               ✖
                             </button>
                           ),
                         }}
                       />
                       <DatePicker
                         className="datePicker z-50 w-full absolute -left-0 top-3"
                         value={endDate2 ? dayjs(endDate2) : null}
                         minDate={startDate2 ? dayjs(startDate2).add(2, "day").endOf("day") : undefined}
                         open={datePickerOpen4}
                         onOpenChange={setDatePickerOpen4}
                         onChange={(e) =>
                           handleDateChange(e, "endsecondary")
                         }
                       />
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Reviews เมื่อเป็น Doctor */}
             {role !== "patient" && state === 3 && (
               <div className="p-6 max-w-4xl mx-auto">
                 <div className="text-center mb-6 space-y-3">
                   <h1 className="text-4xl font-bold">
                     {calculateAverageRating(dataReview)}
                   </h1>
                   <span className="text-yellow-500 w-full flex items-center justify-center">
                     {renderStars(calculateAverageRating(dataReview))}
                   </span>
                   <p className="text-gray-500">
                     based on {dataReview?.length} reviews
                   </p>
                 </div>
                 <div className="space-y-4">
                   {dataReview.map((review, index) => (
                     <div key={index} className="p-4">
                       <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold uppercase">
                           {review.isAnonymous
                             ? "A"
                             : review.appointmentId.patientId.first_name[0]}
                         </div>
                         <div className="w-full flex justify-between">
                           <div>
                             <h3 className="font-semibold capitalize">
                               {review.isAnonymous
                                 ? "Anonymous"
                                 : `${review.appointmentId.patientId.first_name} ${review.appointmentId.patientId.last_name}`}
                             </h3>
                             <div className="flex space-x-5">
                               {renderStars(review.rating)}
                               <p>{review.rating}.0</p>
                             </div>
                           </div>
                           <span className="text-sm text-gray-500 ml-auto flex justify-end items-end">
                             <p>{daysPassed(review.created_at)}</p>
                           </span>
                         </div>
                       </div>
                       <p className="mt-2 text-[#AAA4A4]">{review.notes}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
            </ThemeProvider>
            } 
            {(state == 4 || state == 5) &&
            <div className="w-full h-full flex flex-col items-center md:w-2/3 p-5 space-y-4">
            {state == 4 && <>
              <h1 className="text-xl font-medium">Change Password</h1>
            <p className="text-sm text-[#AAA4A4]">We’ll send an email with instructions to reset your password into the email associated 
            with your account.</p>
            <button className="bg-[#465EA6] w-48  h-10 text-white rounded-full shadow-md" 
            onClick={sendInstruction}
            >
              Send Instruction
            </button>
            </>}
            {state == 5 && 
            <div className="w-full flex flex-col items-center space-y-4">
              <img src={EmailChangePassword} alt="" className="w-10" />
              <h1 className="text-xl font-medium">Check Your Maill</h1>
              <p className="text-sm text-[#AAA4A4]"> We have sent password reset instructions to your email.</p>
              </div>}
            </div>
            }
          </div>

          {/* Modal สำหรับยืนยันการลบ หรือ discard changes */}
          <dialog
            id="my_modal_6"
            className="modal modal-bottom sm:modal-middle w-screen h-screen"
          >
            <div className="modal-box bg-white flex flex-col justify-center">
              <h3 className="font-bold text-2xl text-center">
                {changePage
                  ? "Do you want to discard the changes?"
                  : "Do you want to delete your account?"}
              </h3>
              <p className="py-4 text-center text-lg"></p>
              <form method="dialog" className="flex justify-center items-center">
                <div className="modal-action">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                  {changePage ? (
                    <div className="space-x-3">
                      <button
                        className="bg-[#59A670] w-32 h-10 text-white rounded-xl shadow-md"
                        onClick={() => handlestate()}
                      >
                        Confirm
                      </button>
                      <button className="bg-[#D9D9D9] w-32 h-10 text-[#B2B1B1] rounded-xl shadow-md">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-3">
                      <button
                        className="bg-[#59A670] w-32 h-10 text-white rounded-xl shadow-md"
                        onClick={() => deleteAccount()}
                      >
                        Confirm
                      </button>
                      <button className="bg-[#D9D9D9] w-32 h-10 text-[#B2B1B1] rounded-xl shadow-md">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    );
  }
};

export default Profile;