import Image from 'next/legacy/image';
import Link from 'next/link';

export default function ProjectItem({ data, img }) {
    const title = data.properties.이름.title[0]?.text.content;
    const progressPeriod = `${data.properties[`진행 기간`].date.start} ~ ${data.properties[`진행 기간`].date.end}`;
    const discriptionList = data.properties[`한 줄 소개`].rich_text;
    const githubLink = data.properties.Github.url;
    const skillList = data.properties.Skills.multi_select;
    const notionDetail = data.public_url;

    const discription = discriptionList.map((item) => item.plain_text);

    return (
        <div className="project-card lg:w-[45vw] lg:min-w-[370px] md:w-[45vw] sm:w-[90vw] sm:min-w-[90vw] p-3 ">
            <div className="cursor-pointer">
                <Link href={notionDetail} passHref>
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
                </Link>
            </div>

            <div className="flex justify-between ">
                <div className="p-4 flex flex-col ">
                    <h1 className="lg:text-2xl md:text-xl sm:text-lg font-bold">{title}</h1>
                    <h3 className=" mt-4 lg:text-lg md:text-lg sm:text-sm ">{discription}</h3>
                </div>
                <div className="flex flex-col gap-4 py-4  items-left sm:w-[30%]">
                    <Link href={githubLink} passHref>
                        <button className="btn-project justify-center">Github</button>
                    </Link>
                    <Link href={notionDetail} passHref>
                        <button className="btn-project justify-center">Info</button>
                    </Link>
                </div>
            </div>
            <p className=" p-4 my-2 lg:text-lg md:text-lg sm:text-sm cursor-default"> 작업기간: {progressPeriod}</p>
            <div className="flex items-start p-4 mt-2 border-t overflow-x-scroll border-gray-300 dark:border-gray-200/50 overflow-hidden cursor-default">
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
