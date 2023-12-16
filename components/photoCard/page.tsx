import { Component } from 'react';
import Image from 'next/image';
import photoCard from '../../public/photoCard/장찬영 포토카드.png';
import './photoCard.css';

class PhotoCard extends Component {
    state = {
        perspectiveSize: 0,
        rotateAngleY: 0,
        rotateAngleX: 0,
        overlayStyle: {},
        isMouseOver: false,
        isClientSide: false,
    };

    handleMouseMove = (e: { nativeEvent: { offsetX: any; offsetY: any } }) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const perspectiveSize = window.innerWidth >= 1240 ? '600px' : '750px';

        // 새로운 각도 계산
        const newRotateAngleY = Math.min(Math.max((-1 / 2.5) * offsetX + 50, -50), 50);

        const newRotateAngleX = Math.min(Math.max((-1 / 8) * offsetY + 30, -30), 30);

        // 현재 각도와 새로운 각도 사이의 차이보완
        const easeFactor = 0.1;
        const interpolatedRotateAngleY =
            this.state.rotateAngleY + easeFactor * (newRotateAngleY - this.state.rotateAngleY);
        const interpolatedRotateAngleX =
            this.state.rotateAngleX + easeFactor * (newRotateAngleX - this.state.rotateAngleX);

        const backgroundPosition =
            window.innerWidth >= 1240 ? `${offsetX / 2 + offsetY / 2}px` : `${offsetX + offsetY}px`;
        const opacity = offsetX / 200;
        const brightness = 1.2;

        const overlayStyle = { backgroundPosition, filter: `opacity(${opacity}) brightness(${brightness})` };

        this.setState({
            perspectiveSize,
            rotateAngleY: interpolatedRotateAngleY,
            rotateAngleX: interpolatedRotateAngleX,
            overlayStyle,
        });
    };

    handleMouseEnter = () => {
        this.setState({
            isMouseOver: true,
        });
    };

    handleMouseLeave = () => {
        this.setState({
            rotateAngleY: 0,
            rotateAngleX: 0,
            overlayStyle: {},
            isMouseOver: false,
        });
    };
    componentDidMount() {
        // Check if the component is mounted on the client side
        this.setState({ isClientSide: true });
    }

    render() {
        const { rotateAngleY, rotateAngleX, overlayStyle, perspectiveSize, isMouseOver, isClientSide } = this.state;

        return (
            <>
                <div
                    className=" cardContainer lg:w-[330px] lg:h-[464px] md:w-[35vw] md:h-[60vh] md:mt-0 sm:w-[40vw] sm:h-[35vh] sm:mt-12 relative "
                    onMouseMove={this.handleMouseMove}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    style={{
                        animation: isClientSide && window.innerWidth <= 800 ? 'rotateAnimation 8s infinite' : 'none',
                    }}
                >
                    <div
                        className={`overlay  absolute w-full h-full bg-gradient-custom bg-cover bg-center filter brightness-110 opacity-80 mix-blend-color-dodge rounded-2xl  ${
                            isMouseOver ? '' : 'transition-all'
                        }`}
                        style={{
                            ...overlayStyle,
                            transform: `perspective(${perspectiveSize}) rotateY(${rotateAngleY}deg) rotateX(${rotateAngleX}deg)`,
                        }}
                    ></div>
                    <Image
                        className={`bg-cover w-full h-full shadow-xl ${isMouseOver ? '' : 'transition-all'}`}
                        src={photoCard}
                        alt="장찬영 소개 카드"
                        style={{
                            transform: `perspective(${perspectiveSize}) rotateY(${rotateAngleY}deg) rotateX(${rotateAngleX}deg)`,
                        }}
                    />
                </div>
            </>
        );
    }
}

export default PhotoCard;
