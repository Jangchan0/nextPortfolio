'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeScene = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);

        // camera.position.set(10, 5, -10);
        camera.position.set(3, 4, 10);
        camera.lookAt(new THREE.Vector3(0, 0.5, 0));

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 10.0); // 색상, 강도
        scene.add(ambientLight);

        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load('/threeModel/scene.gltf', (gltf) => {
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map.minFilter = THREE.LinearFilter;
                }
            });

            scene.add(model);
        });

        const animate = () => {
            requestAnimationFrame(animate);

            camera.position.x = Math.sin(Date.now() * 0.001) * 2.5 + 2.5;
            camera.lookAt(new THREE.Vector3(0, 0.5, 0));

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            loader.dispose();
            renderer.dispose();
        };
    }, []);

    return <canvas className="w-[500px] h-[400px]" ref={canvasRef} />;
};

export default ThreeScene;
