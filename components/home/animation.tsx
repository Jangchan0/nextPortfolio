'use client';
import Lottie from 'lottie-react';
import lottieDeveloper from '../../public/lottieDeveloper2.json';

export default function Animation() {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <Lottie animationData={lottieDeveloper} className="flex justify-center items-center" loop={true} />
        </div>
    );
}
