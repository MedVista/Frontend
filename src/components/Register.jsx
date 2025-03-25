// import DatePicker from "react-datepicker";
import { DatePicker } from "antd";
// import isValidThaiID from 'thai-id-validator';
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import { fi, ro, se } from "date-fns/locale";
import {
  FetchRegister,
  FetchGetSpeciality,
  CheckEmail,
  FetchOtp,
  FetchValidateOtp
} from "../composables/Fetchdata";
import { useNavigate, Link } from "react-router-dom";
import Terms from "../composables/Terms.json";
import TermsPatient from "../composables/TermsPatient.json";
import TermsDoctor from "../composables/TermsDoctor.json";
import Modals from "./Modals";
import ImageUpload from "../Images/imageupload.png";
import { validateEmail, formatPhoneNumber } from "../composables/Common";
import Incorrect from "../Images/incorrect.png";
import Correct from "../Images/correct.png";
import { set } from "date-fns";
import { use } from "react";
import BackgourdRegister from "../Images/BackgourdRegsiter.png";
import BackgourdLoginPatient from "../Images/BackgourdLoginPatient.png";
import BackgourdLoginDoctor from "../Images/BackgourdLoginDoctor.png";
import Hide from "../Images/Hide.png";
import UnHide from "../Images/UnHide.png";
import logdform from "../Images/logo-form.png";
import Uploadphoto from "../Images/Uploadphoto.png";
import Uploadcertificate from "../Images/Uploadcertificate.png";
import Folder from "../Images/Folder.png";
import Close from "../Images/Close.png";
import toast, { Toaster } from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [prefix, setPrefix] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [citizenNumber, setCitizenNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState(0);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [allergies, setAllergies] = useState("");
  const [hsitoryMedications, setHsitoryMedications] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [fetchresponse, setFetchSponse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState("");
  const [previousValuePhoneNumber, setPreviousValuePhoneNumber] = useState("");
  const [previousValueCitizen, setPreviousValueCitizen] = useState("");
  const [dataSpecialization, setDataSpecialization] = useState([]);
  const [previousValueEmergency, setPreviousValueEmergency] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [weight, setWeight] = useState("");
  const [personalinformation, setPersonalinformation] = useState("");
  const [mainHospital, setMainHospital] = useState("");
  const [mainStartDate, setMainStartDate] = useState(null);
  const [mainEndDate, setMainEndDate] = useState(null);
  const [secondaryHospital, setSecondaryHospital] = useState("");
  const [secondaryStartDate, setSecondaryStartDate] = useState(null);
  const [secondaryEndDate, setSecondaryEndDate] = useState(null);
  const [filecertificate, setFilecertificate] = useState(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const handleNext = async () => {
    const newErrors = {};

    if (state == 0) {
      let data = {
        email: email,
      };

      // รอผลลัพธ์จาก CheckEmail
      const dataResponse = await CheckEmail(data);
      if(dataResponse === 200){
        
        FetchOtp(data)
      }
      // ตรวจสอบผลลัพธ์จาก CheckEmail
      newErrors.email =
        email === ""
          ? "Email is required"
          : !validateEmail(email)
          ? "Please enter a valid email address."
          : dataResponse != 200
          ? "Email already exists"
          : false;

      // ตรวจสอบข้อผิดพลาดอื่น ๆ
      newErrors.password = password === "" ? "Password is required" : false;
      newErrors.confirmPassword =
        confirmPassword === ""
          ? "Confirm Password is required"
          : confirmPassword !== password
          ? "Password does not match"
          : false;
    } else if (state == 1) {
      let data ={
        otp: otp.join(""),
        email: email,
      }
      const dataVidateOtp = await FetchValidateOtp(data); 
      newErrors.otp = otp.includes("") ? "Please enter the OTP code" : dataVidateOtp == 404 ? "Incorrect OTP code" :dataVidateOtp == 400 ? "OTP code has expired" : false;

    } else {
      newErrors.firstName =
        firstName === "" ? "Please enter your first name" : false;
      
      newErrors.lastName =
        lastName === "" ? "Please enter your last name" : false;

      newErrors.gender = gender === "" ? "Please select your gender" : false;
      newErrors.phoneNumber =
        phoneNumber === ""
          ? "Phone number is required"
          : phoneNumber.replace(/-/g, "").length !== 10
          ? "Phone number must be 10 digits"
          : !phoneNumber.replace(/-/g, "").match(/^0[689]\d{8}$/)
          ? "Phone number must be a valid Thai mobile number"
          : false;

      newErrors.emergencyContact =
        emergencyContact && emergencyContact.length > 1
          ? emergencyContact.replace(/-/g, "").length !== 10
            ? "Emergency Contact must be exactly 10 digits"
            : !emergencyContact.replace(/-/g, "").match(/^0[689]\d{8}$/)
            ? "Emergency Contact must be a valid Thai mobile number"
            : false
          : false;
      if (pathname === "/ssa2/register") {
        newErrors.citizenNumber =
        citizenNumber === ""
          ? "Please enter your citizen number"
          : citizenNumber.replace(/-/g, "").length !== 13
          ? "Citizen number must be 13 digits"
          : !isValidThaiID(citizenNumber.replace(/-/g, ""))
          ? "Invalid citizen number"
          : false;
        newErrors.weight = weight === "" ? "Please enter your weight" : false;
        newErrors.dateOfBirth =
          dateOfBirth === null ? "Please enter your date of birth" : false;
        newErrors.address = address === "" ? "Address is required" : false;
      } else {
        newErrors.specialization =
          specialization === "" ? "Please select your speciality" : false;

          newErrors.licenseNumber = licenseNumber === "" ? "Please enter your license number" : false;

        if (state == 4) {
          newErrors.mainHospital =
            mainHospital === "" ? "Please enter your main hospital" : false;
          newErrors.mainStartDate =
            mainStartDate === null
              ? "Please enter your main hospital start date"
              : false;
        }
      }
    }

    // ตรวจสอบข้อผิดพลาดจาก state

    if (
      newErrors.email == false &&
      newErrors.password == false &&
      newErrors.confirmPassword == false &&
      state == 0
    ) {
      setState(1);
    }
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some(
      (error) => typeof error === "string"
    );
    if (isValid && state == 1) {
      setState(2);
    }

    if (state >= 2) {
      if (isValid) {
        setState(3);

        if (state == 3) {
          setState(4);
        }
        if (state == 4) {
          setState(5);
        }
        if (state == 5) {
          setState(6);
        }
      }
      if (file != null) {
        previewFile(file);
      }
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,14}$/;
    return regex.test(password);
  };
  const handlePasswordChange = (e, type) => {
    const newPassword = e;
    type === "password"
      ? setPassword(newPassword)
      : setConfirmPassword(newPassword);

    if (!validatePassword(newPassword) && type === "password") {
      setErrors({
        ...errors,
        password:
          "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
      });
    } else if (type === "password") {
      setErrors({ ...errors, password: false });
    }

    if (!validatePassword(newPassword) && type === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
      });
    } else if (type === "confirmPassword") {
      setErrors({ ...errors, confirmPassword: false });
    }
  };

  const submitForm = async (e) => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      citizen_number: citizenNumber ? citizenNumber.replace(/-/g, "") : "",
      // date_of_birth: dateOfBirth,
      gender: gender,
      address: address,
      phone_number: phoneNumber.replace(/-/g, ""),
      allergies: allergies,
      current_medications: hsitoryMedications,
      emergencyContact: emergencyContact.replace(/-/g, ""),
      profile_picture: file,
      email: email,
      password: password,
      weight: weight,
    };
    const newErrors = {};
    if (pathname === "/ssa2/register") {
      data["date_of_birth"] = dayjs(dateOfBirth).format("YYYY-MM-DD");
      newErrors.profile_picture =
        file === null ? "Profile picture is required" : false;
      setErrors(newErrors);
      if (file) {
        const response = await FetchRegister(data, "patient");
        setFetchSponse(response);
        setShowResponse(true);
        setTimeout(() => {
          setShowResponse(false);
          if (response === 201) {
            navigate("/login");
          } else {
            if (file != null) {
              previewFile(file);
            }
          }
        }, 4000);
      }
    } else {
      // newErrors.specialization =
      //   specialization === "" ? "Specialization is required" : false;
      // newErrors.experience =
      //   experience === "" ? "Experience is required" : false;
      // newErrors.licenseNumber =
      //   licenseNumber === "" ? "License number is required" : false;
      data["specialization"] = specialization;
      data["main_hospital"] = mainHospital;
      data["main_start_date"] = dayjs(mainStartDate).format("YYYY-MM-DD");
      data["main_end_date"] =
        mainEndDate === null ? "" : dayjs(mainEndDate).format("YYYY-MM-DD");
      data["secondary_hospital"] = secondaryHospital;
      data["secondary_start_date"] =
        secondaryStartDate === null
          ? ""
          : dayjs(secondaryStartDate).format("YYYY-MM-DD");

      data["secondary_end_date"] =
        secondaryEndDate === null
          ? ""
          : dayjs(secondaryEndDate).format("YYYY-MM-DD");
      data["certificate"] = filecertificate;
      data["personal_information"] = personalinformation;
      data["license_number"] = licenseNumber;
      newErrors.profile_picture =
        file === null ? "Profile picture is required" : false;
      newErrors.certificate =
        filecertificate === null ? "Certificate is required" : false;
        
      setErrors(newErrors);
      const isValid = !Object.values(newErrors).some(
        (error) => typeof error === "string"
      );
      if ( file != null) {
        const response = await FetchRegister(data, "doctor");
        setFetchSponse(response);
        setShowResponse(true);
        setTimeout(() => {
          setShowResponse(false);
          if (response === 201) {
            navigate("/login");
          } else {
            if (file != null) {
              previewFile(file);
            }
          }
          // setState(1);
        }, 4000);
      }
    }
  };
  useEffect(() => {
    let updatedErrors = { ...errors };
    // if (prefix !== "") updatedErrors.prefix = false;
    if (dateOfBirth !== null) updatedErrors.dateOfBirth = false;
    if (firstName !== "") updatedErrors.firstName = false;
    if (citizenNumber !== "") updatedErrors.citizenNumber = false;
    if (lastName !== "") updatedErrors.lastName = false;
    if (address !== "") updatedErrors.address = false;
    if (gender !== "") updatedErrors.gender = false;
    if (phoneNumber !== "") updatedErrors.phoneNumber = false;
    if (email !== "") updatedErrors.email = false;
    if (password !== "" && validatePassword(password))
      updatedErrors.password = false;
    if (confirmPassword !== "" && validatePassword(confirmPassword))
      updatedErrors.confirmPassword = false;
    if (specialization !== "") updatedErrors.specialization = false;
    if (experience !== "") updatedErrors.experience = false;
    if (licenseNumber !== "") updatedErrors.licenseNumber = false;
    if (file !== null) updatedErrors.profile_picture = false;
    if (weight !== "") updatedErrors.weight = false;
    if (emergencyContact !== "") updatedErrors.emergency_contact = false;
    setErrors(updatedErrors); // Set the errors state once
  }, [
    // prefix,
    dateOfBirth,
    firstName,
    citizenNumber,
    lastName,
    address,
    gender,
    phoneNumber,
    email,
    password,
    confirmPassword,
    specialization,
    experience,
    licenseNumber,
    file,
    weight,
    emergencyContact,
  ]);
  useEffect(() => {
    if (pathname === "/ssa2/register/doctor") {
      FetchGetSpeciality().then((data) => {
        setDataSpecialization(data);
      });
    }
  }, []);
  function previewFile(files) {
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
  }
  const formatCitizenNumber = (value, previousValue) => {
    // ลบอักขระที่ไม่ใช่ตัวเลขทั้งหมด
    const numericValue = value.replace(/\D/g, "");

    // ฟอร์แมตตัวเลขด้วยการเพิ่ม `-` ตามตำแหน่ง
    const formatted = numericValue
      .replace(/(\d{1})(\d{0,4})/, "$1-$2") // 1-xxxx
      .replace(/(\d{1}-\d{4})(\d{0,5})/, "$1-$2") // 1-xxxx-yyyyy
      .replace(/(\d{1}-\d{4}-\d{5})(\d{0,2})/, "$1-$2") // 1-xxxx-yyyyy-zz
      .replace(/(\d{1}-\d{4}-\d{5}-\d{2})(\d{0,1})/, "$1-$2") // 1-xxxx-yyyyy-zz-x
      .slice(0, 17);

    // ตรวจสอบการกด Backspace และลบ "-" ได้อย่างถูกต้อง
    if (value.length < previousValue.length) {
      // หากลบตัวเลข ให้คืนค่าว่างแทน "-"
      if (previousValue[previousValue.length - 1] === "-") {
        return formatted.slice(0, -1);
      }
    }

    return formatted;
  };
  const handleChangePhoneNumber = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(
      inputValue,
      previousValuePhoneNumber
    );
    setPreviousValuePhoneNumber(phoneNumber); // เก็บค่าก่อนหน้า
    setPhoneNumber(formattedValue); // อัปเดตค่าที่ฟอร์แมตแล้ว
  };
  const handleChangeEmergency = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(
      inputValue,
      previousValueEmergency
    );
    setPreviousValueEmergency(emergencyContact); // เก็บค่าเดิม
    setEmergencyContact(formattedValue); // ตั้งค่าฟอร์แมตใหม่
  };
  const handleChangeCitizen = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCitizenNumber(
      inputValue,
      previousValueCitizen
    );
    setPreviousValueCitizen(citizenNumber); // เก็บค่าเดิม
    setCitizenNumber(formattedValue); // ตั้งค่าฟอร์แมตใหม่
  };
  function isValidThaiID(id) {
    if (typeof id === "number") {
      id = id.toString();
    }
    // ตรวจสอบรูปแบบ
    if (!/^\d{13}$/.test(id)) {
      return false;
    }
    // คำนวณ Checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += Number(id[i]) * (13 - i);
    }
    const checksum = (11 - (sum % 11)) % 10;
    return checksum === Number(id[12]);
  }
  const textAreaRef = useRef(null);
  useEffect(() => {
    if (textAreaRef.current) {
      // รีเซ็ตความสูงเป็น "auto" ก่อนเพื่อให้สามารถปรับได้ตามเนื้อหาที่เปลี่ยน
      textAreaRef.current.style.height = "auto";
      // ตั้งค่าความสูงใหม่ให้เท่ากับ scrollHeight ของ textarea
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [personalinformation]);
  const handleChangePersonalinformation = (e) => {
    // ตรวจสอบว่า textArea ความสูงเกินขีดจำกัดหรือไม่
    if (textAreaRef.current.scrollHeight <= 120) {
      setPersonalinformation(e.target.value);
    }
  };
  const handleUpload = (e) => {
    const file = e;
    setFilecertificate(file);
  };
  const handleRemovefile = (file) => {
    setFilecertificate(null); // Remove the file from state
  };
  const goback = () => {
    console.log(state);

    if (state === 1) {
      setState(0);
    } else if (state === 2) {
      setState(1);
    } else if (state === 3) {
      setState(2);
    } else if (state === 4) {
      setState(3);
    } else if (state === 5) {
      setState(4);
    } else if (state === 6) {
      setState(5);
    }
  };
  const handleOTPChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    setErrors({ ...errors, otp: false });
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    mainStartDate > mainEndDate && setMainEndDate(null);
    secondaryStartDate > secondaryEndDate && setSecondaryEndDate(null);
  }, [mainStartDate, mainEndDate, secondaryStartDate, secondaryEndDate]);
  return (
    <div
      style={{
        backgroundImage: `url(${
          state == 0 ? "" : state == 1 ? "" : BackgourdRegister
        })`,
        backgroundColor: `${state == 1 ? "#EBEBEB" : ""}`,
      }}
      className="w-screen h-screen  flex flex-col items-center   overflow-y-auto text-[#484646] "
    >
      <Toaster toastOptions={{ removeDelay: 500 }} />
      {(state === 0 || state == 1) && (
        <div className="w-full h-full flex justify-center items-center">
          <div
            style={{
              backgroundImage: `url(${
                pathname === "/ssa2/register"
                  ? BackgourdLoginPatient
                  : BackgourdLoginDoctor
              })`,
            }}
            className=" h-full hidden md:block md:w-[60%]"
          ></div>
          <div className="flex flex-col   items-center  w-full md:w-[40%]  h-full bg-[#EBEBEB]">
            <img
              src={logdform}
              alt="Top Logo Right"
              className="mx-auto mt-10 "
            />
            <h1 className=" text-4xl font-medium text-center ">
              {state == 0 ? "Sign up" : "Enter Code"}
            </h1>
            <h2 className=" text-[#878484] text-lg font-medium text-center mb-8 ">
              {state == 0
                ? "Your Gateway to Smarter Healthcare"
                : "We sent OTP code to your email address"}
            </h2>
            {state == 0 ? (
              <div className="w-full  flex flex-col justify-center items-center space-y-4 p-4 md:p-10  pb-10">
                <div className="w-full">
                  <p className={errors.email ? "text-red-500" : ""}>Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    className={`w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] ${
                      errors.email ? "border-red-500" : " border-black"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">{errors.email}</span>
                  )}
                </div>
                <div className="w-full relative">
                  <p className={errors.password ? "text-red-500" : ""}>
                    Password
                  </p>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      handlePasswordChange(e.target.value.trim(), "password")
                    }
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    className={`w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] ${
                      errors.password ? "border-red-500" : " border-black"
                    }`}
                    required
                  />
                  <img
                    src={showPassword ? UnHide : Hide}
                    alt="Hide"
                    className="w-6 absolute right-1 top-8 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password}
                    </span>
                  )}
                </div>
                <div className="w-full relative">
                  <p className={errors.confirmPassword ? "text-red-500" : ""}>
                    Confirm Password
                  </p>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    onChange={(e) =>
                      handlePasswordChange(
                        e.target.value.trim(),
                        "confirmPassword"
                      )
                    }
                    className={`w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : " border-black"
                    }`}
                    required
                  />
                  <img
                    src={showConfirmPassword ? UnHide : Hide}
                    alt="Hide"
                    className="w-6 absolute right-1 top-8 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-2">
                <p className="text-center mb-5">
                  Please enter the OTP code we sent to your email address
                </p>
                <div className="w-full flex justify-center items-center space-x-4 p-5 pt-2 ">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOTPChange(index, e)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-lg border-2 bg-white border-gray-300 rounded-md focus:border-blue-500 focus:outline-none ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <span className="text-red-500 text-base mb-2">{errors.otp}</span>
                )}
              </div>
            )}
            <button
              type="submit"
              className=" w-72 h-14 bg-[#465EA6] text-white text-xl py-2  rounded-full hover:bg-blue-600 transition duration-300"
              onClick={(e) => handleNext()}
            >
              {state == 0 ? "Continue" : "Verify Email"}
            </button>

            <div className="h-full  flex flex-col justify-end pb-20">
              <p className="text-center mt-6">
                Already have account?{" "}
                <Link to="/login">
                  <a className="text-[#465EA6] hover:underline">login</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      {state === 2 && (
        <div className="w-full flex flex-col justify-center items-center px-4 py-8 sm:px-8">
          <img src={logdform} alt="Top Logo Right" />
          <h1 className="text-2xl sm:text-4xl font-medium text-center mb-2">
            Terms and Conditions
          </h1>
          <h2 className="text-[#878484] text-lg font-medium text-center mb-5">
            ข้อกำหนดและเงื่อนไขการใช้บริการ MedVista
          </h2>
          <div className="p-5 border-2 border-[#465EA6] rounded-3xl w-full sm:w-4/5 md:w-full space-y-4   mb-5">
            {pathname === "/ssa2/register" ?TermsPatient.terms.map((e)=> {
              return <p className="text-[#484646] text-lg">{e}</p>
            }) :TermsDoctor.terms.map((e)=> {
              return <p className="text-[#484646] text-lg">{e}</p>
            })}
          </div>
          <div className="w-full sm:w-4/5 md:w-full  flex items-center justify-start space-x-4 pb-5">
            <input
              type="checkbox"
              value={policy}
              onChange={(e) => setPolicy(e.target.checked)}
              className="checkbox rounded-full w-4 h-4 border-[#465EA6] [--chkbg:theme(colors.indigo.600)] [--chkfg:#465EA6] checked:border-[#465EA6]"
            />
            <span className="flex max-sm:flex-col max-md:flex-col">
              I acknowledge and agree with the Terms and Conditions and
              acknowledge{" "}
              <span className="flex">
                <p className="text-[#465EA6] ">&nbsp; Privacy Policy </p>.
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => policy && setState(3)}
            className="w-72 h-14 bg-[#465EA6] text-white text-xl py-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Continue
          </button>
        </div>
      )}
      {state != 0 && state != 1 && state != 2 && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <img src={logdform} alt="Top Logo Right" className="mx-auto mt-10 " />
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-medium text-center -mt-2 ">
            {pathname === "/ssa2/register"
              ? "New Patient Registration"
              : "New Doctor Registration"}
          </h1>
          {pathname == "/ssa2/register" && !showResponse && (
            <h2 className=" text-[#878484] text-lg font-medium text-center mb-8 ">
              {state == 3 ? "Step 1 of 2" : "Step 2 of 2"}
            </h2>
          )}
          {pathname === "/ssa2/register/doctor" && !showResponse && (
            <h2 className=" text-[#878484] text-lg font-medium text-center mb-8 ">
              {state == 3
                ? "Step 1 of 4"
                : state == 4
                ? "Step 2 of 4"
                : state == 5
                ? "Step 3 of 4"
                : "Step 4 of 4"}
            </h2>
          )}
          {!showResponse && (
            <form
              onSubmit={(e) => {
                e.preventDefault(); // ป้องกันการรีเฟรชเมื่อกดปุ่ม submit
              }}
            >
              {state === 3 && (
                <div className="text-[#484646] space-y-6 ">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
                    {/* Left column */}
                    <div>
                      <label
                        className={`block font-semibold ${
                          errors.firstName ? "text-red-500" : ""
                        }`}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        minLength={1}
                        maxLength={30}
                        onChange={(e) => setFirstName(e.target.value.trim())}
                        className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                          errors.firstName ? "border-red-500" : "border-black"
                        }`}
                      />
                      {errors.firstName && (
                        <span className="text-red-500 text-xs">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div>
                      <label
                        className={`block font-semibold ${
                          errors.lastName ? "text-red-500" : ""
                        }`}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        minLength={1}
                        maxLength={30}
                        onChange={(e) => setLastName(e.target.value.trim())}
                        className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                          errors.lastName ? "border-red-500" : "border-black"
                        }`}
                      />
                      {errors.lastName && (
                        <span className="text-red-500 text-xs">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                    {/* Citizen Number */}
                    {pathname == "/ssa2/register" ?
                    <div>
                    <label
                      className={`block font-semibold ${
                        errors.citizenNumber ? "text-red-500" : ""
                      }`}
                    >
                      Citizen Number
                    </label>
                    <input
                      type="text"
                      value={citizenNumber}
                      minLength={17}
                      maxLength={17}
                      onChange={handleChangeCitizen}
                      className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                        errors.citizenNumber
                          ? "border-red-500"
                          : "border-black"
                      }`}
                    />
                    {errors.citizenNumber && (
                      <span className="text-red-500 text-xs">
                        {errors.citizenNumber}
                      </span>
                    )}
                  </div>
                    :
                    <div>
                      <label
                        className={`block font-semibold ${
                          errors.licenseNumber ? "text-red-500" : ""
                        }`}
                      >
                        LicenseNumber
                      </label>
                      <input
                        type="text"
                        value={licenseNumber}
                        maxLength={5}
                        onChange={(e) => setLicenseNumber(e.target.value.trim())}
                        className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                          errors.licenseNumber
                            ? "border-red-500"
                            : "border-black"
                        }`}
                      />
                      {errors.licenseNumber && (
                        <span className="text-red-500 text-xs">
                          {errors.licenseNumber}
                        </span>
                      )}
                    </div>
                    }

                    {/* Gender */}
                    <div>
                      <label
                        className={`block font-semibold ${
                          errors.gender ? "text-red-500" : ""
                        }`}
                      >
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value.trim())}
                        className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                          errors.gender ? "border-red-500" : "border-black"
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && (
                        <span className="text-red-500 text-xs">
                          {errors.gender}
                        </span>
                      )}
                    </div>

                    {/* Phone number */}
                    <div>
                      <label
                        className={`block font-semibold ${
                          errors.phoneNumber ? "text-red-500" : ""
                        }`}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handleChangePhoneNumber}
                        maxLength={12}
                        className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                          errors.phoneNumber ? "border-red-500" : "border-black"
                        }`}
                      />
                      {errors.phoneNumber && (
                        <span className="text-red-500 text-xs">
                          {errors.phoneNumber}
                        </span>
                      )}
                    </div>

                    {/* Patient dateOfBirth or Doctor specialization */}
                    {pathname === "/ssa2/register" ? (
                      <div>
                        <label
                          className={`block font-semibold ${
                            errors.dateOfBirth ? "text-red-500" : ""
                          }`}
                        >
                          Date of Birth
                        </label>
                        <DatePicker
                          value={dateOfBirth}
                          onChange={(date) => setDateOfBirth(date)}
                          placeholder=""
                          format="DD-MM-YYYY"
                          className={`custom-date-picker w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                            errors.dateOfBirth ? "border-red-500" : ""
                          } ${dateOfBirth ? "text-black" : "text-[#484646]"}`}
                          style={{
                            borderColor: errors.dateOfBirth ? "red" : "black",
                          }}
                          maxDate={dayjs()}
                        />
                        {errors.dateOfBirth && (
                          <span className="text-red-500 text-xs">
                            {errors.dateOfBirth}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label
                          className={`block font-semibold ${
                            errors.specialization ? "text-red-500" : ""
                          }`}
                        >
                          Specialization
                        </label>
                        <select
                          name="specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                            errors.specialization
                              ? "border-red-500"
                              : "border-black"
                          }`}
                        >
                          <option value="">Select</option>
                          {dataSpecialization.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.specialization && (
                          <span className="text-red-500 text-xs">
                            {errors.specialization}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Patient-only fields or Doctor personal info */}
                  {pathname === "/ssa2/register" ? (
                    <>
                      {/* Address */}
                      <div>
                        <label
                          className={`block font-semibold ${
                            errors.address ? "text-red-500" : ""
                          }`}
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value.trim())}
                          className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                            errors.address ? "border-red-500" : "border-black"
                          }`}
                        />
                        {errors.address && (
                          <span className="text-red-500 text-xs">
                            {errors.address}
                          </span>
                        )}
                      </div>

                      {/* Emergency + Weight */}
                      <div className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0 mt-2">
                        <div className="lg:w-1/2">
                          <label
                            className={`block font-semibold ${
                              errors.emergencyContact ? "text-red-500" : ""
                            }`}
                          >
                            Emergency Contact
                          </label>
                          <input
                            type="text"
                            value={emergencyContact}
                            onChange={handleChangeEmergency}
                            className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                              errors.emergencyContact
                                ? "border-red-500"
                                : "border-black"
                            }`}
                          />
                          {errors.emergencyContact && (
                            <span className="text-red-500 text-xs">
                              {errors.emergencyContact}
                            </span>
                          )}
                        </div>
                        <div className="lg:w-1/2">
                          <label
                            className={`block font-semibold ${
                              errors.weight ? "text-red-500" : ""
                            }`}
                          >
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value.trim())}
                            className={`w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent ${
                              errors.weight ? "border-red-500" : "border-black"
                            }`}
                          />
                          {errors.weight && (
                            <span className="text-red-500 text-xs">
                              {errors.weight}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Allergies & Medications */}
                      <div className="mt-2 space-y-4">
                        <div>
                          <label
                            htmlFor="allergies"
                            className="block text-sm font-medium"
                          >
                            Allergies
                          </label>
                          <input
                            id="allergies"
                            type="text"
                            value={allergies}
                            onChange={(e) =>
                              setAllergies(e.target.value.trim())
                            }
                            className="w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent border-black"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="medications"
                            className="block text-sm font-medium"
                          >
                            Current Medications
                          </label>
                          <input
                            id="medications"
                            type="text"
                            value={hsitoryMedications}
                            onChange={(e) =>
                              setHsitoryMedications(e.target.value.trim())
                            }
                            className="w-full h-10 focus:outline-none text-lg border-b-[1.5px] bg-transparent border-black"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Doctor personal info */
                    <div className="mt-5">
                      <label className="block font-semibold">
                        Personal Information
                      </label>
                      <textarea
                        value={personalinformation}
                        ref={textAreaRef}
                        onChange={handleChangePersonalinformation}
                        rows="1"
                        className={`w-full text-lg bg-transparent focus:outline-none ${
                          errors.personalinformation ? "border-red-500" : ""
                        }`}
                        style={{
                          resize: "none",
                          paddingBottom: "8px",
                          border: "1.5px solid #EBEBEB",
                          borderBottom: "1.5px solid black",
                        }}
                      />
                      {errors.personalinformation && (
                        <span className="text-red-500 text-xs">
                          {errors.personalinformation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              {state === 4 && pathname === "/ssa2/register" && (
                <div className="w-full flex flex-col items-center text-[#465EA6]">
                  <div className="w-full sm:w-4/5 lg:w-2/3 flex flex-col items-center mb-6 rounded-3xl border-2 border-[#465EA6] bg-[#DADDE4] px-4 py-8">
                    <div className="flex flex-col items-center mb-6">
                      <input
                        type="file"
                        id="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          e.preventDefault();
                          const fileSelected = e.target.files[0];
                          if (!fileSelected) return;
                          if (fileSelected.size > 4 * 1024 * 1024) {
                            // File size > 4MB
                            e.target.value = null;
                              toast.error("File size must be less than 4MB!",{
                                autoClose: 500,
                                removeDelay: 500,
                              });
                              setTimeout(() => {
                                toast.dismiss();
                              }, 1000);
                            return;
                          }
                          previewFile(fileSelected);
                        }}
                      />
                      <label
                        htmlFor="file"
                        className={`relative text-sm w-52 h-48 flex flex-col items-center justify-center rounded-3xl font-semibold cursor-pointer ${
                          errors.profile_picture
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                      >
                        {!file && (
                          <img
                            src={Uploadphoto}
                            alt="upload"
                            className="mx-auto"
                          />
                        )}
                        {file && (
                          <img
                            id="preview"
                            className="absolute w-52 h-48 rounded-3xl p-2 z-10 border-2 border-[#465EA6]"
                            onClick={() =>
                              document.getElementById("file").click()
                            }
                          />
                        )}
                      </label>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-center">
                      Select and upload your profile picture.
                    </h1>
                    <p className="text-center mt-3 text-sm sm:text-base">
                      .png, .jpeg files up to 4MB. Recommended size 400×400px.
                    </p>
                    <button
                      className="w-40 h-8 bg-[#465EA6] text-white rounded-full mb-6 mt-5"
                      onClick={() => document.getElementById("file").click()}
                    >
                      Upload
                    </button>
                  </div>

                  <div className="space-x-6">
                    <button
                      className="w-32 sm:w-48 h-10 bg-[#CDCDCD] text-black rounded-full"
                      onClick={() => setState(3)}
                    >
                      Back
                    </button>
                    <button
                      className="w-32 sm:w-48 h-10 bg-[#465EA6] text-white rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        submitForm();
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              )}
              {state === 4 && pathname === "/ssa2/register/doctor" && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className=" mt-5 ">
                      <label
                        className={`block font-semibold ${
                          errors.mainHospital ? "text-red-500" : ""
                        }`}
                      >
                        Main Hospital/Clinic
                      </label>
                      <input
                        type="text"
                        value={mainHospital}
                        onChange={(e) => setMainHospital(e.target.value.trim())}
                        className={`w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px]  border-black
                    ${errors.mainHospital ? "border-red-500" : ""}`}
                      />
                      {errors.mainHospital && (
                        <span className="text-red-500 text-xs">
                          {errors.mainHospital}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex space-x-20">
                      <div className="w-1/2 space-y-4">
                        <div>
                          <label
                            className={`block font-semibold ${
                              errors.mainStartDate ? "text-red-500" : ""
                            }`}
                          >
                            Main Start Date
                          </label>
                          <DatePicker
                            value={mainStartDate}
                            onChange={(date) => setMainStartDate(date)}
                            placeholder=""
                            format="DD-MM-YYYY"
                            // maxDate={dayjs().subtract(1, "day")}

                            className={` custom-date-picker w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] 
                           ${errors.mainStartDate ? "border-red-500" : ""} ${
                              mainStartDate == ""
                                ? "text-[#484646]"
                                : "text-black"
                            }`}
                            style={{
                              borderColor: errors.mainStartDate
                                ? "red"
                                : "black",
                            }}
                          />
                          {errors.mainStartDate && (
                            <span className="text-red-500 text-xs">
                              {errors.mainStartDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-1/2 space-y-4">
                        <div>
                          <label
                            className={`block font-semibold ${
                              errors.mainEndDate ? "text-red-500" : ""
                            }`}
                          >
                            Main End Date
                          </label>
                          <DatePicker
                            value={mainEndDate}
                            onChange={(date) => setMainEndDate(date)}
                            placeholder=""
                            format="DD-MM-YYYY"
                            minDate={
                              mainStartDate
                                ? dayjs(mainStartDate).add(1, "day")
                                : undefined
                            }
                            className={` custom-date-picker w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] 
                           ${errors.mainEndDate ? "border-red-500" : ""} ${
                              mainEndDate == ""
                                ? "text-[#484646]"
                                : "text-black"
                            }`}
                            style={{
                              borderColor: errors.mainEndDate ? "red" : "black",
                            }}
                          />
                          {errors.mainEndDate && (
                            <span className="text-red-500 text-xs">
                              {errors.mainEndDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className=" mt-5 ">
                      <label
                        className={`block font-semibold ${
                          errors.secondaryHospital ? "text-red-500" : ""
                        }`}
                      >
                        Secondary Hospital/Clinic
                      </label>
                      <input
                        type="text"
                        value={secondaryHospital}
                        onChange={(e) =>
                          setSecondaryHospital(e.target.value.trim())
                        }
                        className={`w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px]  border-black
                    ${errors.secondaryHospital ? "border-red-500" : ""}`}
                      />
                      {errors.secondaryHospital && (
                        <span className="text-red-500 text-xs">
                          {errors.secondaryHospital}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex space-x-20">
                      <div className="w-1/2 space-y-4">
                        <div>
                          <label
                            className={`block font-semibold ${
                              errors.secondaryStartDate ? "text-red-500" : ""
                            }`}
                          >
                            Secondary Start Date
                          </label>
                          <DatePicker
                            value={secondaryStartDate}
                            onChange={(date) => setSecondaryStartDate(date)}
                            placeholder=""
                            format="DD-MM-YYYY"
                            // maxDate={dayjs().subtract(1, "day")}
                            className={` custom-date-picker w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] 
                           ${
                             errors.secondaryStartDate ? "border-red-500" : ""
                           } ${
                              secondaryStartDate == ""
                                ? "text-[#484646]"
                                : "text-black"
                            }`}
                            style={{
                              borderColor: errors.secondaryStartDate
                                ? "red"
                                : "black",
                            }}
                          />
                          {errors.secondaryStartDate && (
                            <span className="text-red-500 text-xs">
                              {errors.secondaryStartDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-1/2 space-y-4">
                        <div>
                          <label
                            className={`block font-semibold ${
                              errors.secondaryEndDate ? "text-red-500" : ""
                            }`}
                          >
                            Secondary End Date
                          </label>
                          <DatePicker
                            value={secondaryEndDate}
                            onChange={(date) => setSecondaryEndDate(date)}
                            placeholder=""
                            format="DD-MM-YYYY"
                            minDate={
                              secondaryStartDate
                                ? dayjs(secondaryStartDate).add(1, "day")
                                : undefined
                            }
                            className={` custom-date-picker w-full h-10   focus:outline-none text-xl bg-inherit border-b-[1.5px] 
                           ${errors.secondaryEndDate ? "border-red-500" : ""} ${
                              secondaryEndDate == ""
                                ? "text-[#484646]"
                                : "text-black"
                            }`}
                            style={{
                              borderColor: errors.secondaryEndDate
                                ? "red"
                                : "black",
                            }}
                          />
                          {errors.secondaryEndDate && (
                            <span className="text-red-500 text-xs">
                              {errors.secondaryEndDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {state === 5 &&
                !showResponse &&
                pathname === "/ssa2/register/doctor" && (
                  <div className="w-full flex flex-col items-center text-[#465EA6] p-4">
                    <div className="max-w-[90%] sm:w-[80%] md:w-[70%] flex flex-col items-center mb-6 rounded-3xl border-2 border-[#465EA6] bg-[#DADDE4] p-6">
                      <div className="flex flex-col items-center mb-6 mt-6">
                        <input
                          type="file"
                          id="uploadcertificate"
                          accept="image/png, image/jpeg, application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            e.preventDefault();
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 10 * 1024 * 1024) {
                              
                              toast.error("File size must be less than 10MB!",{
                                autoClose: 500,
                                removeDelay: 500,
                              });
                              setTimeout(() => {
                                toast.dismiss();
                              }, 1000);
                              return;
                            }
                            handleUpload(file);
                          }}
                        />

                        <label
                          htmlFor="uploadcertificate"
                          className={`relative text-sm w-40 sm:w-48 h-40 sm:h-48 flex flex-col items-center justify-center rounded-3xl font-semibold cursor-pointer ${
                            errors.uploadcertificate
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        >
                          <img
                            src={Uploadcertificate}
                            alt="Upload"
                            className="w-24 sm:w-28"
                          />
                        </label>
                      </div>

                      <h1 className="text-xl sm:text-2xl font-medium text-center">
                        Select and upload your certificate file.
                      </h1>
                      <p className="text-center mt-3 text-sm sm:text-base">
                        .png, .jpeg, .pdf files up to 10MB.
                      </p>

                      <button
                        className="w-40 sm:w-48 h-10 bg-[#465EA6] text-white rounded-full mt-5"
                        onClick={() =>
                          document.getElementById("uploadcertificate")?.click()
                        }
                      >
                        Browse file
                      </button>
                    </div>

                    {filecertificate && (
                      <div className="max-w-[90%] sm:w-[80%] md:w-[70%] w-full flex items-center space-x-4 bg-[#E2E2E2] p-4 pl-6 rounded-3xl relative mt-4">
                        <img
                          src={Folder}
                          alt="Folder"
                          className="w-8 sm:w-10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[#484646] font-medium truncate text-sm sm:text-base">
                            {filecertificate.name}
                          </p>
                          <p className="text-[#878484] text-xs sm:text-sm">
                            {(filecertificate.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <img
                          src={Close}
                          alt="Close"
                          className="w-3 absolute right-4 sm:right-6 cursor-pointer"
                          onClick={() => handleRemovefile(filecertificate)}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-4 mt-5">
                      <button
                        className="w-32 sm:w-40 h-10 bg-[#CDCDCD] text-black rounded-full"
                        onClick={() => setState(4)}
                      >
                        Back
                      </button>
                      <button
                        className="w-32 sm:w-40 h-10 bg-[#465EA6] text-white rounded-full disabled:opacity-50"
                        disabled={!filecertificate}
                        onClick={(e) => {
                          e.preventDefault();
                          setState(6);
                          if (file) {
                            previewFile(file);
                          }
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              {state === 6 &&
                !showResponse &&
                pathname === "/ssa2/register/doctor" && (
                  <div className="w-full flex flex-col items-center text-[#465EA6]">
                    <div className="w-full sm:w-4/5 lg:w-2/3 flex flex-col items-center mb-6 rounded-3xl border-2 border-[#465EA6] bg-[#DADDE4] px-4 py-8">
                      <div className="flex flex-col items-center mb-6">
                        <input
                          type="file"
                          id="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            e.preventDefault();
                            const fileSelected = e.target.files[0];
                            if (!fileSelected) return;
                            if (fileSelected.size > 4 * 1024 * 1024) {
                              // File size > 4MB
                              e.target.value = null;
                              toast.error("File size must be less than 4MB!",{
                                autoClose: 500,
                                removeDelay: 500,
                              });
                              setTimeout(() => {
                                toast.dismiss();
                              }, 1000);
                              return;
                            }
                            previewFile(fileSelected);
                          }}
                        />
                        <label
                          htmlFor="file"
                          className={`relative text-sm w-52 h-48 flex flex-col items-center justify-center rounded-3xl font-semibold cursor-pointer ${
                            errors.profile_picture
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        >
                          {!file && (
                            <img
                              src={Uploadphoto}
                              alt="upload"
                              className="mx-auto"
                            />
                          )}
                          {file && (
                            <img
                              id="preview"
                              className="absolute w-52 h-48 rounded-3xl p-2 z-10 border-2 border-[#465EA6]"
                              onClick={() =>
                                document.getElementById("file").click()
                              }
                            />
                          )}
                        </label>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-medium text-center">
                        Select and upload your profile picture.
                      </h1>
                      <p className="text-center mt-3 text-sm sm:text-base">
                        .png, .jpeg files up to 4MB. Recommended size 400×400px.
                      </p>
                      <button
                        className="w-40 h-8 bg-[#465EA6] text-white rounded-full mb-6 mt-5"
                        onClick={() => document.getElementById("file").click()}
                      >
                        Upload
                      </button>
                    </div>

                    <div className="space-x-6">
                      <button
                        className="w-32 sm:w-48 h-10 bg-[#CDCDCD] text-black rounded-full"
                        onClick={() => setState(5)}
                      >
                        Back
                      </button>
                      <button
                        className="w-32 sm:w-48 h-10 bg-[#465EA6] text-white rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          submitForm();
                        }}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                )}
            </form>
          )}
          {showResponse && (
            <div className="w-full h-full flex flex-col justify-center items-center space-y-3 z-50 ">
              <img
                src={fetchresponse == 201 ? Correct : Incorrect}
                alt="Correct"
                className="w-56 max-sm:w-40"
              />
              <p className={`text-xl font-bold text-black`}>
                {fetchresponse == 201 ? (
                  <div className="flex flex-col items-center">
                    <p>You’re all set up !</p>
                    <p className="text-[#878484]">
                      Account creation successful! You can now start using your
                      account.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p>Failed to set up your account.</p>
                    {Object?.values(fetchresponse)?.map((item) => {
                      return (
                        <p className=" py-2 text-[#878484] text-lg max-sm:text-sm text-start ">
                          {item}
                        </p>
                      );
                    })}
                  </div>
                )}
              </p>
            </div>
          )}
          <div className="flex flex-col items-center mt-5 px-4 sm:px-6 md:px-8">
            {(state === 3 ||
              (state == 4 && pathname == "/ssa2/register/doctor")) && (
              <div className="flex space-x-4">
                <button
                  className="md:w-48 max-sm:w-36 px-4 py-2 h-10 bg-[#CDCDCD] text-black rounded-full"
                  onClick={() => goback()}
                >
                  Back
                </button>

                <button
                  className="bg-[#465EA6] text-white px-4 py-2 rounded-full  max-sm:w-36 md:w-52 mb-2"
                  onClick={handleNext}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Register;
