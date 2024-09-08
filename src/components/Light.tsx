import { Lightformer, useHelper } from "@react-three/drei";
import { useRef } from "react";
import { PointLightHelper } from "three";

export default function Light() {
    const pointLight = useRef();
    //  useHelper(pointLight,PointLightHelper,0.3, 'cyan');


    return (<>
        <ambientLight intensity={1} />

        <pointLight
            //ref={pointLight} 
            position={[3, 5.7, -2]} intensity={10} castShadow
            shadow-mapSize={[4096, 4096]}

        />

        {/* <pointLight
            //ref={pointLight} 
            position={[3, 5.7, 2]} intensity={10}
            shadow-mapSize={[4096, 4096]}

        /> */}
        {/* <Lightformer
    color={"#ff00ff"}
    scale={1}
    form={"ring"}
    position={[1.8, 4.3, 1.78]}
    intensity={2}
    visible={true}
    lookAt={[0, 5, 7]}


/> */}
    </>
    )
}