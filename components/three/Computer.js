'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//주석 : ThreeJs 역할 복습

const ThreeScene = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene(); // 화면 씬 생성
        const cameraFOV = window.innerWidth <= 640 ? 80 : 40; // 640px 이하에서는 70, 그 외에는 40
        const camera = new THREE.PerspectiveCamera(cameraFOV, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 생성

        camera.position.set(3, 2, 10); // 카메라 위치
        camera.lookAt(new THREE.Vector3(0, 0.5, 0)); // 카메라가 바라보는 위치

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true }); //
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 7.0); // 조명 색상, 강도 설정
        scene.add(ambientLight); // 화면 씬에 더하다.

        const loader = new GLTFLoader(); //GLTF 파일 모델 load!
        loader.load('/threeModel/scene.gltf', (gltf) => {
            const model = gltf.scene;

            scene.add(model);
        });

        const animate = () => {
            requestAnimationFrame(animate);

            camera.position.x = Math.sin(Date.now() * 0.0005) * 2.5 + 2.5; // 카메라 무빙!
            camera.lookAt(new THREE.Vector3(Math.sin(Date.now() * 0.0003) * 1, 0.5, 0)); // 무빙 중에 지속적으로 바라볼 위치 설정

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            // loader.dispose();
            renderer.dispose();
        };
    }, []);

    return <canvas className=" w-full sm:h-[150px] md:h-[300px] lg:h-[400px]" ref={canvasRef} />;
};

export default ThreeScene;
