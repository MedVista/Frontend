import React, { useState,useEffect } from "react";
import {FetchDoctor,FetchPatient,ApproveDoctor} from "../composables/Fetchdata";
import { set } from "date-fns";

const Admin = () => {
  const api = process.env.REACT_APP_API_URL   
 const [statuslogin, setStatuslogin] = useState(true);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [doctors, setDoctors] = useState([]);
 const [patients, setPatients] = useState([]);
 const [role, setRole] = useState(false);
//  useEffect(() => {
//     localStorage.getItem('statuslogin') == 'true' ? setStatuslogin(true) : setStatuslogin(false);
//  }, []);
    useEffect(() => {
    FetchDoctor().then((data) => {
        setDoctors(data);} );
      FetchPatient().then((data) => {
        setPatients(data);
      });  
    }, []);
 const submit = () => {
   let data = {
     email: email,
     password: password
   }
 }
  const handleApprove = (id,status) => {
    let data ={
      status:status
    }
    ApproveDoctor(id,data).then((data) => {
      console.log(data);
    });
  }
 if(statuslogin == true){
   return (
     <div className="w-screen h-screen flex flex-col  items-center bg-gray-200 text-black">
        <div className="navbar bg-[#465EA6] shadow-sm justify-between w-full">
        <h1 className="text-white">MedVista </h1>
  <div className="flex gap-2">
    {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      {/* <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
        {/* <li>
          <a className="justify-between">
         Profile
            <span className="badge">New</span>
         </a>
        </li> 
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul> */}
    </div>
  </div>
</div>
<div className="overflow-x-auto">
<div className="flex gap-2 mt-5">
    <p>Doctor</p>

<input type="checkbox" value={role} onChange={(e)=> setRole(!role) } className="toggle toggle-primary checked:bg-[#465EA6]" />
 <p>Patient</p>
</div>
  <table className="table border-separate border-2 mt-5  border-black">
    {/* head */}
    <thead className="text-black">
      <tr>
        <th></th>
        <th>Frist Name</th>
        <th>Last Name</th>
        <th>Email</th>
        {role == false ? <><th>License Number</th>
            <th>Certificate</th></> :
             <th>Citizen Number</th>}
        <th></th>
      </tr>
    </thead>
    {
        role == false ?<tbody>
        {doctors.map((doctor) => (
        <tr key={doctor.id}>
          <td>{doctor.id}</td>
          <td>{doctor.first_name}</td>
          <td>{doctor.last_name}</td>
          <td>{doctor.email}</td>
          <td>{doctor.license_number}</td>
          <td><a href={`${api}/${doctor.certificate}`} target="_blank"> Certificate</a></td>
          {/* <td className=" flex gap-2">
          <button className="btn text-white btn-primary" onClick={handleApprove}>Approve</button>
          <button className="btn text-white btn-error" onClick={handleApprove}>Not Approve</button>
            
          </td> */}
          <td><button className="btn text-white btn-error">Delect</button></td>
        </tr>
        ))}
      
      
    </tbody> 
    :
     <tbody>
    {patients.map((patient) => (
    <tr key={patient.id}>
      <td>{patient.id}</td>
      <td>{patient.first_name}</td>
      <td>{patient.last_name}</td>
      <td>{patient.email}</td>
      <td></td>
      <td></td>
      <td className=" flex gap-2">
      <button className="btn text-white btn-primary">Approve</button>
          <button className="btn text-white btn-error">Not Approve</button>
            
            
          </td>
          <td><button className="btn text-white btn-error">Delect</button></td>
    </tr>
    ))}
    </tbody>
    }
  </table>
</div>
       
     </div>
   );
 }else{
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-200 text-black">
          <div className="w-96 p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <form>
              <input
                type="text"
                className="w-full mt-4 p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="w-full mt-4 p-2 border border-gray-300 rounded-lg bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="submit"
                className="w-full mt-4 p-2 bg-blue-500 text-white rounded-lg"
                onClick={() => {
                  submit()
                }}
              >
                Login
              </button>
            </form>
          </div>
  
        </div>
      )
}
}
export default Admin;