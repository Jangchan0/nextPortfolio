import Animation from './animation';
import Link from 'next/link';
import TypingAnimation from './TypingAnimation';

function Hero() {
    const navHeight = 80;

    const typingText = '주니어 프론트엔드 개발자 장찬영입니다.';

    return (
        <>
            <div>
                <section
                    className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font"
                    style={{ marginTop: `-${navHeight}px` }}
                >
                    <div className={`container flex items-center justify-center`}>
                        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                            <div style={{ height: '130px' }} className="flex flex-col">
                                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 ">
                                    안녕하세요!
                                </h1>
                                <div className="flex">
                                    <TypingAnimation toRotate={typingText} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button className="mt-12">
                                    <Link href="/projects_" className="btn-project">
                                        Show my project &nbsp; 〉〉
                                    </Link>
                                </button>
                            </div>
                        </div>
                        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                            <Animation />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Hero;
