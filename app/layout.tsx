import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/header/page';
import Footer from '../components/footer/page';
import TopBtn from '@/components/topBtn/page';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '프론트엔드 장찬영 포트폴리오',
    description: '프론트엔드 장찬영 포트폴리오입니다',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta name="google-site-verification" content="ZMF0vs0F6dFUUAi0nRdsgvFhJvPF-ZW_HZxQToZmLhE" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body>
                <Providers>
                    <div className="bg-primary flex flex-col item-center justify-center">
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </Providers>
                <TopBtn />
            </body>
        </html>
    );
}
