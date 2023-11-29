'use client';
import { useState, useEffect } from 'react';

import Animation from './animation';
import Link from 'next/link';

function Hero() {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const bar = '⎢';
    const toRotate = '주니어 프론트엔드 개발자 장찬영입니다';
    const [tinkleState, setTinkleState] = useState(true);

    const tinkle = () => {
        isDeleting ? setTinkleState(!tinkleState) : setTinkleState(true);
    };
    setTimeout(tinkle, 600, tinkleState);

    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => {
            clearInterval(ticker);
        };
    }, [text]);

    const tick = () => {
        let fullText = toRotate;
        let updateText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updateText);

        if (isDeleting) {
            setDelta((prevDelta) => prevDelta / 2);
        }
        if (!isDeleting && updateText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updateText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(300 - Math.random() * 100);
        }
    };

    return (
        <>
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <div style={{ height: '130px' }}>
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 ">안녕하세요 !</h1>
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 flex">
                        {text}
                        <h1 style={tinkleState ? { display: '' } : { display: 'none' }}>{bar}</h1>
                        {/* <br className="hidden lg:inline-block" /> */}
                    </h1>
                </div>

                {/* <p className="mb-8 leading-relaxed">
                    안녕하세요! 저는 주니어 프론트엔드 개발자로, React를 사용하며 웹 애플리케이션을 개발하고 있습니다.
                    끈끈한 협업과 도전적인 학습을 통해 성장하는 것을 즐깁니다. <br />
                    문제 해결과 효율적인 코드 작성에 주력하여 사용자들에게 뛰어난 웹 경험을 제공하고자 노력하고
                    있습니다. 더 나은 사용자 인터페이스와 새로운 기술에 대한 열정으로 프로젝트에 기여하고 싶습니다.{' '}
                    <br />
                    함께 일하고 성장하는 기회를 기다리고 있습니다.
                </p> */}
                <div className="flex justify-center">
                    <button>
                        <Link href="/projects_" className="btn-project">
                            Show my project &nbsp; 〉〉
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

// import { TOKEN, DATABASE_ID } from '../../config/index';
// import ProjectItem from '../../components/projects/project-item';
// import { Z_FULL_FLUSH } from 'zlib';

// export default async function Projects() {
//     const data = await getData();

//     const projectSortByDate = data.results.sort((a, b) => {
//         const fast = new Date(a.properties[`진행 기간`].date.start);
//         const late = new Date(b.properties[`진행 기간`].date.start);

//         if (fast < late) {
//             return 1;
//         }
//         if (fast > late) {
//             return -1;
//         }
//         return 0;
//     });

//     return (
//         <>
//             <h1 className="text-4xl font-bold sm:text-6xl justify-center flex my-9">
//                 총 프로젝트 <span className="pl-4 text-blue-500">{data.results.length} 가지</span>
//             </h1>

//             <div
//                 className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-20 m-6  py-10 "
//                 style={{ justifyItems: 'center', alignItems: 'center' }}
//             >
//                 {projectSortByDate.map((aProject) => {
//                     return <ProjectItem key={aProject.id} data={aProject} />;
//                 })}
//             </div>
//         </>
//     );
// }

// async function getData() {
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'Notion-Version': '2022-02-22',
//             'content-type': 'application/json',
//             authorization: `Bearer ${TOKEN}`,
//         },
//         body: JSON.stringify({
//             page_size: 100,
//         }),
//     };

//     const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, options);

//     const projects = await res.json();

//     const projectsName = projects.results.map((aProject) => {
//         return aProject.properties.이름.title[0]?.text.content;
//     });

//     if (!res.ok) {
//         throw new Error('Failed to fetch data');
//     }

//     return projects;
// }
