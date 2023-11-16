
import render from './render';

/* ANIMATE LOOP */
// loop that causes renderer to draw scene every time screen is refreshed (around 60 times per second). Pauses when user navigates to another browser tab, hence not wasting processing power and battery life.
/**********************************************************************************************************************/

//@ts-ignore
export function animate(timeline: TimeLine, __retSetUp: {
    renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; scene: THREE.Scene;
}, controls: any, __retParticleBackground?: {
    particleScene: any; particleCamera: any; AMOUNTY: number; AMOUNTX: number; particles: any; particleCount: number
}) {

    requestAnimationFrame(() => animate(timeline, __retSetUp, controls));

    controls.update();

    render(timeline, __retSetUp);

    //stop the spinner / loading animation and render the scenes
    if (timeline.finishedLoading) {

        if (timeline.spinner) {
            setTimeout(function () {
                if (!timeline.spinnerStopped) {
                    console.log("finished loading");
                    timeline.spinner.stop();
                    timeline.spinnerStopped = true;
                }
            }, 600);
        }

    }
}

/**********************************************************************************************************************/
/* END OF ANIMATE LOOP */