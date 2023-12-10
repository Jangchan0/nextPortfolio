import Hero from '../components/home/hero';
import Projects from './projects_/page';
import Contact from '../components/contact/page';
import WelcomeToast from '../components/welcome/page';
import Background from '../components/three/Background';

export default function Home() {
    return (
        <div>
            <WelcomeToast />

            <section className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font">
                <Background />
                <div className="container mx-auto  px-5 py-24 md:flex-row  items-center z-1 relative">
                    <Hero />
                    <Projects />
                    <Contact />
                </div>
            </section>
        </div>
    );
}
