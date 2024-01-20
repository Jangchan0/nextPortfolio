import Link from 'next/link';
import DarkModeToggleBtn from '../home/darkModeToggleBtn';

export default function Header() {
    return (
        <header className="text-gray-600 body-font  bg-primary z-20">
            <div className="container mx-auto lg:flex flex-wrap p-5 md:flex md:justify-between md:items-center sm:flex-col sm:items-center sm:justify-center lg:justify-between lg:items-center ">
                <Link
                    href="/"
                    className="flex title-font font-medium items-center justify-center text-gray-900 md:mb-4 lg:mb-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl ">장찬영 포트폴리오</span>
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
