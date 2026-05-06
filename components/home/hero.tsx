'use client';
import TypingAnimation from './TypingAnimation';
import { useEffect, useRef, useState } from 'react';
import PhotoCard from '../photoCard/page';

const TYPING_TEXTS = ['문제를 정의하고 개선하는', '사용자 경험을 수치로 증명하는', '운영 안정성을 끝까지 추적하는'];
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function Hero() {
    const navHeight = 90;
    const element = useRef<HTMLDivElement>(null);
    const [hintOpacity, setHintOpacity] = useState(1);
    const onMoveBox = () => {
        element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        let frameId: number | null = null;

        const updateHintOpacity = () => {
            const introScrollDistance = window.innerWidth < 768 ? 760 : 1180;
            const progress = clamp(window.scrollY / introScrollDistance, 0, 1);
            const fadeProgress = clamp((progress - 0.88) / 0.1, 0, 1);

            setHintOpacity(1 - fadeProgress);
            frameId = null;
        };

        const requestUpdate = () => {
            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(updateHintOpacity);
        };

        updateHintOpacity();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    return (
        <>
            <div>
                <section
                    className="flex min-h-[135vh] flex-col items-center justify-start pt-32 text-gray-600 body-font lg:min-h-[145vh] lg:pt-36"
                    style={{ marginTop: `-${navHeight}px` }}
                >
                    <div className="container mx-auto px-5 lg:flex items-center justify-between  md:flex-grow-1 sm:flex-grow-1">
                        <div className="container lg:w-1/2 lg:justify-start flex flex-col lg:items-start text-left mb-16 md:mb-0 md:items-center md:justify-center sm:items-center sm:justify-center">
                            <div className="flex h-[168px] flex-col lg:items-start lg:justify-start md:w-fit sm:w-fit sm:items-center sm:justify-center md:itmes-center md:justify-center">
                                <h1 className="title-font mb-3 w-fit rounded-full bg-white/90 px-4 py-1 text-lg font-bold tracking-wide text-indigo-600 shadow-sm dark:bg-slate-900/80 dark:text-cyan-200 sm:text-base">
                                    안녕하세요!
                                </h1>
                                <div className="flex ">
                                    <TypingAnimation toRotate={TYPING_TEXTS} />
                                </div>
                                <h1 className="title-font mb-4 w-fit bg-white/85 px-1 text-2xl font-semibold text-slate-800 dark:bg-slate-800/80 dark:text-white sm:text-xl">
                                    프론트엔드 개발자 장찬영입니다.
                                </h1>
                            </div>

                            {/* <div className="flex justify-center pointer-events-auto">
                                <button className="mt-12 btn-project" onClick={onMoveBox}>
                                    Show my project &nbsp; 〉〉
                                </button>
                            </div> */}
                        </div>
                        <div className="pointer-events-auto lg:w-1/2 w-full flex lg:justify-end lg:mr-12 md:mr-0 md:justify-center sm:justify-center lg:mt-0 md:mt-12">
                            <PhotoCard />
                        </div>
                    </div>
                    <div
                        className="hero-monitor-hint pointer-events-none mt-auto mb-12"
                        style={{ opacity: hintOpacity }}
                        aria-hidden={hintOpacity === 0}
                    >
                        <span className="hero-monitor-hint__signal" aria-hidden="true" />
                        <div>
                            <p className="hero-monitor-hint__eyebrow">PROJECT TERMINAL</p>
                            <p className="hero-monitor-hint__text">스크롤 후 모니터를 클릭해 프로젝트 상세를 확인하세요</p>
                        </div>
                        <span className="hero-monitor-hint__chevron" aria-hidden="true">
                            ↓
                        </span>
                    </div>
                </section>
            </div>
            <div ref={element} />
        </>
    );
}

export default Hero;
