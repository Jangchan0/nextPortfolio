import Hero from '../components/home/hero';
import Projects from './projects_/page';

export default function Home() {
    return (
        <div>
            <section className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font">
                <div className=" container mx-auto  px-5 py-24 md:flex-row  items-center">
                    <Hero />
                    <Projects />
                </div>
            </section>
        </div>
    );
}
