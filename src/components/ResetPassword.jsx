import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logdform from "../Images/logo-form.png";
import { TextField } from "@mui/material";
import Hide from "../Images/Hide.png";
import UnHide from "../Images/UnHide.png";
import CancelAppointment from "../Images/CancelAppointment.png";
import { UpdatePassword } from '../composables/Fetchdata';
import LoadingPage from "./LoadingPage";
import toast, { Toaster } from "react-hot-toast";
import { set } from "date-fns";
const ResetPassword = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([{ password: false, confirmPassword: false }]);
  const [hidden, setHidden] = useState(true);
  const [hidden2, setHidden2] = useState(true);
  const [state, setState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const  navigate = useNavigate();
  const email = urlParams.get('email');
const expiredAt = urlParams.get('expired_at');
useEffect(() => {
  const expiredDate = new Date(expiredAt.replace(' ', 'T'));
  const currentDate = new Date();
  if (currentDate < expiredDate) {
    setIsLoading(false);
  } else {
    setIsLoading(true);
    toast.error("หมดเวลาการเข้าถึงเว็บไซต์", {
      autoClose: 500,
      removeDelay: 500,
    })
    setTimeout(() => {
      navigate('/login')
      toast.dismiss();
    }
    , 3000);
  }
   }, [email]);
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
  const submit = (e,state) => {
    const newErrors = { ...errors };
    newErrors.password = password === false ? "Password is required" : false;
    newErrors.confirmPassword =
      confirmPassword === false
        ? "Confirm Password is required"
        : confirmPassword !== password
        ? "Password does not match"
        : false;
        setErrors(newErrors);
        const isValid = !Object.values(newErrors).some(
            (error) => typeof error === "string"
          );
        if(isValid && state == 0){
            document.getElementById("my_modal_7").showModal();
        }else if(isValid && state == 1){
            let data = {
                email:email,
                password:password
            }
            UpdatePassword(data).then((response) => {
                if(response == 200){
                    setState(1);
                }
            }
            )
            
        }
    
  };
 useEffect(() => {

    if( state == 1){
      setTimeout(() => {
        navigate('/login')
        localStorage.clear();
      }, 3000);
    }
 }, [state]);

 if (isLoading) {
  return (
    <div>
      <Toaster toastOptions={{ removeDelay: 500 }} />
      <LoadingPage />
    </div>
  );
} else {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#EBEBEB]">
      <Toaster toastOptions={{ removeDelay: 500 }} />
      <div className="w-full  h-full bg-[#EBEBEB] text-black px-4 md:px-0 flex flex-col  justify-center items-center">
        <img
          src={logdform}
          alt="Top Logo Right"
          className="mx-auto mt-6 md:mt-10 w-32 md:w-auto"
        />
        <h1 className="text-2xl md:text-4xl text-black font-medium text-center mb-5">
          {state == 0 ? "Reset Password" : "Reset Password Success !"}
        </h1>
        {state== 0 &&
        <h2 className="text-sm md:text-bas px-5 text-[#878484] font-medium text-center mb-4 md:mb-8">
        Type your new password and confirm it to proceed.
      </h2>}
        {state == 0 ?
        <div className="lg:w-[30%] w-[80%]">
        <TextField
          label="Password"
          type={hidden ? "password" : "text"}
          value={password}
          //  value={main_clinic_hospital}
          //  onChange={(e) => setMain_Clinic_Hospital(e.target.value)}
          error={typeof errors.password === "string"}
          helperText={errors.password}
          onChange={(e) => handlePasswordChange(e.target.value, "password")}
          InputProps={{
            endAdornment: (
              <img
                src={hidden ? Hide : UnHide}
                alt="hide"
                onClick={() => setHidden(!hidden)}
                className="cursor-pointer w-5"
              />
            ),
          }}
          className={`w-full !mb-5`}
          sx={{
            "& .MuiInputBase-root": { borderRadius: "1rem" },
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="Confirm Password"
          type={hidden2 ? "password" : "text"}
          value={confirmPassword}
          //  value={main_clinic_hospital}
          //  onChange={(e) => setMain_Clinic_Hospital(e.target.value)}
          error={typeof errors.confirmPassword === "string"}
          helperText={errors.confirmPassword}
          onChange={(e) =>
            handlePasswordChange(e.target.value, "confirmPassword")
          }
          InputProps={{
            endAdornment: (
              <img
                src={hidden2 ? Hide : UnHide}
                alt="hide"
                onClick={() => setHidden2(!hidden)}
                className="cursor-pointer w-5"
              />
            ),
          }}
          className={`w-full !mb-5`}
          sx={{
            "& .MuiInputBase-root": { borderRadius: "1rem" },
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <div className="w-full flex justify-center items-center space-x-4">
          <button
            className="w-32 h-10 text-back rounded-full  bg-[#D9D9D9]"
          >
              Cancel
          </button>
          <button
            className="w-32 h-10 text-white rounded-full   bg-[#465EA6]"
            disabled={(errors.password || errors.confirmPassword) !== false}
            onClick={(e) => submit(e,0)}
          >
              save
          </button>

        </div>
      </div>
        :
        <div>
                <h2 className="text-sm md:text-bas px-5 text-[#878484] font-medium text-center mb-4 md:mb-8">
                Your password has been successfully reset! You can now log in using your new password.
                    </h2>
                    </div>}
      </div>
      <dialog
        id="my_modal_7"
        className="modal modal-bottom sm:modal-middle w-screen h-screen"
      >
        <div
          className={`modal-box bg-white flex flex-col justify-center 
                text-[#465EA6]
            `}
        >
          <div className="w-full flex justify-center items-center">
            <img src={CancelAppointment} alt="Cancel" className="w-20" />
          </div>
          <h3 className="font-bold text-xl text-center">
                Are you sure you want to reset your password?
          </h3>
          <p className="py-4 text-center text-base">
          Please confirm to proceed with updating your password.
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
                className={`
                 bg-[#465EA6] w-32 h-10 text-white rounded-xl shadow-md`}
                onClick={(e) => {submit(e,1)}}
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
export default ResetPassword;
