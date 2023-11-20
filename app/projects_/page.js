import { TOKEN, DATABASE_ID } from '../../config/index';

export default async function Projects() {
    const data = await getData();

    return <h1>프로젝트</h1>;
}

// NextJs 12 버전까지 지원함 (getStaticProps)

// export async function getStaticProps({ params, preview, previewData }) {
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
            'Notion-Version': '2022-06-28',
            'content-type': 'application/json',
            authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ page_size: 100 }),
    };

    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, options);

    const projects = await res.json();

    const projectsName = projects.results.map((aProject) => {
        return aProject.properties.이름.title[0]?.text.content;
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return projectsName;
}
