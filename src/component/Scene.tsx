"use client"
import { AccumulativeShadows, Environment, EnvironmentMap, Html, Instance, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";
import AnimatedFPSCamera from "./FPSAnimatedCamera";
import { Euler, Vector3 } from 'three';
import FPSAnimatedCamera from "./FPSAnimatedCamera";
import { Suspense } from "react";
import { div } from "three/webgpu";
import Light from "./Light";


export default function Scene() {
    function Loader() {
        const { active, progress, errors, item, loaded, total } = useProgress()
        return <Html center>{progress} % loaded</Html>
      }
      
    const waypoints = [
        { position: { x: 0, y: 3.6, z: 0 }, rotation: new Euler(0, 0, 0), fov: 75 },
        { position: { x: 3, y: 3.6, z: 0 }, rotation: new Euler(0, Math.PI / 2, 0), fov: 70 },
        { position: { x: 0, y: 3.6, z: 0 }, rotation: new Euler(0, Math.PI, 0), fov: 80 },
        { position: { x: 3, y: 3.6, z: 0 }, rotation: new Euler(0, -Math.PI / 2, 0), fov: 65 },
      ];
    return (
      

      <Canvas
      shadows={"enabled"} 

      gl={{ antialias: true }} dpr={[1,2]} 
       camera={{  fov: 60, near:0.1 , far:100}} 

        >
              <Suspense
        fallback={
                    //  <div className="absolute w-full h-full flex items-center justify-center">
                    //      <p className="text-white text-2xl">Loading.....</p>
                    //  </div>
                 <Loader/>
                 }>
       


            <Environment
            

            // files={[
            //     "/beautyroomenvmapv2/px.png",
            //     "/beautyroomenvmapv2/nx.png",
            //     "/beautyroomenvmapv2/py.png",
            //     "/beautyroomenvmapv2/ny.png",
            //     "/beautyroomenvmapv2/pz.png",
            //     "/beautyroomenvmapv2/nz.png",
            //     ]} 
                    background={true}

                    path="/beautyroomenvmapv2/"
                   environmentIntensity={1}
                />   


        
        <Model
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
        />

<FPSAnimatedCamera 
        duration={20} 
        eyeHeight={2.6} 
        showPath={true} 
        fov={75}   
           />
      <Light/>
      <OrbitControls
      makeDefault
      />
</Suspense>

      </Canvas>

    );
    }   
