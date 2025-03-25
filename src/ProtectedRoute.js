import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { CheckToken, FetchTimeslotsByDoctorId } from './composables/Fetchdata';
import LoadingPage from './components/LoadingPage';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeslotStatus, setTimeslotStatus] = useState(null); // ✅ สร้าง state เก็บค่าจาก API

    // ฟังก์ชันเช็ค Token
    const refreshToken = async () => {
        try {
            const response = await CheckToken();
            return response;
        } catch (error) {
            console.error('Error refreshing token', error);
            return null;
        }
    };

    const fetchTimeslotData = async () => {
        try {
            const response = await FetchTimeslotsByDoctorId(localStorage.getItem("id"));
            if (response.status === 404) {
                setTimeslotStatus(404); // ถ้าไม่มีข้อมูล
            } else {
                setTimeslotStatus(response);
            }
        } catch (error) {
            console.error('Error fetching timeslot data', error);
            setTimeslotStatus(null);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsAuth(false);
                setIsLoading(false);
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    const newToken = await refreshToken();
                    setIsAuth(!!newToken);
                } else {
                    setIsAuth(true);
                }
            } catch (error) {
                setIsAuth(false);
            }

            // เมื่อการตรวจสอบ Token เสร็จเรียบร้อยแล้ว ให้ทำการดึงข้อมูล timeslot
            // fetchTimeslotData();
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading ) {
        return <LoadingPage />;
    }
    if (isAuth) {
        return children;

    } else {
        localStorage.clear();
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
