import { NOTION_TOKEN, NOTION_DATABASE_ID } from '../../config/index';
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

    const imgThumbnail = [
        { id: 1, img: '/thumbnail/nextPortFolio.png' },
        { id: 2, img: '/thumbnail/oms.png' },
        { id: 3, img: '/thumbnail/csm17.png' },
        { id: 4, img: '/thumbnail/shallWe.png' },
        { id: 5, img: '/thumbnail/SIMPLE.png' },
    ];

    return (
        <>
            <h1 className="text-4xl font-bold sm:text-6xl justify-center flex my-9">
                My projects <span className="pl-4 text-blue-500">{data.results.length}</span>
            </h1>

            <div
                className="grid grid-cols-1 md:grid-cols-1 md:gap-1 gap-x-3 gap-y-25 m-6 py-10 "
                style={{ justifyItems: 'center', alignItems: 'center' }}
            >
                {projectSortByDate.map((aProject, index) => {
                    return <ProjectItem key={aProject.id} data={aProject} img={imgThumbnail[index].img} />;
                })}
            </div>
        </>
    );
}

async function getData() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Notion-Version': '2022-02-22',
            'content-type': 'application/json',
            authorization: `Bearer ${NOTION_TOKEN}`,
        },
        body: JSON.stringify({
            page_size: 100,
        }),
    };

    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, options);

    const projects = await res.json();

    const projectsName = projects.results.map((aProject) => {
        return aProject.properties.이름.title[0]?.text.content;
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return projects;
}
