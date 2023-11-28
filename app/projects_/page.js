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
            <h1 className="text-4xl font-bold sm:text-6xl justify-center flex my-9">
                총 프로젝트 <span className="pl-4 text-blue-500">{data.results.length} 가지</span>
            </h1>

            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-20 m-6  py-10 "
                style={{ justifyItems: 'center', alignItems: 'center' }}
            >
                {projectSortByDate.map((aProject) => {
                    return <ProjectItem key={aProject.id} data={aProject} />;
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
