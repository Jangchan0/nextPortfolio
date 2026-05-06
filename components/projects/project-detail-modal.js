'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const PhoneScreenshotFrame = ({ image, title }) => {
    if (!image?.src) {
        return null;
    }

    return (
        <div className="holo-phone-frame mx-auto">
            <div className="holo-phone-speaker" />
            <div className="holo-phone-screen">
                <Image
                    src={image.src}
                    alt={image.alt ?? `${title} 화면 이미지`}
                    fill
                    sizes="(max-width: 768px) 56vw, 220px"
                    className="object-contain"
                    priority={false}
                />
            </div>
        </div>
    );
};

const DetailSection = ({ title, children }) => (
    <section className="hologram-detail-section">
        <h4 className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{title}</h4>
        <div className="mt-3 break-keep text-sm leading-7 text-slate-200 sm:text-base">{children}</div>
    </section>
);

const renderMetricValue = (value) =>
    value.split(/(\d+(?:\.\d+)?%대?)/g).map((token, index) => {
        if (!token) {
            return null;
        }

        if (/%/.test(token)) {
            return (
                <span key={`${token}-${index}`} className="hologram-percent-glitch" data-metric-value={token}>
                    {token}
                </span>
            );
        }

        return <span key={`${token}-${index}`}>{token}</span>;
    });

export default function ProjectDetailModal({ isOpen, project, onClose }) {
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const handlePointerDown = (event) => {
            const closeRect = closeButtonRef.current?.getBoundingClientRect();
            const panelRect = panelRef.current?.getBoundingClientRect();
            const isInsideCloseButton =
                closeRect &&
                event.clientX >= closeRect.left - 8 &&
                event.clientX <= closeRect.right + 8 &&
                event.clientY >= closeRect.top - 8 &&
                event.clientY <= closeRect.bottom + 8;
            const isOutsidePanel =
                panelRect &&
                (event.clientX < panelRect.left ||
                    event.clientX > panelRect.right ||
                    event.clientY < panelRect.top ||
                    event.clientY > panelRect.bottom);

            if (isInsideCloseButton || isOutsidePanel) {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        };
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handlePointerDown, true);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('pointerdown', handlePointerDown, true);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) {
        return null;
    }

    const hasImage = Boolean(project.image?.src);

    return createPortal(
        <div className="hologram-backdrop" onMouseDown={onClose}>
            <div
                ref={panelRef}
                className="hologram-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-detail-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="hologram-scanline" />
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="hologram-close"
                    aria-label="프로젝트 상세 닫기"
                    onPointerDown={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    onMouseDown={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                >
                    CLOSE
                </button>

                <div className="hologram-panel-scroll">
                    <div className="hologram-panel-content">
                        <div className={`grid gap-8 lg:items-start ${hasImage ? 'lg:grid-cols-[240px_minmax(0,1fr)]' : ''}`}>
                            {hasImage && <PhoneScreenshotFrame image={project.image} title={project.title} />}

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 pr-20">
                                    <span className="rounded-full border border-cyan-300/50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                                        {project.service}
                                    </span>
                                    <span className="rounded-full border border-indigo-300/40 px-3 py-1 text-xs font-bold text-indigo-100">
                                        {project.role}
                                    </span>
                                </div>

                                <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                                    Project Archive
                                </p>
                                <h3 id="project-detail-title" className="hologram-title mt-3 break-keep text-3xl font-black">
                                    {project.title}
                                </h3>
                                <p className="mt-3 text-sm font-bold text-slate-300">작업기간: {project.period}</p>
                                <p className="mt-5 break-keep text-base leading-8 text-slate-100 sm:text-lg">
                                    {project.summary}
                                </p>

                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    {project.metrics.map((metric) => (
                                        <div key={`${project.slug}-${metric.label}`} className="hologram-metric">
                                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-300">
                                                {metric.label}
                                            </p>
                                            <p className="hologram-metric-value">{renderMetricValue(metric.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                            <DetailSection title="문제 정의">
                                <p>{project.problem}</p>
                            </DetailSection>
                            <DetailSection title="해결 전략">
                                <p>{project.strategy}</p>
                            </DetailSection>
                            <DetailSection title="주요 결과">
                                <p>{project.result[0]}</p>
                            </DetailSection>
                        </div>

                        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            <DetailSection title="어떻게 개선했는가">
                                <ul className="space-y-2">
                                    {project.implementation.map((item) => (
                                        <li key={item} className="pl-4">
                                            <span className="-ml-4 mr-2 text-cyan-300">-</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </DetailSection>

                            <div className="space-y-7">
                                <DetailSection title="결과">
                                    <ul className="space-y-2">
                                        {project.result.map((item) => (
                                            <li key={item} className="pl-4">
                                                <span className="-ml-4 mr-2 text-cyan-300">-</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </DetailSection>

                                <DetailSection title="사용 기술">
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map((skill) => (
                                            <span key={`${project.slug}-${skill}`} className="hologram-skill">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </DetailSection>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
