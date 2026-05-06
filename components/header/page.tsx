import Link from 'next/link';
import DarkModeToggleBtn from '../home/darkModeToggleBtn';

function PortfolioMark() {
    return (
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/40 bg-slate-950 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.22)]">
            <span className="absolute inset-[3px] rounded-lg border border-indigo-300/25" />
            <svg
                className="relative h-8 w-8"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M24 5.5 39.9 14.7v18.6L24 42.5 8.1 33.3V14.7L24 5.5Z"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                />
                <path d="M15 17.5h18v12H15v-12Z" stroke="#A5B4FC" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M19 34h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M21 30.5v3.5M27 30.5v3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M19.5 22.2 22.4 25l-2.9 2.8" stroke="#67E8F9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25.5 27.8h4.6" stroke="#67E8F9" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M36 13.6l4.2-2.4M8.1 33.1l-4.3 2.5" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </span>
    );
}

export default function Header() {
    return (
        <header className="text-gray-600 body-font  z-20">
            <div className="container mx-auto lg:flex flex-wrap p-5 md:flex md:justify-between md:items-center sm:flex-col sm:items-center sm:justify-center lg:justify-between lg:items-center ">
                <Link
                    href="/"
                    className="flex title-font font-medium items-center justify-center text-gray-900 md:mb-4 lg:mb-0"
                >
                    <PortfolioMark />
                    <span className="ml-3 text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                        장찬영 포트폴리오
                    </span>
                </Link>
                <div className="lg:flex md:flex sm:flex-col items-center">
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <Link href="https://jchy16.tistory.com" className="mr-5 hover:text-gray-900">
                            Blog
                        </Link>
                        <Link href="https://github.com/Jangchan0" className="mr-5 hover:text-gray-900">
                            Github
                        </Link>
                        <Link href="https://open.kakao.com/o/sW0dhISf" className="mr-5 hover:text-gray-900">
                            연락하기
                        </Link>
                    </nav>
                    <div className="flex justify-center">
                        <DarkModeToggleBtn />
                    </div>
                </div>
            </div>
        </header>
    );
}
