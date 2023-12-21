'use client';
import TypingAnimation from './TypingAnimation';
import { useRef } from 'react';
import PhotoCard from '../photoCard/page';
import Computer from '../three/Computer';

function Hero() {
    const navHeight = 90;
    const element = useRef<HTMLDivElement>(null);
    const onMoveBox = () => {
        element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    let typingText = '주니어 프론트엔드 개발자 장찬영입니다.';

    return (
        <>
            <div>
                <section
                    className="flex min-h-screen  flex-col items-center justify-center text-gray-600 body-font"
                    style={{ marginTop: `-${navHeight}px` }}
                >
                    <div className="container lg:flex items-center justify-between  md:flex-grow-1 sm:flex-grow-1">
                        <div className="container lg:w-1/2 lg:justify-start flex flex-col lg:items-start text-left mb-16 md:mb-0 md:items-center md:justify-center sm:items-center sm:justify-center">
                            <div className="flex flex-col h-[130px] lg:items-start lg:justify-start md:w-fit sm:w-fit sm:items-center sm:justify-center md:itmes-center md:justify-center">
                                <h1 className="title-font w-fit sm:text-3xl  text-4xl mb-4 font-medium text-gray-900  bg-white dark:bg-slate-800">
                                    안녕하세요!
                                </h1>
                                <div className="flex ">
                                    <TypingAnimation toRotate={typingText} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button className="mt-12 btn-project" onClick={onMoveBox}>
                                    Show my project &nbsp; 〉〉
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full flex lg:justify-end lg:mr-12 md:mr-0 md:justify-center sm:justify-center lg:mt-0 md:mt-12">
                            <PhotoCard />
                        </div>
                    </div>
                </section>
            </div>
            <div ref={element} />
        </>
    );
}

export default Hero;
