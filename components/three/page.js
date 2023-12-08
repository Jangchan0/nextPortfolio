'use client';
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

const ThreeScene = () => {
    const gltfRef = useRef();

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load('/three/scene.gltf', (gltf) => {
            console.log(gltf);
            gltfRef.current = gltf;
            const clonedScene = gltf.scene.clone();
            gltfRef.current.scene.add(clonedScene);
        });
    }, []);

    return (
        <Canvas style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <group ref={gltfRef} />
        </Canvas>
    );
};

export default ThreeScene;
