import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { degToRad } from 'three/src/math/MathUtils.js';

// Type definitions
type GLTFResult = GLTF & {
    nodes: {
        [key: string]: THREE.Mesh;
    };
    materials: {
        [key: string]: THREE.Material;
    };
};

interface ModelProps extends React.ComponentProps<'group'> {
    duration?: number;
}

// Material definitions
const createMaterial = (props: THREE.MeshPhysicalMaterialParameters): THREE.MeshPhysicalMaterial => {
    return new THREE.MeshPhysicalMaterial(props);
};

const materials = {
    mirrorLight: createMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 100,
        transparent: true,
        opacity: 0,
    }),
    blackGlossy: createMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 0.1,
    }),
    whiteGlossy: createMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.1,
        clearcoatRoughness: 0.5,
        reflectivity: 0,
    }),
    whitePlastique: createMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 0.1,
        clearcoatRoughness: 0.2,
        reflectivity: 0.1,
    }),
    glass: createMaterial({
        transmission: 0.6,
        roughness: 0.5,
        metalness: 0.1,
        thickness: 2,
        opacity: 1,
        transparent: false,
    }),
    alu: createMaterial({
        color: "#c0c0c0",
        metalness: 0.8,
        roughness: 0.3,
        clearcoat: 0.1,
        clearcoatRoughness: 1,
        reflectivity: 0.1,
    }),
    wall: createMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.3,
        clearcoat: 0.1,
        clearcoatRoughness: 0.3,
        reflectivity: 0.1,
    }),
    woodCadre: createMaterial({
        color: "#85521D",
        metalness: 0.7,
        reflectivity: 1,
    }),
    chevalet: createMaterial({
        roughness: 0.6,
        metalness: 0.4,
        color: "#C4792B",
        reflectivity: 1,
    }),
    parquet: createMaterial({
        roughness: 0.2,
        metalness: 0.1,
        color: "#85521D",
        reflectivity: 0.1,
    }),
    mirror: createMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,


    }),
};

// Material mapping
const materialMapping: { [key: string]: keyof typeof materials } = {
    table: 'whiteGlossy',
    mirror: 'mirror',
    armoirAlu: 'alu',
    trashTop: 'blackGlossy',
    armoirBois: 'whiteGlossy',
    lightMirror: 'mirrorLight',
    Wall: 'wall',
    plastiqueWindow: 'whitePlastique',
    windowGlass: 'glass',
    sprayer: 'blackGlossy',
    encen: 'blackGlossy',
    sprayerBuse: 'blackGlossy',
    vase: 'blackGlossy',
    parquet: 'parquet',
    chevalet: 'chevalet',
    tableau: 'woodCadre',
    tableauscreen: 'whiteGlossy',
    tableauWall:"whiteGlossy",
    tableauWallBlack:"blackGlossy",

};

const Model: React.FC<ModelProps> = (props) => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);
    const { clock, viewport } = useThree();
    const [breakpoint, setBreakpoint] = useState('sm');
    const physicalMAT = useRef();
    const { nodes } = useGLTF("/model/SceneDiplomedistanciel.glb") as GLTFResult;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1536) setBreakpoint('2xl');
            else if (width >= 1280) setBreakpoint('xl');
            else if (width >= 1024) setBreakpoint('lg');
            else if (width >= 768) setBreakpoint('md');
            else setBreakpoint('sm');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setStartTime(clock.elapsedTime);
    }, [clock]);

    useFrame(() => {
        if (startTime === null) return;
        const elapsedTime = clock.getElapsedTime() - startTime;
        const duration = props.duration || 1;
        const progress = Math.min(elapsedTime / duration, 1);

        if (progress === 1) {
            setVisible(true);
        }
    });

    // Responsive values based on breakpoints
    const getResponsiveValues = () => {
        switch (breakpoint) {
            case '2xl':
                return { positionX: -0.15, htmlPosition: [-0.6, 2.9, 9], distanceFactor: 4.9 };
            case 'xl':
                return { positionX: -0.15, htmlPosition: [-0.6, 2.85, 9], distanceFactor: 5.05 };
            case 'lg':
                return { positionX: -0.15, htmlPosition: [.2, 2.8, 9], distanceFactor: 3.6 };
            case 'md':
                return { positionX: -0.18, htmlPosition: [.05, 2.8, 9], distanceFactor: 3.15 };
            default: // 'sm'
                return { positionX: -0.02, htmlPosition: [2.35, 2.7, 9.5], distanceFactor: 2.45 };
        }
    };

    const { positionX, htmlPosition, distanceFactor } = getResponsiveValues();

    return (
        <group {...props} dispose={null}>
            {Object.entries(nodes).map(([key, node]) => (
                <mesh
                    key={key}
                    castShadow
                    receiveShadow
                    geometry={node.geometry}
                    material={materials[materialMapping[key] || 'whiteGlossy']}
                    position-x={key === 'chevalet' || key === 'tableau' || key === 'tableauscreen' ? positionX : undefined}
                />
            ))}

            {visible && (
                <Html
                    wrapperClass="htmlScreen "
                    transform
                    distanceFactor={distanceFactor}
                    //@ts-ignore
                    position={htmlPosition}
                    rotation={[degToRad(5.729578), degToRad(180), 0]}
                >
                    <iframe src="https://dermoacademie.vercel.app/certificat/microshading"></iframe>
                </Html>
            )}
        </group>
    );
};

export default Model;

useGLTF.preload("/model/SceneDiplomedistanciel.glb");