'use client';

import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { projectGroups } from '../../app/projects_/projects-data';
import ProjectDetailModal from '../projects/project-detail-modal';

const SCREEN_TARGETS = [
    'Screen D.004_110',
    'Screen D.003_109',
    'Screen B.001_103',
    'Screen C.001_102',
    'Screen D.002_108',
    'Screen B.002_107',
    'Screen C.002_106',
    'Screen D.001_105',
];

const SCREEN_PROJECT_SLUGS = [
    'roubit-attendance-performance',
    'roubit-android-anr',
    'roubit-graphql-migration',
    'loody-asset-sync',
    'loody-realtime-chat-voice',
    'roubit-fastlane-release',
    'loody-hardware-otp-sse',
    'loody-zero-to-one',
];

const SCREEN_OVERLAY_CONFIG = {
    'Screen D.003_109': {
        useScreenMaterial: true,
        remapUv: true,
        flipX: true,
        flipY: true,
    },
};

const INITIAL_CAMERA_POSITION = new THREE.Vector3(1.35, 5.35, 12.4);
const SCREEN_CENTER_FALLBACK = new THREE.Vector3(0, 0.62, 0.18);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const easeInOutSine = (value) => -(Math.cos(Math.PI * value) - 1) / 2;
const smootherStep = (value) => value * value * value * (value * (value * 6 - 15) + 10);
const lerp = (from, to, progress) => from + (to - from) * progress;

const createProjects = () =>
    projectGroups.flatMap((group) =>
        group.projects.map((project) => ({
            ...project,
            service: group.service,
        })),
    );

const createScreenProjects = () => {
    const projects = createProjects();
    const projectMap = new Map(projects.map((project) => [project.slug, project]));

    return SCREEN_PROJECT_SLUGS.map((slug) => projectMap.get(slug));
};

const getPointerPosition = (event, element) => {
    const rect = element.getBoundingClientRect();

    return {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
};

const normalizeObjectName = (name) => name.replace(/[^a-z0-9]/gi, '').toLowerCase();

const getObjectByLooseName = (model, objectName) => {
    const exactMatch = model.getObjectByName(objectName);

    if (exactMatch) {
        return exactMatch;
    }

    const targetName = normalizeObjectName(objectName);
    let match = null;

    model.traverse((object) => {
        if (!match && normalizeObjectName(object.name) === targetName) {
            match = object;
        }
    });

    return match;
};

const isInteractiveDomTarget = (target) =>
    target?.closest?.('a, button, input, textarea, select, label, [role="dialog"], .hologram-backdrop, .hologram-panel');

const drawText = (context, text, x, y, maxWidth, lineHeight) => {
    const tokens = text.split(' ');
    let line = '';
    let currentY = y;

    tokens.forEach((token, index) => {
        const testLine = line ? `${line} ${token}` : token;
        const isLast = index === tokens.length - 1;

        if (context.measureText(testLine).width > maxWidth && line) {
            context.fillText(line, x, currentY);
            line = token;
            currentY += lineHeight;
        } else {
            line = testLine;
        }

        if (isLast) {
            context.fillText(line, x, currentY);
        }
    });
};

const createMonitorTexture = (project) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;

    const context = canvas.getContext('2d');
    const isRoubit = project.service === 'Roubit';
    const accent = isRoubit ? '#67e8f9' : '#c4b5fd';
    const deepAccent = isRoubit ? '#0e7490' : '#6d28d9';

    const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, '#020617');
    background.addColorStop(0.52, '#0f172a');
    background.addColorStop(1, '#111827');
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.2;
    context.strokeStyle = accent;
    context.lineWidth = 3;
    for (let y = 42; y < canvas.height; y += 34) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
    context.globalAlpha = 1;

    context.strokeStyle = accent;
    context.lineWidth = 18;
    context.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    context.strokeStyle = deepAccent;
    context.lineWidth = 5;
    context.strokeRect(72, 72, canvas.width - 144, canvas.height - 144);

    context.fillStyle = accent;
    context.font = '900 72px Apple SD Gothic Neo, Pretendard, sans-serif';
    context.fillText(project.service.toUpperCase(), 96, 158);

    context.fillStyle = '#f8fafc';
    context.shadowColor = accent;
    context.shadowBlur = 18;
    context.font = '900 116px Apple SD Gothic Neo, Pretendard, sans-serif';
    drawText(context, project.screenLabel ?? project.title, 96, 356, canvas.width - 192, 118);

    context.shadowBlur = 0;
    context.fillStyle = accent;
    context.font = '900 64px Apple SD Gothic Neo, Pretendard, sans-serif';
    drawText(context, project.screenMetric ?? project.metrics?.[0]?.value ?? '', 96, 586, canvas.width - 192, 72);

    context.fillStyle = 'rgba(226, 232, 240, 0.78)';
    context.font = '800 34px Apple SD Gothic Neo, Pretendard, sans-serif';
    context.fillText('CLICK SCREEN', 96, 690);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.needsUpdate = true;

    return texture;
};

const getScreenMesh = (screenNode) => {
    const meshes = [];
    screenNode.traverse((child) => {
        if (child.isMesh) {
            meshes.push(child);
        }
    });

    const materialNamedScreen = meshes.find((child) => {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        return materials.some((material) => material?.name?.toLowerCase().includes('screen'));
    });

    if (materialNamedScreen) {
        return materialNamedScreen;
    }

    return (
        meshes
            .map((mesh) => {
                if (!mesh.geometry.boundingBox) {
                    mesh.geometry.computeBoundingBox();
                }

                const size = new THREE.Vector3();
                mesh.geometry.boundingBox?.getSize(size);

                return {
                    mesh,
                    depth: Math.min(size.x, size.y, size.z),
                    area: size.x * size.y,
                };
            })
            .filter(({ depth }) => depth < 0.04)
            .sort((a, b) => b.area - a.area)[0]?.mesh ?? meshes[0]
    );
};

const rotateScreenNodeToward = (screenNode, targetPosition, yawOffset = 0) => {
    const screenPosition = screenNode.getWorldPosition(new THREE.Vector3());
    const direction = targetPosition.clone().sub(screenPosition);
    direction.y = 0;

    if (direction.lengthSq() === 0) {
        return;
    }

    direction.normalize();
    screenNode.rotation.y = Math.atan2(direction.x, direction.z) + yawOffset;
    screenNode.updateMatrixWorld(true);
};

const rotateScreenNodePartiallyToward = (screenNode, targetPosition, amount = 0.25, yawOffset = 0) => {
    const screenPosition = screenNode.getWorldPosition(new THREE.Vector3());
    const direction = targetPosition.clone().sub(screenPosition);
    direction.y = 0;

    if (direction.lengthSq() === 0) {
        return;
    }

    direction.normalize();
    const targetYaw = Math.atan2(direction.x, direction.z) + yawOffset;
    const currentYaw = screenNode.rotation.y;
    const shortestDelta = Math.atan2(Math.sin(targetYaw - currentYaw), Math.cos(targetYaw - currentYaw));

    screenNode.rotation.y = currentYaw + shortestDelta * amount;
    screenNode.updateMatrixWorld(true);
};

const fitTextureToGeometryUv = (texture, geometry, options = {}) => {
    const uvAttribute = geometry.attributes.uv;

    if (!uvAttribute) {
        return;
    }

    let minU = Infinity;
    let maxU = -Infinity;
    let minV = Infinity;
    let maxV = -Infinity;

    for (let index = 0; index < uvAttribute.count; index += 1) {
        const u = uvAttribute.getX(index);
        const v = uvAttribute.getY(index);
        minU = Math.min(minU, u);
        maxU = Math.max(maxU, u);
        minV = Math.min(minV, v);
        maxV = Math.max(maxV, v);
    }

    const uRange = maxU - minU;
    const vRange = maxV - minV;

    if (uRange <= 0 || vRange <= 0) {
        return;
    }

    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.x = (options.flipX ? -1 : 1) / uRange;
    texture.repeat.y = (options.flipY ? -1 : 1) / vRange;
    texture.offset.x = options.flipX ? maxU / uRange : -minU / uRange;
    texture.offset.y = options.flipY ? maxV / vRange : -minV / vRange;
    texture.needsUpdate = true;
};

const createScreenBaseMaterial = () =>
    new THREE.MeshBasicMaterial({
        color: 0x020617,
        side: THREE.DoubleSide,
        toneMapped: false,
    });

const createRadialShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(256, 256, 12, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.52)');
    gradient.addColorStop(0.44, 'rgba(0, 0, 0, 0.24)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
};

const createCyberGroundTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;

    const context = canvas.getContext('2d');
    const baseGradient = context.createLinearGradient(0, 0, 0, canvas.height);
    baseGradient.addColorStop(0, '#101827');
    baseGradient.addColorStop(0.48, '#071422');
    baseGradient.addColorStop(1, '#020617');
    context.fillStyle = baseGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const cyanGlow = context.createRadialGradient(280, 470, 20, 280, 470, 620);
    cyanGlow.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
    cyanGlow.addColorStop(0.42, 'rgba(14, 116, 144, 0.12)');
    cyanGlow.addColorStop(1, 'rgba(14, 116, 144, 0)');
    context.fillStyle = cyanGlow;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const violetGlow = context.createRadialGradient(820, 360, 20, 820, 360, 560);
    violetGlow.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
    violetGlow.addColorStop(0.5, 'rgba(79, 70, 229, 0.1)');
    violetGlow.addColorStop(1, 'rgba(79, 70, 229, 0)');
    context.fillStyle = violetGlow;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.28;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(103, 232, 249, 0.7)';
    for (let x = -canvas.width; x <= canvas.width * 2; x += 96) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 420, canvas.height);
        context.stroke();
    }

    context.strokeStyle = 'rgba(167, 139, 250, 0.5)';
    for (let x = -canvas.width; x <= canvas.width * 2; x += 128) {
        context.beginPath();
        context.moveTo(x + 360, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    context.strokeStyle = 'rgba(34, 211, 238, 0.42)';
    for (let y = 0; y <= canvas.height; y += 86) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    context.globalAlpha = 1;
    const horizon = context.createLinearGradient(0, 0, canvas.width, 0);
    horizon.addColorStop(0, 'rgba(34, 211, 238, 0)');
    horizon.addColorStop(0.5, 'rgba(34, 211, 238, 0.55)');
    horizon.addColorStop(1, 'rgba(168, 85, 247, 0)');
    context.fillStyle = horizon;
    context.fillRect(0, 504, canvas.width, 4);

    const vignette = context.createRadialGradient(512, 512, 180, 512, 512, 720);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.42)');
    context.fillStyle = vignette;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.2, 1.4);
    texture.needsUpdate = true;

    return texture;
};

const createCyberGroundMaterial = (opacity = 0.88) =>
    new THREE.MeshBasicMaterial({
        map: createCyberGroundTexture(),
        color: 0xffffff,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
    });

const setLineOpacity = (material, opacity) => {
    const materials = Array.isArray(material) ? material : [material];

    materials.forEach((item) => {
        item.transparent = true;
        item.opacity = opacity;
        item.depthWrite = false;
        item.blending = THREE.AdditiveBlending;
    });
};

const createNeonFloor = () => {
    const group = new THREE.Group();
    group.name = 'CyberpunkNeonFloor';

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(34, 20),
        createCyberGroundMaterial(0.72),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.42, -0.7);
    floor.renderOrder = -4;
    group.add(floor);

    const grid = new THREE.GridHelper(34, 58, 0x67e8f9, 0x4f46e5);
    grid.position.set(0, -1.36, -0.7);
    grid.renderOrder = -3;
    setLineOpacity(grid.material, 0.26);
    group.add(grid);

    const horizonGrid = new THREE.GridHelper(18, 18, 0xa78bfa, 0x22d3ee);
    horizonGrid.position.set(0, -1.34, -7.1);
    horizonGrid.scale.set(1.2, 1, 0.42);
    horizonGrid.renderOrder = -2;
    setLineOpacity(horizonGrid.material, 0.16);
    group.add(horizonGrid);

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(13.5, 5.8),
        new THREE.MeshBasicMaterial({
            map: createRadialShadowTexture(),
            transparent: true,
            opacity: 0.84,
            side: THREE.DoubleSide,
            depthWrite: false,
        }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0.25, -1.31, 0.15);
    shadow.renderOrder = -1;
    group.add(shadow);

    const cyanRailGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-12, -1.27, -8.5),
        new THREE.Vector3(-4.8, -1.27, 4.8),
        new THREE.Vector3(2.6, -1.27, 8.4),
    ]);
    const cyanRail = new THREE.Line(
        cyanRailGeometry,
        new THREE.LineBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.46,
            depthWrite: false,
        }),
    );
    cyanRail.renderOrder = 1;
    group.add(cyanRail);

    const violetRailGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(12, -1.26, -8.8),
        new THREE.Vector3(5.2, -1.26, 4.2),
        new THREE.Vector3(-1.6, -1.26, 8.2),
    ]);
    const violetRail = new THREE.Line(
        violetRailGeometry,
        new THREE.LineBasicMaterial({
            color: 0xa78bfa,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
        }),
    );
    violetRail.renderOrder = 1;
    group.add(violetRail);

    return group;
};

const styleImportedGroundPlane = (model) => {
    const groundNode = getObjectByLooseName(model, 'Plane_5');

    if (!groundNode) {
        return;
    }

    groundNode.traverse((child) => {
        if (!child.isMesh) {
            return;
        }

        if (Array.isArray(child.material)) {
            child.material.forEach(disposeMaterial);
        } else if (child.material) {
            disposeMaterial(child.material);
        }

        child.material = createCyberGroundMaterial(0.82);
        child.renderOrder = -6;
        child.receiveShadow = false;
    });
};

const createScreenOverlay = (screenMesh, project, options = {}) => {
    if (!screenMesh.geometry.boundingBox) {
        screenMesh.geometry.computeBoundingBox();
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    screenMesh.geometry.boundingBox?.getSize(size);
    screenMesh.geometry.boundingBox?.getCenter(center);
    screenMesh.material = createScreenBaseMaterial();

    const geometry = new THREE.PlaneGeometry(size.x, size.y);
    const material = new THREE.MeshBasicMaterial({
        map: createMonitorTexture(project),
        side: THREE.DoubleSide,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
    });
    const overlay = new THREE.Mesh(geometry, material);

    overlay.name = `${screenMesh.name || 'Screen'}_ProjectOverlay`;
    overlay.position.set(center.x, center.y, center.z + 0.026);
    overlay.rotation.z = Math.PI;
    overlay.scale.set((options.scaleX ?? -1) * 1.012, 1.012, 1);
    overlay.renderOrder = 20;
    overlay.userData.project = project;
    overlay.userData.localCenter = new THREE.Vector3(0, 0, 0);
    screenMesh.add(overlay);

    return overlay;
};

const applyProjectScreenMaterial = (screenMesh, project, options = {}) => {
    if (!screenMesh.geometry.boundingBox) {
        screenMesh.geometry.computeBoundingBox();
    }

    const center = new THREE.Vector3();
    screenMesh.geometry.boundingBox?.getCenter(center);
    const texture = createMonitorTexture(project);

    if (options.remapUv) {
        fitTextureToGeometryUv(texture, screenMesh.geometry, options);
    }

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false,
    });

    screenMesh.material = material;
    screenMesh.renderOrder = 20;
    screenMesh.userData.project = project;
    screenMesh.userData.localCenter = center;

    return screenMesh;
};

const disposeMaterial = (material) => {
    Object.values(material).forEach((value) => {
        if (value && typeof value.dispose === 'function') {
            value.dispose();
        }
    });
    material.dispose();
};

const BackgroundThree = () => {
    const { theme } = useTheme();
    const projects = useMemo(createScreenProjects, []);
    const canvasRef = useRef(null);
    const scrollRef = useRef(0);
    const resetCameraRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }

        let frameId = null;
        let cameraTween = null;
        let isCameraMoving = false;
        let isFocused = false;
        let isDisposed = false;
        const screenMeshes = [];
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.fog = new THREE.FogExp2(0x101827, theme === 'dark' ? 0.026 : 0.018);

        camera.position.copy(INITIAL_CAMERA_POSITION);
        const idleQuaternion = camera.quaternion.clone();
        const lookAtCamera = camera.clone();
        const scrollFocusSubjects = {
            deployAutomation: {
                target: new THREE.Vector3(4.68, 4.29, -1.56),
                frontDirection: new THREE.Vector3(-0.87, 0, 0.5).normalize(),
            },
            realtime: {
                target: new THREE.Vector3(0.99, 4.29, -4.21),
                frontDirection: new THREE.Vector3(0.42, 0, 0.91).normalize(),
            },
            assetSync: {
                target: new THREE.Vector3(-3.42, 3.06, 1.3),
                frontDirection: new THREE.Vector3(0.85, 0, 0.31).normalize(),
            },
            otpSse: {
                target: new THREE.Vector3(3.11, 2.15, -0.18),
                frontDirection: new THREE.Vector3(-0.58, 0, 0.57).normalize(),
            },
        };

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const lightMode = theme === 'dark' ? 1.0 : 5.0;
        const ambientLight = new THREE.AmbientLight(0xfff5e1, lightMode);
        scene.add(ambientLight);

        const cyanLight = new THREE.PointLight(0x22d3ee, theme === 'dark' ? 1.35 : 1.05, 16);
        cyanLight.position.set(-5.6, 3.6, 3.4);
        scene.add(cyanLight);

        const violetLight = new THREE.PointLight(0xa78bfa, theme === 'dark' ? 1.05 : 0.82, 18);
        violetLight.position.set(5.8, 4.4, -2.6);
        scene.add(violetLight);

        const floorGlow = new THREE.PointLight(0x06b6d4, theme === 'dark' ? 0.72 : 0.5, 10);
        floorGlow.position.set(0, -0.72, 1.6);
        scene.add(floorGlow);

        const neonFloor = createNeonFloor();
        scene.add(neonFloor);

        const getLookAtQuaternion = (position, target, yawOffset = 0) => {
            const nextTarget = target.clone();

            if (yawOffset !== 0) {
                const direction = target.clone().sub(position).applyAxisAngle(new THREE.Vector3(0, 1, 0), yawOffset);
                nextTarget.copy(position).add(direction);
            }

            lookAtCamera.position.copy(position);
            lookAtCamera.quaternion.copy(idleQuaternion);
            lookAtCamera.lookAt(nextTarget);

            return lookAtCamera.quaternion.clone();
        };

        const mixQuaternion = (from, to, progress) => from.clone().slerp(to, progress);

        const getScreenTargetPoint = (screenObject) => {
            screenObject.updateWorldMatrix(true, false);

            if (screenObject.userData.localCenter) {
                return screenObject.userData.localCenter.clone().applyMatrix4(screenObject.matrixWorld);
            }

            return screenObject.getWorldPosition(new THREE.Vector3());
        };

        const getScreenFocusSubject = (screenObject) => {
            const target = getScreenTargetPoint(screenObject);
            const frontDirection = new THREE.Vector3(0, 0, 1).transformDirection(screenObject.matrixWorld).normalize();

            if (frontDirection.dot(INITIAL_CAMERA_POSITION.clone().sub(target)) < 0) {
                frontDirection.multiplyScalar(-1);
            }

            return {
                target,
                frontDirection,
            };
        };

        const getFacingPosition = (subject, distance, yOffset) =>
            subject.target.clone().add(subject.frontDirection.clone().multiplyScalar(distance)).add(new THREE.Vector3(0, yOffset, 0));

        const getBlendedFacingFrame = (leftSubject, rightSubject, distance, yOffset, options = {}) => {
            const target = leftSubject.target
                .clone()
                .lerp(rightSubject.target, 0.5)
                .add(new THREE.Vector3(0, yOffset, 0));
            const frontDirection = options.frontDirection
                ? options.frontDirection.clone()
                : leftSubject.frontDirection.clone().add(rightSubject.frontDirection);

            if (frontDirection.lengthSq() < 0.001) {
                frontDirection.set(0, 0, 1);
            }

            frontDirection.normalize();

            return {
                target,
                position: target
                    .clone()
                    .add(frontDirection.multiplyScalar(distance))
                    .add(new THREE.Vector3(options.xOffset ?? 0, yOffset * 0.6, 0)),
            };
        };

        const getIdleFrame = () => {
            const isMobile = window.innerWidth < 768;
            const introScrollDistance = isMobile ? 760 : 1180;
            const introProgress = clamp(scrollRef.current / introScrollDistance, 0, 1);
            const pathProgress = clamp((scrollRef.current - introScrollDistance) / (window.innerHeight * 3.6), 0, 1);
            const upperRight = new THREE.Vector3(isMobile ? 0.48 : 1.35, isMobile ? 4.7 : 5.35, isMobile ? 12.45 : 12.4);
            const introFrame = getBlendedFacingFrame(
                scrollFocusSubjects.realtime,
                scrollFocusSubjects.deployAutomation,
                isMobile ? 9.0 : 11.4,
                isMobile ? 0.1 : 0.14,
                {
                    frontDirection: new THREE.Vector3(1, 0, 1),
                    xOffset: isMobile ? -0.75 : -12.2,
                },
            );
            const upperRightZoom = introFrame.position;
            const middleLeft = getFacingPosition(scrollFocusSubjects.assetSync, isMobile ? 6.55 : 8.25, isMobile ? 0.14 : 0.08);
            const middleRight = getFacingPosition(scrollFocusSubjects.otpSse, isMobile ? 7.15 : 9.15, isMobile ? 0.14 : 0.08);
            const lowerDrift = new THREE.Vector3(isMobile ? -0.24 : -0.58, isMobile ? 2.05 : 2.18, isMobile ? 10.65 : 10.18);
            const deepBottom = new THREE.Vector3(lowerDrift.x, isMobile ? 0.9 : 0.72, lowerDrift.z);
            const introFrameTarget = introFrame.target;
            const assetSyncFrameTarget = scrollFocusSubjects.assetSync.target
                .clone()
                .add(new THREE.Vector3(isMobile ? 0.72 : 1.65, 0, 0));
            const otpSseFrameTarget = scrollFocusSubjects.otpSse.target
                .clone()
                .add(new THREE.Vector3(isMobile ? -0.38 : -0.82, 0, 0));
            const introQuaternion = getLookAtQuaternion(upperRightZoom, introFrameTarget, THREE.MathUtils.degToRad(-2));
            const assetSyncQuaternion = getLookAtQuaternion(middleLeft, assetSyncFrameTarget);
            const otpSseQuaternion = getLookAtQuaternion(middleRight, otpSseFrameTarget);

            const moveBetween = (from, to, progress) =>
                new THREE.Vector3(
                    lerp(from.x, to.x, progress),
                    lerp(from.y, to.y, progress),
                    lerp(from.z, to.z, progress),
                );
            const moveLensCurve = (from, to, progress) => {
                const eased = easeInOutSine(progress);
                const lensCurve = Math.sin(Math.PI * progress);

                return new THREE.Vector3(
                    lerp(from.x, to.x, eased),
                    lerp(from.y, to.y, eased) + lensCurve * (isMobile ? 0.03 : 0.06),
                    lerp(from.z, to.z, eased) - lensCurve * (isMobile ? 0.18 : 0.38),
                );
            };

            if (scrollRef.current < introScrollDistance) {
                const progress = smootherStep(introProgress);

                return {
                    position: moveBetween(upperRight, upperRightZoom, progress),
                    quaternion: mixQuaternion(idleQuaternion, introQuaternion, progress),
                };
            }

            if (pathProgress < 0.28) {
                const progress = smootherStep(pathProgress / 0.28);
                const position = moveBetween(upperRightZoom, middleLeft, progress);

                return {
                    position,
                    quaternion: mixQuaternion(introQuaternion, assetSyncQuaternion, progress),
                };
            }

            if (pathProgress < 0.54) {
                const progress = (pathProgress - 0.28) / 0.26;
                const eased = smootherStep(progress);
                const position = moveLensCurve(middleLeft, middleRight, progress);

                return {
                    position,
                    quaternion: mixQuaternion(assetSyncQuaternion, otpSseQuaternion, eased),
                };
            }

            if (pathProgress < 0.8) {
                const progress = smootherStep((pathProgress - 0.54) / 0.26);
                const position = moveBetween(middleRight, lowerDrift, progress);

                return {
                    position,
                    quaternion: mixQuaternion(otpSseQuaternion, idleQuaternion, progress),
                };
            }

            const position = moveBetween(lowerDrift, deepBottom, easeInOutSine((pathProgress - 0.8) / 0.2));

            return {
                position,
                quaternion: idleQuaternion,
            };
        };

        scrollRef.current = window.scrollY;
        const initialFrame = getIdleFrame();
        camera.position.copy(initialFrame.position);
        camera.quaternion.copy(initialFrame.quaternion);

        const renderScene = () => {
            renderer.render(scene, camera);
        };

        const updateCameraTween = () => {
            if (!cameraTween) {
                return;
            }

            const elapsed = performance.now() - cameraTween.startedAt;
            const progress = Math.min(elapsed / cameraTween.duration, 1);
            const eased = easeOutCubic(progress);

            camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
            camera.quaternion.slerpQuaternions(cameraTween.fromQuaternion, cameraTween.toQuaternion, eased);

            if (progress >= 1) {
                const onComplete = cameraTween.onComplete;
                cameraTween = null;
                isCameraMoving = false;

                if (onComplete) {
                    onComplete();
                }
            }
        };

        const stopRenderLoop = () => {
            if (frameId) {
                window.clearInterval(frameId);
                frameId = null;
            }
        };

        const startRenderLoop = () => {
            if (frameId) {
                return;
            }

            frameId = window.setInterval(() => {
                updateCameraTween();
                renderScene();

                if (!cameraTween) {
                    stopRenderLoop();
                }
            }, 1000 / 60);
        };

        const animateCameraTo = ({ position, quaternion, duration = 850, onComplete }) => {
            cameraTween = {
                fromPosition: camera.position.clone(),
                fromQuaternion: camera.quaternion.clone(),
                toPosition: position.clone(),
                toQuaternion: quaternion.clone(),
                duration,
                startedAt: performance.now(),
                onComplete,
            };
            isCameraMoving = true;
            startRenderLoop();
        };

        const resetCamera = () => {
            const frame = getIdleFrame();

            isFocused = false;
            animateCameraTo({
                position: frame.position,
                quaternion: frame.quaternion,
                duration: 700,
            });
        };

        resetCameraRef.current = resetCamera;

        const focusProject = (screenMesh) => {
            if (isCameraMoving || isFocused || !screenMesh.userData.project) {
                return;
            }

            const project = screenMesh.userData.project;
            const localCenter = screenMesh.userData.localCenter ?? SCREEN_CENTER_FALLBACK;
            screenMesh.updateWorldMatrix(true, false);

            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'default';
            }

            const target = localCenter.clone().applyMatrix4(screenMesh.matrixWorld);
            let frontDirection = new THREE.Vector3(0, 0, 1).transformDirection(screenMesh.matrixWorld).normalize();

            if (frontDirection.dot(camera.position.clone().sub(target)) < 0) {
                frontDirection.multiplyScalar(-1);
            }

            const distance = window.innerWidth < 768 ? 3.9 : 2.65;
            const cameraPosition = target
                .clone()
                .add(frontDirection.multiplyScalar(distance))
                .add(new THREE.Vector3(0, window.innerWidth < 768 ? 0.22 : 0.08, 0));
            const focusCamera = camera.clone();
            focusCamera.position.copy(cameraPosition);
            focusCamera.lookAt(target);

            isFocused = true;
            animateCameraTo({
                position: cameraPosition,
                quaternion: focusCamera.quaternion,
                duration: 850,
                onComplete: () => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                },
            });
        };

        const loader = new GLTFLoader();
        loader.load(
            '/backgroundThree/scene.gltf',
            (gltf) => {
            if (isDisposed) {
                return;
            }

            const model = gltf.scene;
            scene.add(model);
            styleImportedGroundPlane(model);

            SCREEN_TARGETS.forEach((nodeName, index) => {
                try {
                    const project = projects[index];
                    const screenNode = getObjectByLooseName(model, nodeName);
                    const screenMesh = screenNode ? getScreenMesh(screenNode) : null;

                    if (!project || !screenMesh) {
                        return;
                    }

                    if (nodeName === 'Screen B.001_103') {
                        rotateScreenNodeToward(screenNode, INITIAL_CAMERA_POSITION, THREE.MathUtils.degToRad(15));
                    }

                    if (nodeName === 'Screen D.004_110') {
                        rotateScreenNodePartiallyToward(screenNode, INITIAL_CAMERA_POSITION, 0.28);
                    }

                    const overlayConfig = SCREEN_OVERLAY_CONFIG[nodeName];
                    const overlay = overlayConfig?.useScreenMaterial
                        ? applyProjectScreenMaterial(screenMesh, project, overlayConfig)
                        : createScreenOverlay(screenMesh, project, overlayConfig);

                    screenMeshes.push(overlay);

                    if (nodeName === 'Screen D.004_110') {
                        scrollFocusSubjects.deployAutomation = getScreenFocusSubject(overlay);
                    }

                    if (nodeName === 'Screen D.003_109') {
                        scrollFocusSubjects.realtime = getScreenFocusSubject(overlay);
                    }

                    if (nodeName === 'Screen B.002_107') {
                        scrollFocusSubjects.assetSync = getScreenFocusSubject(overlay);
                    }

                    if (nodeName === 'Screen C.002_106') {
                        scrollFocusSubjects.otpSse = getScreenFocusSubject(overlay);
                    }
                } catch (error) {
                    console.error(`Failed to apply project texture to ${nodeName}`, error);
                }
            });

            if (!isFocused && !isCameraMoving) {
                const frame = getIdleFrame();
                camera.position.copy(frame.position);
                camera.quaternion.copy(frame.quaternion);
            }

            renderScene();
            },
            undefined,
            (error) => {
                console.error('Failed to load background GLTF', error);
            },
        );

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            renderScene();
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY;

            if (!isFocused && !isCameraMoving) {
                const frame = getIdleFrame();
                camera.position.copy(frame.position);
                camera.quaternion.copy(frame.quaternion);
                renderScene();
            }
        };

        const handlePointerMove = (event) => {
            if (!canvasRef.current || isCameraMoving || isFocused) {
                return;
            }

            if (isInteractiveDomTarget(event.target)) {
                document.body.style.cursor = 'default';
                return;
            }

            const position = getPointerPosition(event, canvasRef.current);
            pointer.set(position.x, position.y);
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(screenMeshes, false)[0];
            document.body.style.cursor = hit ? 'pointer' : 'default';
        };

        const handlePointerLeave = () => {
            document.body.style.cursor = 'default';
        };

        const handleClick = (event) => {
            if (!canvasRef.current || isCameraMoving || isFocused) {
                return;
            }

            if (isInteractiveDomTarget(event.target)) {
                return;
            }

            const position = getPointerPosition(event, canvasRef.current);
            pointer.set(position.x, position.y);
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(screenMeshes, false)[0];

            if (hit?.object) {
                focusProject(hit.object);
            }
        };

        renderScene();

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('click', handleClick);

        return () => {
            isDisposed = true;
            resetCameraRef.current = null;
            stopRenderLoop();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('click', handleClick);
            document.body.style.cursor = 'default';
            scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (Array.isArray(object.material)) {
                    object.material.forEach(disposeMaterial);
                } else if (object.material) {
                    disposeMaterial(object.material);
                }
            });
            renderer.dispose();
        };
    }, [projects, theme]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        resetCameraRef.current?.();
    };

    return (
        <>
            <div className="cyber-scene-atmosphere" aria-hidden="true" />
            <canvas className="fixed left-0 top-0 z-[1] h-screen w-screen pointer-events-auto" ref={canvasRef} />
            <ProjectDetailModal isOpen={isModalOpen} project={selectedProject} onClose={handleCloseModal} />
        </>
    );
};

export default BackgroundThree;
