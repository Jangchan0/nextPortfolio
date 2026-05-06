'use client';

import { useEffect, useMemo, useState } from 'react';

interface TypingAnimationProps {
    toRotate: string | string[];
}

const TYPING_PERIOD = 2000;

const TypingAnimation: React.FC<TypingAnimationProps> = ({ toRotate }) => {
    const phrases = useMemo(() => (Array.isArray(toRotate) ? toRotate : [toRotate]), [toRotate]);
    const [text, setText] = useState('');
    const [loopIndex, setLoopIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTypingFin, setIsTypingFin] = useState(false);
    const [tinkleState, setTinkleState] = useState(true);
    const [delta, setDelta] = useState(200 - Math.random() * 100);

    useEffect(() => {
        const ticker = setTimeout(() => {
            const fullText = phrases[loopIndex % phrases.length];
            const updateText = isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1);

            setText(updateText);

            if (updateText.length === fullText.length) {
                setIsTypingFin(true);
            } else {
                setIsTypingFin(false);
            }

            if (isDeleting) {
                setDelta((prevDelta) => prevDelta / 2);
            }
            if (!isDeleting && updateText === fullText) {
                setIsDeleting(true);
                setDelta(TYPING_PERIOD);
            } else if (isDeleting && updateText === '') {
                setIsDeleting(false);
                setLoopIndex((prevIndex) => prevIndex + 1);
                setDelta(200 - Math.random() * 100);
            }
        }, delta);

        return () => {
            clearTimeout(ticker);
        };
    }, [text, delta, isDeleting, loopIndex, phrases]);

    useEffect(() => {
        const cursorTimer = setTimeout(() => {
            setTinkleState((prev) => (isTypingFin ? !prev : true));
        }, 700);

        return () => {
            clearTimeout(cursorTimer);
        };
    }, [isTypingFin, tinkleState]);

    return (
        <>
            <h1 className="title-font mb-3 min-h-[3rem] w-fit rounded-md bg-cyan-100/95 px-3 py-1 text-4xl font-black leading-tight text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.24)] dark:bg-cyan-300/10 dark:text-cyan-100 dark:shadow-[0_0_28px_rgba(34,211,238,0.18)] sm:text-3xl">
                {text}
                {tinkleState && '⎢'}
            </h1>
        </>
    );
};

export default TypingAnimation;
