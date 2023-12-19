import React from 'react';
import Link from 'next/link';
import Github from '../../public/svg/Github';
import Instagram from '../../public/svg/Instagram';

export default function Footer() {
    return (
        <>
            <footer className="body-font bg-primary ">
                <div className="container flex item-center justify-between mx-auto">
                    <div className=" px-4 py-6  flex items-center sm:flex-row flex-col">
                        <Link
                            href="/"
                            className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
                        >
                            <span className="ml-3 lg:text-xl md:text-lg sm:text-xs">장찬영 포트폴리오</span>
                        </Link>
                        <p className="lg:text-sm md:text-sm sm:text-xs text-gray-500 sm:ml-6 sm:mt-0 mt-4">
                            © 2024 Frontend —
                            <a
                                href="https://github.com/Jangchan0"
                                rel="noopener noreferrer"
                                className="text-gray-600 ml-1"
                                target="_blank"
                            >
                                @JangChanYoung
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mr-2">
                        <div
                            className="inline-flex transition duration-300 transform  hover:scale-110
                             hover:shadow-sm sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start"
                        >
                            <a className="text-gray-500 " href="https://github.com/Jangchan0 ">
                                <Github />
                            </a>
                        </div>
                        <div
                            className="inline-flex transition duration-300 transform  hover:scale-110
                              hover:shadow-sm  sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start "
                        >
                            <a
                                className="text-gray-500"
                                href="https://www.instagram.com/chan_0_jang/?igshid=YzAwZjE1ZTI0Zg%3D%3D&utm_source=qr"
                            >
                                <Instagram />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
