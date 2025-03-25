import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Link,useNavigate } from "react-router-dom";
import logdform from "../Images/logo-form.png";
import BackgourdLoginDoctor from "../Images/BackgourdLoginDoctor.png";
import EmailChangePassword from "../Images/EmailChangePassword.png";
import { validateEmail } from "../composables/Common";
import { FetchEmailChangePassword } from '../composables/Fetchdata';
import { set } from 'date-fns';
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [showResponse, setShowResponse] = useState(false);
    const [error, setError] = useState("");
    const [state, setState] = useState(1);
    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        if (email === "") {
            setError("Please enter your email.");
            setShowResponse(true);
            return;
            
        }else if (!validateEmail(email)) {
            setError("Please enter a valid email.");
            setShowResponse(true);
            return;
        }else{
          let data = {
            email:email
          }
            FetchEmailChangePassword(data);
            setError("");
            setShowResponse(false);
            setState(2);
            setTimeout(() => {
                navigate('/login')
            }
            , 3000);
        }
    }
    return (
        <div className='flex h-screen w-screen'>
            <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
          <div
            style={{
              backgroundImage: `url(${
                BackgourdLoginDoctor
              })`,
            }}
            className="hidden md:block md:w-[60%] h-full"
          ></div>
          <div className="w-full md:w-[40%] h-full bg-[#EBEBEB] text-black px-4 md:px-0 flex flex-col items-center">
            <img
              src={logdform}
              alt="Top Logo Right"
              className="mx-auto mt-6 md:mt-10 w-32 md:w-auto"
            />
            {state ==1 ? 
            <>
            <h1 className="text-2xl md:text-4xl text-black font-medium text-center mb-5">
                Forgot Password
            </h1>
            <h2 className="text-sm md:text-bas px-5 text-[#878484] font-medium text-center mb-4 md:mb-8">
            We’ll send an email with instructions to recover your password into the email associated with your account.
            </h2>
            <div className="w-full flex flex-col justify-center items-center space-y-4 p-4 md:p-10  md:pb-10">
              <div className="w-full">
                <p className={showResponse ? 'text-red-500':""}>Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                  required
                  className={`w-full h-10 focus:outline-none text-base md:text-xl bg-inherit border-b-[1.5px] ${showResponse ? 'border-red-500':" border-black"}`}
                />
                {showResponse && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </div>
            <div className='w-full flex justify-center space-x-5 px-5'>
            <Link to="/login">
            <button
              type="submit"
              className="w-32  lg:w-48 h-12 lg:h-14  text-black  border-2 border-gray-300 text-sm lg:text-xl py-2 rounded-full  "
            //   onClick={(e) => submitForm(e)}
            >
              Back
            </button>
            </Link>
            <button
              type="submit"
              className="w-32 text-sm  lg:w-48 h-12 lg:h-14 bg-[#465EA6] text-white  lg:text-xl  rounded-full 
              
              "
               onClick={(e) => submit(e)}
            >
              Send Instruction
            </button>
            </div>
            </>
            :
            <div className="w-full flex flex-col items-center space-y-4">
              <img src={EmailChangePassword} alt="" className="w-10" />
              <h1 className="text-xl font-medium">Check Your Maill</h1>
              <p className="text-sm text-[#AAA4A4]"> We have sent password reset instructions to your email.</p>
              </div>
            }
            <div className="h-full flex flex-col justify-end pb-10 md:pb-20">
              <p className="text-center mt-6 text-sm md:text-base">
                Don't have an account?{" "}
                <Link 
                // to={role == "patient" ? "/register" : "/register/doctor"}
                to={"/login"}
                >
                  <a className="text-[#465EA6] hover:underline">Sign up</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
    );
}
export default ForgotPassword;