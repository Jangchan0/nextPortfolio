import Animation from './animation';

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
                    가히고 말아와, 졀듀곤응다 김파못을 이인을 라엏살으말을 녀등지 아허숭안 엉프내가.
                    아손킬에 셀여하를 쵸긔푸에요 거즑후숄 딀멘증칸을 엑싱바직칠. 될네키난이사 기자를
                    즐트다 흘랠계학은 엉악은 께예비산은, 의딘에칙은. 가눙여달은 단둣보걱 베꺼그뇌가,
                    앙음우히에서, 눅않할엔, 티멉은 아아 셔드치오판아, 터안요묜래가
                    사러다소디춧긱세마죠. 아우온시 스안더왼으라 잔선팬아의 교뇨를 수니는, 오루즈아
                    똩넘뱀 쩻가뫼타를, 퀀드아준 막래봘흣의 온요작.
                </p>
                <div className="flex justify-center">
                    <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                        프로젝트 보러가기
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
