import Image from 'next/image';
import InstagramSVG from './instagram.svg';

function Instagram() {
    return (
        <div>
            <Image width={30} height={30} src={InstagramSVG} alt="instagram" />
        </div>
    );
}

export default Instagram;
