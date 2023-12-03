import Image from 'next/image';
import InstagramSVG from './instagram.svg';

function Instagram() {
    return (
        <div>
            <Image src={InstagramSVG} alt="instagram" />
        </div>
    );
}

export default Instagram;
