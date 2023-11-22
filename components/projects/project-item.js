import Image from 'next/image';

export default function ProjectItem(data) {
    const title = data.data.properties.이름.title[0]?.text.content;
    const progressPeriod = `${data.data.properties[`진행 기간`].date.start} ~ ${
        data.data.properties[`진행 기간`].date.end
    }`;
    const discriptionList = data.data.properties[`한 줄 소개`].rich_text;
    const githubLink = data.data.properties.Github.url;
    const skillList = data.data.properties.Skills.multi_select;
    const imgSrc = data.data.cover.file.url;

    const discription = discriptionList.map((item) => item.plain_text);
    const skill = skillList.map((item) => item.name);

    return (
        <div className="flex flex-col m-3 bg-slate-700 rounded-xl">
            <Image
                className="rounded-t-xl"
                src={imgSrc}
                alt="cover image"
                width={500}
                height={500}
                layout="responsive"
                objectFit="contain"
                quality={100}
            />

            <h1>{title}</h1>
            <p>{skill}</p>
            <h3>{discription}</h3>
            <a href={githubLink}>깃허브 바로가기</a>
        </div>
    );
}
