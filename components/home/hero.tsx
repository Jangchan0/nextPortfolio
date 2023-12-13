'use client';
import Link from 'next/link';
import TypingAnimation from './TypingAnimation';
import ThreeScene from '../three/Computer';
import { useRef } from 'react';

function Hero() {
    const navHeight = 80;
    const element = useRef<HTMLDivElement>(null);
    const onMoveBox = () => {
        element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const typingText: string = '주니어 프론트엔드 개발자 장찬영입니다.';

    return (
        <>
            <div>
                <section
                    className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font"
                    style={{ marginTop: `-${navHeight}px` }}
                >
                    <div className="container lg:flex items-center justify-between  md:flex-grow-1">
                        <div className="container  justify-start flex flex-col lg:items-start text-left  mb-16 md:mb-0 md:items-center md:justify-center">
                            <div
                                style={{ height: '130px' }}
                                className="flex flex-col items-start justify-start md:w-fit  md:itmes-center md:justify-center"
                            >
                                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900  bg-white dark:bg-slate-800">
                                    안녕하세요!
                                </h1>
                                <div className="flex">
                                    <TypingAnimation toRotate={typingText} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button className="mt-12 btn-project" onClick={onMoveBox}>
                                    Show my project &nbsp; 〉〉
                                </button>
                            </div>
                        </div>
                        <div className=" flex justify-center md:mt-12">
                            <ThreeScene />
                        </div>
                    </div>
                </section>
            </div>
            <div ref={element} />
        </>
    );
}

export default Hero;
