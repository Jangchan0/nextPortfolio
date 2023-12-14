import React, { Component } from 'react';
import Image from 'next/image';
import photoCard from '../../public/photoCard/장찬영 포토카드.png';

class PhotoCard extends Component {
    handleMouseMove = (e) => {
        // console.log('마우스 이동 중', e.clientX, e.clientY);

        const cardContainer: HTMLElement | null = document.querySelector('.photoCardContainer');

        if (!cardContainer) {
            return;
        }
        const rotateAngle = (e.clientX / window.innerWidth) * 360;

        const transfromStyle = `rotateY(${rotateAngle}deg)`;

        cardContainer.style.transform = transfromStyle;
    };
    originalAngle = (e) => {
        const cardContainer: HTMLElement | null = document.querySelector('.photoCardContainer');

        if (!cardContainer) {
            return;
        }
        cardContainer.style.transform = 'rotateY(0deg)';
    };

    render() {
        return (
            <>
                <div
                    className="w-[330px] h-[400px]"
                    // className="photoCardContainer"
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.originalAngle}
                >
                    <Image
                        className="photoCardContainer"
                        src={photoCard}
                        alt="개발자 소개 카드"
                        width={330}
                        height={400}
                        // onMouseMove={this.handleMouseMove}
                        // onMouseLeave={this.originalAngle}
                    />
                </div>
            </>
        );
    }
}

export default PhotoCard;
