import Animation from './animation';
import Link from 'next/link';

function Hero() {
    return (
        <>
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                    안녕하세요 장찬영입니다!
                    <br className="hidden lg:inline-block" />
                    프론트엔트 꿈나무
                </h1>
                <p className="mb-8 leading-relaxed">
                    안녕하세요! 저는 주니어 프론트엔드 개발자로, React를 사용하며 웹 애플리케이션을
                    개발하고 있습니다. UI/UX에 대한 강한 관심을 가지고 있으며, 협업과 끊임없는
                    학습을 통해 성장하는 것을 즐깁니다. <br />
                    문제 해결과 효율적인 코드 작성에 주력하여 사용자들에게 뛰어난 웹 경험을
                    제공하고자 노력하고 있습니다. 더 나은 사용자 인터페이스와 새로운 기술에 대한
                    열정으로 프로젝트에 기여하고 싶습니다. 함께 일하고 성장하는 기회를 기다리고
                    있습니다.
                </p>
                <div className="flex justify-center">
                    <button>
                        <Link href="/projects_" className="btn-project">
                            프로젝트 보러가기
                        </Link>
                    </button>
                </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <Animation />
            </div>
        </>
    );
}

export default Hero;
