import { jwtDecode } from "jwt-decode";

// const api = 'http://localhost:8000';
const api = process.env.REACT_APP_API_URL

async function FetchRegister(data, Type) {
    const path = Type === 'doctor' ? 'doctor' : 'patient';
    const formData = new FormData();

    // Add each property to FormData
    for (const key in data) {
        // Only append if the value is not null or undefined
        // if (key === 'profile_picture' && data[key] !== null) {
        //     formData.append(key, data[key]); // Append profile_picture as a file if it's not null
        // } else if (data[key] !== undefined && data[key] !== null) {
        //     formData.append(key, data[key]); // Append other data fields
        // }
        formData.append(key, data[key])
    }
    const typetofetch = {
        method: 'POST',
        body: formData, // Use FormData for both doctor and patient
    };
    try {
        const response = await fetch(`${api}/api/register/${path}`, typetofetch);
        if (response.status === 201) {
            return response.status;
        } else {
            const responseData = await response.json();
            return responseData;
        }
    } catch (error) {
        console.log(error);
    }
}

async function FetchLogin( data) {
     try{
        const response = await fetch(`${api}/api/login `, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if( response.status === 200){
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            const decodedToken = jwtDecode(data.accessToken);
            localStorage.setItem('id', decodedToken.user_id);
            localStorage.setItem('role', decodedToken.role);
            localStorage.setItem('email', data.email);
            localStorage.setItem('firstname', data.firstname);
            localStorage.setItem('fullname', data.fullname);
            localStorage.setItem('profile_picture', data.profile_picture);
            return data;
        }else{
            const data = await response.json();
            return data;
        }
     }catch(error){
            console.log(error);
     }
            
}

async function CheckToken() {
    try{
        const response = await fetch(`${api}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken')

            }),
        });
        if(response.status === 200){
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return true;
        }
        return false;
    }catch(error){

    }
}   
async function FetchDoctor() {
    try {
        const response = await fetch(`${api}/api/doctor`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function FetchDoctorById(id) {
    try {
        const response = await fetch(`${api}/api/doctor/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchTimeslots() {
    try {
        const response = await fetch(`${api}/api/timeslots`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`},
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function CreateAppointment(data) {
    try {
        const response = await fetch(`${api}/api/appointment`, {
            method: 'POST',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function UpdateAppointment(data,id) {
    try {
        const response = await fetch(`${api}/api/appointment/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`},
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchAppointments() {
    const role = localStorage.getItem('role') 
    try {
        const response = await fetch(`${api}/api/appointments/${role}/${localStorage.getItem('id')}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchAppointmentById(id) {
    try {
        const response = await fetch(`${api}/api/appointmentdetail/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchCheckTimeSlotByDoctorId(date,id) {
    try {
        const response = await fetch(`${api}/api/doctor/${id}/timeslots?date=${date}`, {
            method: 'get',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(time),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchGetProfile(id,role) {
    const url = role === 'doctor' ? `doctor/${id}` : `patient/${id}`;
    try{
        const response = await fetch(`${api}/api/${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            // body: JSON.stringify({id: id}),
        });
        if( response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }

}
async function FetchUpdateProfile(id,role,data) {
    const formData = new FormData();

    // Add each property to FormData
    for (const key in data) {
        formData.append(key, data[key])
    }
    const typetofetch = {
        method: 'PATCH',
        headers :{
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData, // Use FormData for both doctor and patient
    };
    const url = role === 'doctor' ? `doctor/${id}` : `patient/${id}`;
    try{
        const response = await fetch(`${api}/api/${url}`,
        //      {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // }
        typetofetch
    );
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
    
}
async function DelectUser(id,role) {
    const url = role === 'doctor' ? `doctor/${id}` : `patient/${id}`;
    try{
        const response = await fetch(`${api}/api/${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            // body: JSON.stringify({id: id}),
        });
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
    
}
async function FetchGetSpeciality() {
    try{
        const response = await fetch(`${api}/api/speciality`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            // body: JSON.stringify({id: id}),
        });
        if( response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
    
}
async function FetchSpecialityDoctorById(id) {
    try {
        const response = await fetch(`${api}/api/doctor/speciality/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function AddReview(data) {
    try {
        const response = await fetch(`${api}/api/review`, {
            method: 'POST',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchReview(id) {
    try {
        const response = await fetch(`${api}/api/doctor/${id}/review`, {
            method: 'GET',
            headers: { 'content-type': 'application/json'
                ,"Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function FetchReviewByAppointmentId(id) {
    try {
        const response = await fetch(`${api}/api/appointment/${id}/review`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            // const data = await response.json();
            // return data;
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function AddPrescription(data) {

    try {
        const response = await fetch(`${api}/api/prescriptions`, {
            method: 'POST',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function AddTimesSlot(data) {
    
    try {
        const response = await fetch(`${api}/api/doctor/timeslot/book`, {
            method: 'POST',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function AddNote(data) {
    try {
        const response = await fetch(`${api}/api/note`, {
            method: 'POST',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function FetchTimeslotsByDoctorId(id) {
    try {
        const response = await fetch(`${api}/api/doctor/timeslots/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);     
    }
}
async function FetchNotesByDoctorId(id) {
    try {
        const response = await fetch(`${api}/api/notes/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function DeleteNote(id) {
    try {
        const response = await fetch(`${api}/api/note/${id}`, {
            method: 'DELETE',
            // ถ้าต้องการ headers หรือ body
            // headers: { 'Content-Type': 'application/json' },
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
            // body: JSON.stringify(data), 
        });

        // ตรวจสอบสถานะ
        if (response.ok) {
            // ถ้าการลบสำเร็จ
            return response.status; // หรือสามารถ return response.json() ถ้ามีข้อมูลตอบกลับ
        } else {
            // ถ้ามีปัญหากับการลบ
            console.log(`Error: ${response.status} ${response.statusText}`);
            return response.status;
        }
    } catch (error) {
        console.log("Delete failed: ", error);
    }
}
async function UpdateNote(data,id) {
    try {
        const response = await fetch(`${api}/api/note/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data),
        });
        if(response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function CheckEmail(data) {
    try{
        const response = await fetch(`${api}/api/check/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function UpdateTimeslot(data,id) {
    try {
        const response = await fetch(`${api}/api/doctor/timeslot/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' ,
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data),
        });
        if(response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
    
}
async function DelectTimeSlot(id) {
    
    try {
        const response = await fetch(`${api}/api/doctor/timeslot/${id}`, {
            method: 'DELETE',
            // ถ้าต้องการ headers หรือ body
            // headers: { 'Content-Type': 'application/json' },
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
            // body: JSON.stringify(data), 
        });
        if(response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function FetchAllDoctor() {
    try {
        const response = await fetch(`${api}/api/doctor`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function FetchOtp(data) {
    try{
        const response = await fetch(`${api}/api/otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data),
        });
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function FetchValidateOtp(data) {
    try{
        const response = await fetch(`${api}/api/otp/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function FetchEmailChangePassword(data) {
    try{
        const response = await fetch(`${api}/api/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function UpdatePassword(data) {
    try{
        const response = await fetch(`${api}/api/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if( response.status === 201){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function FetchPatient() {
    try {
        const response = await fetch(`${api}/api/patient`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
async function ApproveDoctor(id,data) {
    const formData = new FormData();

    // Add each property to FormData
    for (const key in data) {
        formData.append(key, data[key])
    }
    const typetofetch = {
        method: 'PATCH',
        body: formData, // Use FormData for both doctor and patient
    };

    try{
        const response = await fetch(`${api}/api/doctor/${id}`,

        typetofetch
    );
        if( response.status === 200){
            return response.status;
        }else{
            return response.status;
        }
    }catch(error){
        console.log(error);
    }
}
async function FetchPatientByDoctorID(id) {
    try {
        const response = await fetch(`${api}/api/patient/doctor/${id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
             },
            // body: JSON.stringify(data),
        });
        if(response.status === 200){
            const data = await response.json();
            return data;
        }else{
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}
export { FetchRegister, FetchLogin, CheckToken, FetchDoctor,FetchDoctorById ,FetchTimeslots
    ,CreateAppointment,UpdateAppointment,FetchAppointments,FetchAppointmentById,FetchCheckTimeSlotByDoctorId
    ,FetchGetProfile,FetchUpdateProfile,DelectUser,FetchGetSpeciality,FetchSpecialityDoctorById,AddReview,
    FetchReview,FetchReviewByAppointmentId,AddPrescription,AddTimesSlot,AddNote,FetchTimeslotsByDoctorId,
    FetchNotesByDoctorId,DeleteNote,UpdateNote,CheckEmail,UpdateTimeslot,DelectTimeSlot,FetchAllDoctor,FetchOtp,
    FetchValidateOtp,FetchEmailChangePassword,UpdatePassword,FetchPatient,ApproveDoctor,FetchPatientByDoctorID};