import Hero from '../components/home/hero';
import Projects from './projects_/page';
import Contact from '../components/contact/page';
import WelcomeToast from '../components/welcome/page';

export default function Home() {
    return (
        <div>
            <WelcomeToast />
            <section className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font">
                <div className="container mx-auto  px-5 py-24 md:flex-row  items-center">
                    <Hero />
                    <Projects />
                    <Contact />
                </div>
            </section>
        </div>
    );
}
