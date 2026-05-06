import Image from 'next/image';
import Link from 'next/link';

const Section = ({ title, children }) => (
    <section className="border-t border-slate-200 pt-5 dark:border-slate-700">
        <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{title}</h4>
        <div className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
);

export default function ProjectItem({ data, service }) {
    const hasGithub = Boolean(data.githubUrl);
    const image = data.image ?? {
        src: '/thumbnail/nextPortFolio.png',
        alt: `${data.title} 임시 이미지`,
    };

    return (
        <article
            id={data.slug}
            className="project-card w-full max-w-5xl p-6 text-slate-700 hover:scale-100 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300 sm:p-8"
        >
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                            {service}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            {data.role}
                        </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">{data.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        작업기간: {data.period}
                    </p>
                    <p className="mt-5 break-keep text-lg leading-8 text-slate-700 dark:text-slate-200">
                        {data.summary}
                    </p>

                    {hasGithub && (
                        <div className="mt-6 w-full sm:w-fit">
                            <Link href={data.githubUrl} rel="noopener noreferrer" target="_blank">
                                <button className="btn-project justify-center">Github</button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={720}
                        height={520}
                        className="h-48 w-full object-cover sm:h-56 lg:h-64"
                        priority={false}
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-5 border-y border-slate-200 py-6 dark:border-slate-700 lg:grid-cols-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
                        Problem
                    </p>
                    <p className="mt-3 break-keep text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {data.problem}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
                        Approach
                    </p>
                    <p className="mt-3 break-keep text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {data.strategy}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
                        Outcome
                    </p>
                    <p className="mt-3 break-keep text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {data.result[0]}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {data.metrics.map((metric) => (
                    <div
                        key={`${data.slug}-${metric.label}`}
                        className="rounded-md border border-indigo-200 px-3 py-2 dark:border-indigo-400/40"
                    >
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{metric.label}</p>
                        <p className="mt-1 text-base font-bold text-indigo-600 dark:text-indigo-200">{metric.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-7">
                <Section title="어떻게 개선했는가">
                    <ul className="space-y-2">
                        {data.implementation.map((item) => (
                            <li key={item} className="pl-4">
                                <span className="-ml-4 mr-2 text-indigo-500">-</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="결과">
                    <ul className="space-y-2">
                        {data.result.map((item) => (
                            <li key={item} className="pl-4">
                                <span className="-ml-4 mr-2 text-indigo-500">-</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="사용 기술">
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span
                                key={`${data.slug}-${skill}`}
                                className="rounded-md bg-sky-100 px-2 py-1 text-sm font-semibold text-sky-800 dark:bg-sky-700 dark:text-white"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Section>
            </div>
        </article>
    );
}
