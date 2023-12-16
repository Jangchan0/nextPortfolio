import Image from 'next/image';
import GithubSVG from './github-mark.svg';

function Github() {
    return (
        <div>
            <Image width={30} height={30} src={GithubSVG} alt="github" />
        </div>
    );
}

export default Github;
