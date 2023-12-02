import Image from 'next/image';
import developerImg from '../../public/developerProfile.png';

function Contact() {
    return (
        <>
            <div className="flex grid-cols-2 justify-center item-center">
                <div className="contactImg w-1/2">
                    <h2 className="text-3xl font-bold sm:text-6xl justify-center flex my-9">Contact</h2>
                    <div className="developerImg ">
                        <Image src={developerImg} alt="developer profile" />
                    </div>
                </div>
                <div>22</div>
            </div>
        </>
    );
}

export default Contact;
