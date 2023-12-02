import Image from 'next/legacy/image';
import Link from 'next/link';

export default function ProjectItem(data) {
    const title = data.data.properties.이름.title[0]?.text.content;
    const progressPeriod = `${data.data.properties[`진행 기간`].date.start} ~ ${
        data.data.properties[`진행 기간`].date.end
    }`;
    const discriptionList = data.data.properties[`한 줄 소개`].rich_text;
    const githubLink = data.data.properties.Github.url;
    const skillList = data.data.properties.Skills.multi_select;
    const imgSrc = data.data.cover.file.url;
    const notionDetail = data.data.public_url;

    const discription = discriptionList.map((item) => item.plain_text);

    return (
        <div className="project-card  w-[35vw] min-w-[340px]  ">
            <Link href={notionDetail}>
                <Image
                    className="rounded-t-xl "
                    src={imgSrc}
                    alt="cover image"
                    width={500}
                    height={300}
                    layout="responsive"
                    objectFit="cover"
                    quality={100}
                />
            </Link>
            <div className="p-4 flex flex-col">
                <Link href={notionDetail}>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <h3 className=" mt-4 text-lg">{discription}</h3>{' '}
                </Link>
                <a className="mt-2" href={githubLink}>
                    깃허브 바로가기
                </a>
                <p className="my-1 cursor-default"> 작업기간: {progressPeriod}</p>
                <div className="flex items-start mt-2 overflow-wrap-break-word cursor-default">
                    {skillList.map((skill, i) => {
                        return (
                            <h1
                                key={i}
                                className="
                                flex
                                items-start
                                mt-2
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
        </div>
    );
}
