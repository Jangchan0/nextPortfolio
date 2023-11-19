import { TOKEN, DATABASE_ID } from '../../config/index';

const Projects = () => {
    async function getStaticProps() {
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

        const res = await fetch(
            `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
            options
        );
        const projects = await res.json();

        const projectsName = projects.results.map((aProject) => {
            return aProject.properties.이름.title[0].text.content;
        });

        console.log(`project : ${projectsName}`);

        return {
            props: {},
        };
    }
    getStaticProps();

    return <h1>프로젝트</h1>;
};

export default Projects;
