import React from 'react';

const Projects = () => {
    return <h1>프로젝트</h1>;
};

export default Projects;

export async function getStaticProps() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Notion-Version': '2022-06-28',
            'content-type': 'application/json',
        },
        body: JSON.stringify({ filter: 'string', start_cursor: 'string', page_size: 100 }),
    };

    fetch('https://api.notion.com/v1/databases/database_id/query', options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));

    return {
        props: {},
    };
}
