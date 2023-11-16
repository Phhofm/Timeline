//import render from '../rendering/render';
import * as THREE from 'three';
import strapiEvent from '../../classes/strapiEvent';
import strapiTimespan from '../../classes/strapiTimespan';
import strapiEra from '../../classes/strapiEra';
import intersectionLogic from '../../logic/intersection';
import onClickLogic from '../../logic/onClick';
import handleGesture from './handleGesture';
import TimeLine from "../../timeLine";

/* ADD EVENT LISTENERS */

/**********************************************************************************************************************/
export default (timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene;
}, __retFetchData: {
    timelineStartDate: number; timelineEndDate: number; strapiEventObjects: strapiEvent[];strapiEraObjects: strapiEra[]; strapiTimespanObjects: strapiTimespan[];
}, __retParticleBackground?: {
    particleScene: any; particleCamera: any; AMOUNTY: number; AMOUNTX: number; particles: any; particleCount: number;
}) => {
    
    if (timeline.rotateScene) {
        document.onmousemove = (e) => {
            const mouseTolerance = 0.008;
            const centerX = window.innerWidth * 0.5;
            const centerY = window.innerHeight * 0.5;
            __retSetUp.scene.rotation.y = (e.clientX - centerX) / centerX * mouseTolerance;
            if (__retParticleBackground) {
                __retParticleBackground.particleScene.rotation.y = (e.clientX - centerX) / centerX * mouseTolerance * 20;
                __retParticleBackground.particleScene.rotation.x = (e.clientY - centerY) / centerY * mouseTolerance / 2;
            }
        }
    }

    // RAYCASTER
    const raycaster: THREE.Raycaster = new THREE.Raycaster();

    // MOUSE
    const mouse: THREE.Vector2 = new THREE.Vector2;

    // Variables for mousemove
    let copyb: number; //those are the rgb values therefore the names
    let copyg: number;
    let copyr: number;
    let resetEventPlaneColor: boolean = false;
    let eventPlaneColorChanged: THREE.Mesh;

    let mousestartX: number;
    let mousestartY: number;
    let mousestopX: number;
    let mousestopY: number;

    // Variables for Gesture
    const pageWidth: number = window.innerWidth || document.body.clientWidth;
    const threshold: number = Math.max(1, Math.floor(0.01 * (pageWidth))); // threshold value determines if user swiped or tapped. If user moved finger less than threshold => tap, otherwise swipe.
    let touchstartX: number = 0;
    let touchstartY: number = 0;
    let touchendX: number = 0;
    let touchendY: number = 0;

    /* LISTENERS */
    /******************************************************************************************************************/

    window.addEventListener('resize', (() => { // responsiveness. called every time window gets resized. Dont put heavy computation, might get called a lot
        __retSetUp.camera.aspect = timeline.container.clientWidth / timeline.container.clientHeight; // set aspect ratio to match new browser window aspect ratio
        __retSetUp.camera.updateProjectionMatrix(); // update the camera's frustum
        __retSetUp.renderer.setSize(timeline.container.clientWidth, timeline.container.clientHeight); // update the size of the renderer AND the canvas
    }) as EventListener);

    document.addEventListener('mousemove', ((event: MouseEvent) => { // desktop show interactivibility of eventplanes (colorchange)
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, __retSetUp.camera);

        const __retIntersectionLogic: {
            copyb: number,
            copyg: number,
            copyr: number,
            resetEventPlaneColor: boolean,
            eventPlaneColorChanged: THREE.Mesh,
            setColors: boolean
        } = intersectionLogic(timeline, raycaster, resetEventPlaneColor, eventPlaneColorChanged, copyr, copyg, copyb);
        copyb = __retIntersectionLogic.copyb;
        copyg = __retIntersectionLogic.copyg;
        copyr = __retIntersectionLogic.copyr;
        resetEventPlaneColor = __retIntersectionLogic.resetEventPlaneColor;
        eventPlaneColorChanged = __retIntersectionLogic.eventPlaneColorChanged;

        /*
        if (__retParticleBackground) {
            render(timeline, __retSetUp, __retParticleBackground);
        } else {
            render(timeline, __retSetUp);
        }
        */
    }) as EventListener);

    document.addEventListener('mousedown', ((event: MouseEvent) => { // touch devices
        mousestartX = event.x;
        mousestartY = event.y;
    }) as EventListener);

    document.addEventListener('mouseup', ((event: MouseEvent) => { // desktop interaktion with eventplanes
        mousestopX = event.x;
        mousestopY = event.y;

        if (!(mousestartX - mousestopX > threshold || mousestartY - mousestopY > threshold || mousestartX - mousestopX < -threshold || mousestartY - mousestopY < -threshold)) {
            raycaster.setFromCamera(mouse, __retSetUp.camera);
            onClickLogic(timeline, __retSetUp.scene, raycaster, __retFetchData);
        }

        // which timeperiod the camera is in
        timeline.currentTimePeriod = "";

        // Check
        for (const period in timeline.indexedArrayDefaultEvents) {
            // overwrite, this will finally give us the latest timeperiod that we are in
            if (__retSetUp.camera.position.z < timeline.indexedArrayDefaultEvents[period]) {
                timeline.currentTimePeriod = period;
            }
        }

        const divToShowPeriod = document.getElementById('infoControls');
        if (divToShowPeriod) { // not null (or undefined/NaN/''/0/false) check
            divToShowPeriod.innerHTML = timeline.currentTimePeriod;
        }

    }) as EventListener);

    document.addEventListener('touchstart', ((event: TouchEvent) => { // touch devices
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }) as EventListener);

    document.addEventListener('touchend', ((event: TouchEvent) => { // touch devices
        mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        raycaster.setFromCamera(mouse, __retSetUp.camera);
        handleGesture(timeline, __retFetchData, __retSetUp.scene, raycaster, threshold, touchstartX, touchstartY, touchendX, touchendY);
    }) as EventListener);

    console.log("end of add eventlisteners");
}

/**********************************************************************************************************************/
/* END OF ADD EVENT LISTENERS */