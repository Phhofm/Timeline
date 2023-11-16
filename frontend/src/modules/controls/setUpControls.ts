import { MapControls } from "../../../js/MapControlsAdjusted";

/* SET UP CONTROLS */

// this sets up controls and restricts them -> limited panning

/**********************************************************************************************************************/
export default (__retSetUp: {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
}) => {
  const controls = new MapControls(
    __retSetUp.camera,
    __retSetUp.renderer.domElement
  );

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

  controls.dampingFactor = 0.25;

  controls.enableRotate = false;

  controls.enableZoom = true;

  controls.minDistance = 50;

  controls.maxDistance = 80;

  controls.enableKeys = true;

  controls.keyPanSpeed = 40;

  controls.keys = {
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    BOTTOM: 83,
  }; // gamer layout

  controls.panSpeed = 4;

  controls.disableHorizontalPanning = true;

  return controls;
};

/******************************************************************************************************************/
/* END OF SET UP CONTROLS */
