'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeScene = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load('/models/scene.gltf', (gltf) => {
            const model = gltf.scene;

            scene.add(model);
        });

        const animate = () => {
            requestAnimationFrame(animate);

            camera.position.x = Math.sin(Date.now() * 0.001) * 5;

            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            loader.dispose(); // Dispose loader resources
            renderer.dispose();
        };
    }, []);

    return (
        <div className="w-1/2 flex">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeScene;
