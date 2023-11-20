export default function ProjectItem(data) {
    return (
        <div className="p-6 bg-slate-400 rounded-md">
            <h1>{data.data.properties.이름.title[0]?.text.content}</h1>
        </div>
    );
}
