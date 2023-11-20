export default function ProjectItem(data) {
    const projectTitle = data.data.properties.이름.title[0]?.text.content;

    return (
        <div className="p-6 bg-slate-400 rounded-md">
            <h1>{projectTitle}</h1>
        </div>
    );
}
