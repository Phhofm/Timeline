import onClickLogic from '../../logic/onClick';
import TimeLine from "../../timeLine";
/* HANDLE GESTURE METHOD */
// this is to adapt to touch devices, using a threshold to determine if user wanted to swipe or click. Otherwise swiping would open click methods if stopped or started over an eventplane previously
/**********************************************************************************************************************/
export default (timeline: TimeLine, __retFetchData: any, scene: THREE.Scene, raycaster: THREE.Raycaster, threshold: number, touchstartX: number, touchstartY: number, touchendX: number, touchendY: number) => {
    const x: number = touchendX - touchstartX;
    const y: number = touchendY - touchstartY;

    if (Math.abs(x) > threshold || Math.abs(y) > threshold) { // swipe logic
    } else { // tap logic
        onClickLogic(timeline, scene, raycaster, __retFetchData);
    }
}

/**********************************************************************************************************************/
/* END OF HANDLE GESTURE METHOD */