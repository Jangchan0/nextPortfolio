import Image from 'next/image';
import photoCard from '../../public/photoCard/장찬영 포토카드.png';

const PhotoCard = () => {
    return (
        <>
            <div className="photoCardContainer ">
                <Image src={photoCard} alt="개발자 소개 카드" width={330} height={400} />
            </div>
        </>
    );
};

export default PhotoCard;
