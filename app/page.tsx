import Hero from '../components/home/hero';
import Contact from '../components/contact/page';
import WelcomeToast from '../components/welcome/page';
import Background from '../components/three/Background';

export default function Home() {
    return (
        <div>
            <WelcomeToast />
            <section className="pointer-events-none min-h-[610vh] text-gray-600 body-font">
                <Background />
                <div className="relative z-[2] pointer-events-none">
                    <Hero />
                    <div className="h-[315vh] sm:h-[335vh] lg:h-[385vh]" aria-hidden="true" />
                    <div className="container mx-auto px-5 pb-24 pointer-events-auto">
                        <Contact />
                    </div>
                </div>
            </section>
        </div>
    );
}
