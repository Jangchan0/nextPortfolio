'use client';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WelcomeToast = () => {
    useEffect(() => {
        toast.info('안녕하세요! 프론트엔드 장찬영입니다!', {
            icon: '😄',
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
        });
    }, []);

    return <ToastContainer />;
};

export default WelcomeToast;
