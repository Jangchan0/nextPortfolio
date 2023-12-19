'use client';

const TopBtn = () => {
    const moveToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <button
                className="opacity-75 lg:w-[45px] lg:h-[45px] md:w-[42px] md:h-[42px] sm:w-[32px] sm:h-[32px] rounded-3xl bg-slate-200  fixed lg:right-[50px] lg:bottom-5 md:right-4 md:bottom-4 sm:right-2 sm:bottom-2 lg:text-2xl md:text-2xl sm:text-md hover:scale-[1.1] transition-all "
                onClick={moveToTop}
            >
                🔝
            </button>
        </>
    );
};

export default TopBtn;
