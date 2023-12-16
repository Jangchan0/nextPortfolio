'use client';

import { useState, useEffect } from 'react';

interface TypingAnimationProps {
    toRotate: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ toRotate }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTypingFin, setIsTypingFin] = useState(false);
    const [tinkleState, setTinkleState] = useState(true);
    const [delta, setDelta] = useState(200 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => {
            clearInterval(ticker);
        };
    }, [text]);

    const tinkle = () => {
        isTypingFin ? setTinkleState(!tinkleState) : setTinkleState(true);
    };
    setTimeout(tinkle, 700, tinkleState);

    const tick = () => {
        let fullText = toRotate;
        let updateText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updateText);

        if (updateText.length === toRotate.length) {
            setIsTypingFin(true);
            tinkle();
        } else {
            setIsTypingFin(false);
        }

        if (isDeleting) {
            setDelta((prevDelta) => prevDelta / 2);
        }
        if (!isDeleting && updateText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updateText === '') {
            setIsDeleting(false);
            setDelta(200 - Math.random() * 100);
        }
    };

    return (
        <>
            <h1 className=" title-font sm:text-4xl text-3xl mb-4 font-medium w-fit text-gray-900 dark:text-white bg-white dark:bg-slate-800">
                {text}
                {tinkleState && '⎢'}
            </h1>
        </>
    );
};

export default TypingAnimation;
