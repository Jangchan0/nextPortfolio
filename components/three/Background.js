'use client';
import { useTheme } from 'next-themes';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//주석 : ThreeJs 역할 복습

const BackgroundThree = () => {
    const { theme } = useTheme();

    const canvasRef = useRef();
    const scrollRef = useRef(0);

    useEffect(() => {
        const scene = new THREE.Scene(); // 화면 씬 생성
        const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 생성

        camera.position.set(0, 3.8, 10); // 카메라 위치
        // camera.lookAt(new THREE.Vector3(0, 0, 0)); // 카메라가 바라보는 위치

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true }); //
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight); // 초기 크기 설정

        let lightMode = theme === 'dark' ? 1.0 : 5.0;
        const ambientLight = new THREE.AmbientLight(0xfff5e1, lightMode); // 전체 방향 조명 색상, 강도 설정
        scene.add(ambientLight); // 화면 씬에 더하다.

        // const directionalLight = new THREE.DirectionalLight(0xfff5e1, lightMode);
        // directionalLight.position.set(5, 5, 0); // 조명의 위치 설정 (특정 조명 방향 설정)
        // scene.add(directionalLight);

        const loader = new GLTFLoader(); //GLTF 파일 모델 load!
        loader.load('/backgroundThree/scene.gltf', (gltf) => {
            const model = gltf.scene;

            scene.add(model);
        });

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(newWidth, newHeight);
        };

        const handleScroll = () => {
            camera.position.y = 3.8 - scrollRef.current / 2500; //스크롤 이벤트 적용 [초기 위치값 => 이벤트 발현 이동 속도]
            // camera.lookAt(new THREE.Vector3(0, 5 - scrollRef.current / 100, 0));
        };

        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', handleResize);

        window.addEventListener('scroll', () => {
            scrollRef.current = window.scrollY;
            handleScroll();
        });

        return () => {
            renderer.dispose();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [theme]);

    return <canvas className="fixed top-0 -z-0" ref={canvasRef} />;
};

export default BackgroundThree;
