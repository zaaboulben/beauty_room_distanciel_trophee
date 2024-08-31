import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { PointLightHelper } from "three";

export default function Light() {
    const pointLight = useRef();
    useHelper(pointLight,PointLightHelper,0.3, 'cyan');


    return (<>
        <ambientLight intensity={0.2} />

        <pointLight ref={pointLight} position={[3, 5.7, -1]} intensity={10} castShadow 

        />
        </> 
    )
}