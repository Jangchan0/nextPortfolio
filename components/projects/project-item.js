import Image from 'next/legacy/image';
import Link from 'next/link';

export default function ProjectItem({ data, img }) {
    const title = data.properties.이름.title[0]?.text.content;
    const progressPeriod = `${data.properties[`진행 기간`].date.start} ~ ${data.properties[`진행 기간`].date.end}`;
    const discriptionList = data.properties[`한 줄 소개`].rich_text;
    const githubLink = data.properties.Github.url;
    const skillList = data.properties.Skills.multi_select;
    const imgSrc = data.cover.file.url;
    const notionDetail = data.public_url;

    const discription = discriptionList.map((item) => item.plain_text);

    return (
        <div className="project-card w-[45vw] min-w-[340px] p-3 ">
            <Image
                className="rounded-xl "
                src={img}
                alt="cover image"
                width={500}
                height={300}
                layout="responsive"
                objectFit="cover"
                quality={100}
            />

            <div className="flex justify-between">
                <div className="p-4 flex flex-col ">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <h3 className=" mt-4 text-lg">{discription}</h3>
                    <p className="my-2 cursor-default"> 작업기간: {progressPeriod}</p>
                </div>
                <div className="flex flex-col gap-4 p-4 text-center items-left">
                    <Link href={githubLink} passHref>
                        <button className="btn-project  ">Github</button>
                    </Link>
                    <Link href={notionDetail} passHref>
                        <button className="btn-project">Notion</button>
                    </Link>
                </div>
            </div>
            <div className="flex items-start p-4 mt-2 border-t  border-gray-300 dark:border-gray-200/50 overflow-wrap-break-word cursor-default">
                {skillList.map((skill, i) => {
                    return (
                        <h1
                            key={i}
                            className="
                                flex
                                items-start
                                
                                px-2
                                py-1
                                mr-2
                                rounded-md
                                bg-sky-200
                                dark:bg-sky-700
                                w-30
                                "
                        >
                            {skill.name}
                        </h1>
                    );
                })}
            </div>
        </div>
    );
}
