import React from 'react';
import Home from './components/Home';
 import Login from './components/Login';
 import DoctorDetail from './components/DoctorDetail';
import Appointment from './components/Appointment';
import AppointmentDetail from './components/AppointmentDetail';
import VideoCall from './components/VideoCall';
import CallUser from './components/Calluser';
import Register from './components/Register';
import Profile from './components/Profile';
import { BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import { CheckToken } from './composables/Fetchdata';
import ProtectedRoute from './ProtectedRoute';
import { useState,useEffect } from 'react';
import Speciality from './components/Speciality';
import Schedule from './components/Schedule';
import Doctor from './components/Doctor';
import Patientlist from './components/Patientlist';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Admin from './components/Admin';
function App() {

  return (
    <BrowserRouter  basename="/ssa2">
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Navigate to="/home" replace />   </ProtectedRoute>}  />
          <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}  />
          <Route path="/login" element={<Login />} />
          <Route path="/home/:id" element={<ProtectedRoute><DoctorDetail /></ProtectedRoute>} />
          <Route path="/appointment" element={<ProtectedRoute ><Appointment /></ProtectedRoute>} /> 
           <Route path="/appointment/:id" element={<ProtectedRoute ><AppointmentDetail /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/login" element={<Login /> } />
          <Route path="/home/speciality/:id" element={<ProtectedRoute><Speciality />  </ProtectedRoute>} />
          <Route path='/doctors' element={<ProtectedRoute><Doctor /></ProtectedRoute>} />
          {/* <Route path="/home" element={<ProtectedRoute role='doctor'><Home  /></ProtectedRoute>} /> */}
          <Route path="/appointment/doctor" element={<ProtectedRoute ><Appointment /></ProtectedRoute>} />
          <Route path="/appointment/doctor/:id" element={<ProtectedRoute ><AppointmentDetail /></ProtectedRoute>} /> 
          <Route path="/register/doctor" element={<Register />} />
          <Route path="/schedule"  element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/videocall" element={<VideoCall />} />
          <Route path="/calluser" element={<CallUser />} /> 
          <Route path="*" element={<h1>Not found</h1>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/patientlist" element={<ProtectedRoute><Patientlist /></ProtectedRoute>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>
  )

}

export default App;
