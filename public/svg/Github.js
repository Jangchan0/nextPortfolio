import Image from 'next/image';
import GithubSVG from './github-mark.svg';

function Github() {
    return (
        <div>
            <Image src={GithubSVG} alt="github" width={50} height={50} />
        </div>
    );
}

export default Github;
