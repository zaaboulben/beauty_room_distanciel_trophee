import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, CatmullRomCurve3, MathUtils } from 'three';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { Line, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';

interface SimpleCameraMovement {
  duration?: number;
  eyeHeight?: number;
  fov?: number;
}

const SimpleCameraMovement: React.FC<SimpleCameraMovement> = ({
  duration = 2,
  eyeHeight = 1.6,
  fov = 75,
}) => {
  const { camera, clock, scene, viewport } = useThree();
  const [startTime] = useState<number>(clock.getElapsedTime());
  const progress = useRef(0);
  const blurRef = useRef<THREE.Mesh<THREE.CircleGeometry, THREE.MeshPhysicalMaterial>>(null);

  const [breakpoint, setBreakpoint] = useState('sm');

  const { transmission, reflectivity, roughness, opacity } = useControls({
    transmission: { value: 1, min: 0, max: 1 },
    reflectivity: { value: 0.31, min: 0, max: 1 },
    roughness: { value: 0.5, min: 0, max: 1 },
    opacity: { value: 0.0, min: 0, max: 1 }
  });

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

  const points = useMemo(() => {
    switch (breakpoint) {
      case '2xl':
        return [
          new Vector3(2.29, eyeHeight + 1.2, -5),
          new Vector3(2.29, eyeHeight, -3.5),
          new Vector3(2.29, eyeHeight - 0.25, -1.7), // Position finale ajustée pour 2xl
        ];
      case 'xl':
        return [
          new Vector3(2.29, eyeHeight + 1.1, -4.5),
          new Vector3(2.29, eyeHeight - 0.1, -3.2),
          new Vector3(2.29, eyeHeight - 0.25, -1.7),
        ];
      case 'lg':
        return [
          new Vector3(2.29, eyeHeight + 1, -4),
          new Vector3(2.29, eyeHeight - 0.2, -3),
          new Vector3(2.29, eyeHeight - 0.25, -1.9),
        ];
      case 'md':
        return [
          new Vector3(2.29, eyeHeight + 1.3, -5),
          new Vector3(2.29, eyeHeight + 0.2, -3.5),
          new Vector3(2.29, eyeHeight - 0.25, -2),
        ];
      default: // 'sm'
        return [
          new Vector3(2.29, eyeHeight + 1.5, -6),
          new Vector3(2.29, eyeHeight, -5),
          new Vector3(2.29, eyeHeight - 0.25, -2.3),
        ];
    }
  }, [eyeHeight, breakpoint]);

  const lookAtTarget = useMemo(() => {
    switch (breakpoint) {
      case '2xl':
        return new Vector3(2.295, eyeHeight - 0.3, -1.2); // Ajusté pour correspondre à la nouvelle position finale
      case 'xl':
        return new Vector3(2.295, eyeHeight - 0.3, -1);
      case 'lg':
      case 'md':
        return new Vector3(2.295, eyeHeight - 0.3, -1.2);
      default: // 'sm'
        return new Vector3(2.295, eyeHeight - 0.3, -1.5);
    }
  }, [eyeHeight, breakpoint]);


  const curve = useMemo(() => new CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points]);

  const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, x * 3);

  useEffect(() => {
    //@ts-ignore

    camera.fov = breakpoint === 'sm' ? fov + 5 : fov;
    camera.position.copy(curve.getPoint(0));
    camera.lookAt(lookAtTarget);
    camera.updateProjectionMatrix();
  }, [camera, curve, lookAtTarget, fov, breakpoint]);

  const mirrorPoints = useMemo(() => {
    return [
      new Vector3(2.29, eyeHeight, 4),
      new Vector3(2.29, eyeHeight, 3),
      new Vector3(2.29, eyeHeight, 0),
    ];
  }, [eyeHeight]);

  const mirrorCurve = useMemo(() => new CatmullRomCurve3(mirrorPoints, false, 'catmullrom', 0.5), [mirrorPoints]);

  useFrame(() => {
    const elapsedTime = clock.getElapsedTime() - startTime;
    const rawProgress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easeOutQuint(rawProgress);
    progress.current = easedProgress;

    const targetPosition = curve.getPoint(progress.current);
    camera.position.copy(targetPosition);
    camera.lookAt(lookAtTarget);

    if (blurRef.current && blurRef.current.material) {
      const mirrorPosition = mirrorCurve.getPoint(progress.current);
      blurRef.current.position.copy(mirrorPosition);
      blurRef.current.lookAt(camera.position);

      const distance = camera.position.distanceTo(mirrorPosition);
      //@ts-ignore

      const vFov = camera.fov * Math.PI / 180;
      const height = 2 * Math.tan(vFov / 2) * distance * 1.5;
      //@ts-ignore

      const width = height * camera.aspect * 1.5;
      blurRef.current.scale.set(width, height, 1);
    }
  });

  return (
    <>
      <mesh
        position-z={0}
        ref={blurRef}
        rotation={[0, THREE.MathUtils.degToRad(180), 0]}
      >
        <meshPhysicalMaterial
          transmission={transmission}
          roughness={roughness}
          opacity={opacity}
          reflectivity={reflectivity}
        />
        <circleGeometry args={[1, 32]} />
      </mesh>

      {/* <Line
        points={mirrorCurve.getPoints(100)}
        color="blue"
      /> */}
    </>
  );
};

export default SimpleCameraMovement;