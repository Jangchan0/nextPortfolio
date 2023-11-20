export default function ProjectItem(data) {
    console.log(data);

    const title = data.data.properties.이름.title[0]?.text.content;
    const progressPeriod = data.data.properties[`진행 기간`].date;
    const githubLink = data.data.properties;

    return (
        <div className="p-6 bg-slate-400 rounded-md">
            <h1>{title}</h1>
        </div>
    );
}
