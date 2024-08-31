import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, CatmullRomCurve3, Quaternion, MathUtils } from 'three';
import { Line, OrbitControls } from '@react-three/drei';

interface FPSAnimatedCameraProps {
  duration?: number;
  eyeHeight?: number;
  fov?: number;
  showPath?: boolean;
}

const FPSAnimatedCamera: React.FC<FPSAnimatedCameraProps> = ({ 
  duration = 20, 
  eyeHeight = 1.6, 
  fov = 75,
  showPath = true,
}) => {
  const { clock, camera, size } = useThree();
  const [startTime, setStartTime] = useState<number | null>(null);
  const progress = useRef(0);
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());
  const endReached = useRef(false);

  const points = useMemo(() => [
    new Vector3(10, eyeHeight, 0),
    new Vector3(5, eyeHeight, 0),
    new Vector3(5, eyeHeight, -6),
    new Vector3(2.2, eyeHeight, -7),
    new Vector3(2.2, eyeHeight-0.1, -6),
  ], [eyeHeight]);

  const curve = useMemo(() => new CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points]);

  const curveLength = useMemo(() => {
    const divisions = 100;
    let length = 0;
    for (let i = 1; i <= divisions; i++) {
      const point1 = curve.getPoint((i - 1) / divisions);
      const point2 = curve.getPoint(i / divisions);
      length += point1.distanceTo(point2);
    }
    return length;
  }, [curve]);

  useEffect(() => {
    setStartTime(clock.getElapsedTime());
    //@ts-ignore
    camera.fov = fov;
    camera.updateProjectionMatrix();
    currentPosition.current.copy(curve.getPoint(0));
    currentLookAt.current.copy(curve.getPoint(0.01));
  }, [clock, camera, fov, curve]);

  useFrame(() => {
    if (startTime === null) return;

    const elapsedTime = clock.getElapsedTime() - startTime;
    const rawProgress = Math.min(elapsedTime / duration, 1);

    if (rawProgress === 1 && !endReached.current) {
      endReached.current = true;
      console.log(rawProgress);
      
    }
  
        

    if (!endReached.current) {
      // Smooth out the progress
      progress.current = MathUtils.lerp(progress.current, rawProgress, 0.05);

      const targetPosition = curve.getPoint(progress.current);
      currentPosition.current.lerp(targetPosition, 0.1);

      const lookAheadT = Math.min(progress.current + 0.01, 1);
      const targetLookAt = curve.getPoint(lookAheadT);
      currentLookAt.current.lerp(targetLookAt, 0.1);

      camera.position.copy(currentPosition.current);
      camera.lookAt(currentLookAt.current);
     
    } else {
      // Keep the last valid position and lookAt after animation ends
      camera.position.copy(currentPosition.current);
      camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <>
      {showPath && <Line points={curve.getPoints(100)} color="red" />}
 
    </>
  );
};

export default FPSAnimatedCamera;