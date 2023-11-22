import { TOKEN, DATABASE_ID } from '../../config/index';
import ProjectItem from '../../components/projects/project-item';

export default async function Projects() {
    const data = await getData();

    const projectSortByDate = data.results.sort((a, b) => {
        const fast = new Date(a.properties[`진행 기간`].date.start);
        const late = new Date(b.properties[`진행 기간`].date.start);

        if (fast < late) {
            return 1;
        }
        if (fast > late) {
            return -1;
        }
        return 0;
    });

    return (
        <>
            <h1 className="text-4xl font-bold sm:text-6xl">총 프로젝트 : {data.results.length}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-6 py-10 sm:w-full">
                {projectSortByDate.map((aProject) => {
                    return <ProjectItem key={aProject.id} data={aProject} />;
                })}
            </div>
        </>
    );
}

// NextJs 12 버전까지 지원함 (getStaticProps)

// export async function getServerSideProps({ params, preview, previewData }) {
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'Notion-Version': '2022-06-28',
//             'content-type': 'application/json',
//             authorization: `Bearer ${TOKEN}`,
//         },
//         body: JSON.stringify({ page_size: 100 }),
//     };

//     const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, options);
//     const projects = await res.json();

//     const projectsName = projects.results.map((aProject) => {
//         return aProject.properties.이름.title[0]?.text.content;
//     });

//     // console.log(`project : ${projectsName}`);

//     return {
//         props: { projectsName },
//         revalidate: 1, // 데이터 변경이 있으면 갱신 1초 마다 - 갱신 주기 설정 가능
//     };
// }

async function getData() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Notion-Version': '2022-02-22',
            'content-type': 'application/json',
            authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
            page_size: 100,
        }),
    };

    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, options);

    const projects = await res.json();

    const projectsName = projects.results.map((aProject) => {
        return aProject.properties.이름.title[0]?.text.content;
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return projects;
}
