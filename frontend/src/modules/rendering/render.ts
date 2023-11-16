/* RENDER METHOD */

/**********************************************************************************************************************/
import TimeLine from "../../timeLine";
import * as THREE from "three";

//@ts-ignore
export default (timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene;
}, __retParticleBackground?: {
    particleScene: any; particleCamera: any; AMOUNTY: number; AMOUNTX: number; particles: any; particleCount: number
}) => {

    if (timeline.finishedLoading) {

        __retSetUp.renderer.render(__retSetUp.scene, __retSetUp.camera)

   }
}

/**********************************************************************************************************************/
/* END OF RENDER METHOD */